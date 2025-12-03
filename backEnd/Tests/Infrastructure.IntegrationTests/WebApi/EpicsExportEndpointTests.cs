using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using NUnit.Framework;

namespace Infrastructure.IntegrationTests.WebApi;

public class EpicsExportEndpointTests
{
    private ReadyEpicApiFactory _factory = null!;

    [SetUp]
    public void SetUp()
    {
        _factory = new ReadyEpicApiFactory();
        _factory.EpicRepository.Clear();
        _factory.AuditRepository.Clear();
    }

    [TearDown]
    public void TearDown()
    {
        _factory.Dispose();
    }

    [Test]
    public async Task Ready_epic_returns_export_payload_and_audit_record()
    {
        var epicId = Guid.NewGuid();
        _factory.EpicRepository.SetProjection(ReadyEpicProjectionFactory.CreateReady(epicId));

        using var client = _factory.CreateClient();
        var response = await client.GetAsync($"/api/epics/{epicId}/export");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("application/json"));
        var fileName = response.Content.Headers.ContentDisposition?.FileNameStar
            ?? response.Content.Headers.ContentDisposition?.FileName
            ?? string.Empty;
        Assert.That(fileName, Does.StartWith("epic-").And.EndsWith(".json"));

        var payload = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(payload);
        var epicIdFromPayload = document.RootElement.GetProperty("meta").GetProperty("epic_id").GetGuid();
        Assert.That(epicIdFromPayload, Is.EqualTo(epicId));

        var auditRecord = _factory.AuditRepository.LastRecord;
        Assert.That(auditRecord, Is.Not.Null, "Audit record should be persisted for ready exports.");
        Assert.That(auditRecord!.Status, Is.EqualTo("Succeeded"));
        Assert.That(auditRecord.Payload, Is.Not.Empty);
    }

    [Test]
    public async Task Non_ready_epic_returns_conflict()
    {
        var epicId = Guid.NewGuid();
        _factory.EpicRepository.SetProjection(ReadyEpicProjectionFactory.CreateNotReady(epicId));

        using var client = _factory.CreateClient();
        var response = await client.GetAsync($"/api/epics/{epicId}/export");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Conflict));
        var body = await response.Content.ReadAsStringAsync();
        Assert.That(body, Does.Contain("Ready"));
    }

    [Test]
    public async Task Unknown_epic_returns_not_found()
    {
        using var client = _factory.CreateClient();
        var response = await client.GetAsync($"/api/epics/{Guid.NewGuid()}/export");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }

    [Test]
    public async Task Rapid_repeat_requests_trigger_rate_limit()
    {
        var epicId = Guid.NewGuid();
        _factory.SetTokenRateLimit(1);
        _factory.EpicRepository.SetProjection(ReadyEpicProjectionFactory.CreateReady(epicId));

        using var client = _factory.CreateClient();

        var first = await client.GetAsync($"/api/epics/{epicId}/export");
        Assert.That(first.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var second = await client.GetAsync($"/api/epics/{epicId}/export");
        Assert.That(second.StatusCode, Is.EqualTo((HttpStatusCode)429));
    }
}
