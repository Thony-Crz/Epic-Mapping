using Application.UseCases.AuthenticateUser;
using Domain.Entities;
using Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace Application.UnitTests.Authentification
{
    public class AuthenticateUserHandlerTests
    {
        private Mock<IAuthenticationService> _mockAuthService;
        private AuthenticateUserHandler _handler;

        [SetUp]
        public void Setup()
        {
            _mockAuthService = new Mock<IAuthenticationService>();
            _handler = new AuthenticateUserHandler(_mockAuthService.Object);
        }


        [Test]
        public async Task Handle_ShouldReturnAuthenticateUserResult_WhenAuthorizationCodeIsValid()
        {
            // Arrange
            var request = new AuthenticateUserCommand("valid-code", "https://localhost/callback");
            var expectedAuthResult = new AuthResult
            {
                AccessToken = "azure-token",
                JwtToken = "jwt-app-token",
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                UserName = "john.doe"
            };

            _mockAuthService
                .Setup(s => s.AuthenticateWithOAuthAsync(request.AuthorizationCode, request.RedirectUri))
                .ReturnsAsync(expectedAuthResult);

            // Act
            var result = await _handler.Handle(request, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.JwtToken.Should().Be(expectedAuthResult.JwtToken);
            result.UserName.Should().Be(expectedAuthResult.UserName);
            result.ExpiresAt.Should().BeCloseTo(expectedAuthResult.ExpiresAt, TimeSpan.FromSeconds(1));
        }

    }
}
