using System;
using System.Collections.Generic;
using Application.Common.Interfaces;
using Application.Epics;
using Application.Epics.Abstractions;
using Application.Epics.Exceptions;
using Application.Epics.Models;
using Domain.Epics.Exceptions;
using Domain.Epics.Policies;
using Domain.Epics.ReadModel;
using FluentAssertions;
using Moq;

namespace Application.UnitTests.Epics;

[TestFixture]
public class ExportReadyEpicHandlerTests
{
    private readonly Guid _epicId = Guid.NewGuid();
    private readonly string _requestedBy = "alba.martin@epicmapping.com";

    private Mock<IEpicRepository> _epicRepository = null!;
    private Mock<IReadyEpicExportPolicy> _policy = null!;
    private Mock<IEpicExportMapper> _mapper = null!;
    private Mock<IEpicExportSerializer> _serializer = null!;
    private Mock<IExportAuditRepository> _auditRepository = null!;
    private ExportReadyEpicHandler _handler = null!;

    [SetUp]
    public void SetUp()
    {
        _epicRepository = new Mock<IEpicRepository>();
        _policy = new Mock<IReadyEpicExportPolicy>();
        _mapper = new Mock<IEpicExportMapper>();
        _serializer = new Mock<IEpicExportSerializer>();
        _auditRepository = new Mock<IExportAuditRepository>();

        _handler = new ExportReadyEpicHandler(
            _epicRepository.Object,
            _policy.Object,
            _mapper.Object,
            _serializer.Object,
            _auditRepository.Object);
    }

    [Test]
    public async Task Handle_WhenEpicIsReady_ShouldSerializeAndRecordAudit()
    {
        // Arrange
        var projection = FakeReadyEpicProjection.Create(_epicId);
        _epicRepository
            .Setup(repo => repo.GetReadyEpicAsync(_epicId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(projection);

        var document = TestDocument(_epicId);
        _mapper
            .Setup(mapper => mapper.Map(It.IsAny<ReadyEpicExportContext>()))
            .Returns(document);

        var envelope = new EpicExportEnvelope(
            "{ \"meta\": { \"schema_version\": \"1.0.0\" } }",
            "epic-ready-001.json",
            "application/json",
            "abc123",
            "Download");

        _serializer
            .Setup(serializer => serializer.Serialize(document, It.IsAny<CancellationToken>()))
            .Returns(envelope);

        // Act
        var result = await _handler.Handle(new ExportReadyEpicQuery(_epicId, _requestedBy), CancellationToken.None);

        // Assert
        result.FileName.Should().Be(envelope.FileName);
        result.ContentType.Should().Be(envelope.ContentType);
        result.Payload.Should().Be(envelope.Json);
        result.Checksum.Should().Be(envelope.Checksum);

        _policy.Verify(policy => policy.EnsureCanExport(projection), Times.Once);
        _mapper.Verify(mapper => mapper.Map(It.Is<ReadyEpicExportContext>(ctx => ReferenceEquals(ctx.Epic, projection) && ctx.ExportedBy == _requestedBy)), Times.Once);
        _serializer.Verify(serializer => serializer.Serialize(document, It.IsAny<CancellationToken>()), Times.Once);
        _auditRepository.Verify(repo => repo.RecordAsync(
            It.Is<ExportAuditRecord>(record =>
                record.EpicId == _epicId &&
                record.ExportedBy == _requestedBy &&
                record.Status == "Succeeded" &&
                record.DeliveryChannel == envelope.DeliveryChannel &&
                record.Checksum == envelope.Checksum &&
                record.Payload == envelope.Json &&
                record.SchemaVersion == document.Meta.SchemaVersion &&
                record.FileName == envelope.FileName &&
                record.FailureReason == null &&
                record.Snapshot.Meta.EpicId == _epicId),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public void Handle_WhenEpicIsMissing_ShouldThrowEpicNotFoundException()
    {
        // Arrange
        _epicRepository
            .Setup(repo => repo.GetReadyEpicAsync(_epicId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((IReadyEpicProjection?)null);

        // Act
        Func<Task> act = async () => await _handler.Handle(new ExportReadyEpicQuery(_epicId, _requestedBy), CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<EpicNotFoundException>();
        _mapper.Verify(mapper => mapper.Map(It.IsAny<ReadyEpicExportContext>()), Times.Never);
        _serializer.Verify(serializer => serializer.Serialize(It.IsAny<EpicExportDocument>(), It.IsAny<CancellationToken>()), Times.Never);
        _auditRepository.Verify(repo => repo.RecordAsync(It.IsAny<ExportAuditRecord>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public void Handle_WhenPolicyRejectsEpic_ShouldSurfaceValidationException()
    {
        // Arrange
        var projection = FakeReadyEpicProjection.Create(_epicId);
        _epicRepository
            .Setup(repo => repo.GetReadyEpicAsync(_epicId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(projection);

        _policy
            .Setup(policy => policy.EnsureCanExport(projection))
            .Throws(new ReadyEpicExportValidationException("Epic is not Ready"));

        // Act
        Func<Task> act = async () => await _handler.Handle(new ExportReadyEpicQuery(_epicId, _requestedBy), CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<ReadyEpicExportValidationException>();
        _mapper.Verify(mapper => mapper.Map(It.IsAny<ReadyEpicExportContext>()), Times.Never);
        _serializer.Verify(serializer => serializer.Serialize(It.IsAny<EpicExportDocument>(), It.IsAny<CancellationToken>()), Times.Never);
        _auditRepository.Verify(repo => repo.RecordAsync(It.IsAny<ExportAuditRecord>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task Handle_WhenSerializerFails_ShouldRecordFailedAuditAndRethrow()
    {
        // Arrange
        var projection = FakeReadyEpicProjection.Create(_epicId);
        _epicRepository
            .Setup(repo => repo.GetReadyEpicAsync(_epicId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(projection);

        var document = TestDocument(_epicId);
        _mapper
            .Setup(mapper => mapper.Map(It.IsAny<ReadyEpicExportContext>()))
            .Returns(document);

        var serializationException = new InvalidOperationException("serializer boom");
        _serializer
            .Setup(serializer => serializer.Serialize(document, It.IsAny<CancellationToken>()))
            .Throws(serializationException);

        // Act
        Func<Task> act = async () => await _handler.Handle(new ExportReadyEpicQuery(_epicId, _requestedBy), CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>();

        _auditRepository.Verify(repo => repo.RecordAsync(
            It.Is<ExportAuditRecord>(record =>
                record.EpicId == _epicId &&
                record.Status == "Failed" &&
                record.FailureReason == serializationException.Message &&
                record.Payload == string.Empty &&
                record.FileName == string.Empty &&
                record.Snapshot.Meta.EpicId == _epicId),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    private static EpicExportDocument TestDocument(Guid epicId)
    {
        return new EpicExportDocument(
            new EpicExportMeta("1.0.0", DateTimeOffset.UtcNow, "alba.martin@epicmapping.com", "Download", epicId, null, null),
            new EpicExportEpic(
                epicId,
                "EPIC-READY-001",
                "Pilot",
                "Seed epic",
                "Ready",
                "owner@epicmapping.com",
                "Experience",
                "2025.1",
                80,
                21,
                "High",
                Array.Empty<string>(),
                Array.Empty<EpicExportDependency>(),
                Array.Empty<EpicExportChecklistItem>(),
                new[] { "Criterion" },
                Array.Empty<EpicExportStoryRef>(),
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow),
            Array.Empty<EpicExportFeature>(),
            new EpicExportLinks(Array.Empty<string>(), Array.Empty<string>(), Array.Empty<EpicExportStoryRef>()));
    }

    private sealed class FakeReadyEpicProjection : IReadyEpicProjection
    {
        private FakeReadyEpicProjection(Guid epicId)
        {
            Id = epicId;
            Key = "EPIC-READY-001";
            Title = "Pilot";
            Summary = "Seed epic for export";
            Status = "Ready";
            Owner = "owner@epicmapping.com";
            Tribe = "Experience";
            TargetRelease = "2025.1";
            BusinessValue = 80;
            Estimate = 21;
            Confidence = "High";
            Tags = new List<string> { "ready", "export" };
            Dependencies = new List<DependencyProjection>
            {
                new(Guid.NewGuid(), "EPIC-100", "Customer Identity", "epic", "Done")
            };
            ReadinessChecklist = new List<ChecklistItemProjection>
            {
                new("dor-1", "Acceptance criteria defined", true, null),
                new("dor-2", "Feasibility reviewed", true, "")
            };
            AcceptanceCriteria = new List<string>
            {
                "Export includes readiness checklist",
                "JSON matches schema"
            };
            LinkedStories = new List<StoryProjection>
            {
                new(Guid.NewGuid(), "FEAT-READY-ALPHA", "Bootstrap", "Ready", "feature", 1),
                new(Guid.NewGuid(), "SCN-READY-001", "Scenario A", "Ready", "scenario", 1)
            };
            ReadyAt = DateTimeOffset.UtcNow;
            UpdatedAt = DateTimeOffset.UtcNow;
            Features = new List<FeatureProjection>
            {
                new(
                    Guid.NewGuid(),
                    "FEAT-READY-ALPHA",
                    "Bootstrap",
                    "Ready",
                    1,
                    "Bootstrap the initiative",
                    new List<string> { "backend" },
                    new List<ScenarioProjection>
                    {
                        new(Guid.NewGuid(), "Scenario A", "Ready", 1, "Primary happy path", new List<string> { "Given ready epic" })
                    })
            };
        }

        public Guid Id { get; }
        public string Key { get; }
        public string Title { get; }
        public string Summary { get; }
        public string Status { get; }
        public string Owner { get; }
        public string? Tribe { get; }
        public string? TargetRelease { get; }
        public int BusinessValue { get; }
        public int Estimate { get; }
        public string Confidence { get; }
        public IReadOnlyList<string> Tags { get; }
        public IReadOnlyList<DependencyProjection> Dependencies { get; }
        public IReadOnlyList<ChecklistItemProjection> ReadinessChecklist { get; }
        public IReadOnlyList<string> AcceptanceCriteria { get; }
        public IReadOnlyList<StoryProjection> LinkedStories { get; }
        public DateTimeOffset ReadyAt { get; }
        public DateTimeOffset UpdatedAt { get; }
        public IReadOnlyList<FeatureProjection> Features { get; }

        public static FakeReadyEpicProjection Create(Guid epicId) => new(epicId);
    }
}
