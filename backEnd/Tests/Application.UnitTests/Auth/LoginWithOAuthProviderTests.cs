using Application.DTOs.Auth;
using Application.Interfaces;
using Application.UseCases.Auth;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Moq;

namespace Application.UnitTests.Auth
{
    internal class LoginWithOAuthProviderTests
    {
        private Mock<IUserRepository> _userRepository = null!;
        private Mock<IAuthService> _authService = null!;
        private LoginWithOAuthProviderHandler _handler = null!;

        [SetUp]
        public void SetUp()
        {
            _userRepository = new Mock<IUserRepository>();
            _authService = new Mock<IAuthService>();
            _handler = new LoginWithOAuthProviderHandler(_userRepository.Object, _authService.Object);
        }

        [Test]
        public async Task Should_Create_User_If_Not_Exists()
        {
            // Arrange
            var provider = "GitHub";
            var authCode = "auth-code-123";

            var providerUserId = "github|abc123";
            var email = "john@example.com";
            var name = "John Doe";

            var expectedUser = new User(providerUserId, email, name);
            var expectedToken = "fake.jwt.token";

            _authService
                .Setup(x => x.GetUserInfoFromProviderAsync(provider, authCode))
                .ReturnsAsync(new OAuthUserInfoDto(providerUserId, email, name));

            _userRepository
                .Setup(x => x.FindByProviderIdAsync(providerUserId))
                .ReturnsAsync((User)null!);

            _userRepository
                .Setup(x => x.AddAsync(It.IsAny<User>()))
                .ReturnsAsync(expectedUser);

            _authService
                .Setup(x => x.GenerateTokenAsync(It.IsAny<User>()))
                .ReturnsAsync(expectedToken);

            var command = new LoginWithOAuthProviderCommand(provider, authCode);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not.Null);

            var expectedDto = new UserTokenDto(
              new UserDto(expectedUser.Email, expectedUser.Name),
              expectedToken
            );

            Assert.That(result, Is.EqualTo(expectedDto));

            _userRepository.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Once);
        }
    }
}
