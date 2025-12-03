using Application.DTOs.Auth;
using Application.Interfaces;
using Application.UseCases.Auth;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Moq;

namespace Application.UnitTests.Auth
{
    [TestFixture]
    public class LoginWithOAuthProviderTests
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
            var authCode = "auth-code-123";

            var gitHubId = "12345";
            var login = "johndoe";
            var email = "john@example.com";
            var name = "John Doe";
            var avatarUrl = "https://example.com/avatar.jpg";

            var expectedToken = "fake.jwt.token";

            _authService
                .Setup(x => x.GetGitHubUserInfoAsync(authCode))
                .ReturnsAsync(new GitHubUserInfo(gitHubId, login, name, email, avatarUrl));

            _userRepository
                .Setup(x => x.GetByGitHubIdAsync(gitHubId))
                .ReturnsAsync((User?)null);

            _userRepository
                .Setup(x => x.AddAsync(It.IsAny<User>()))
                .ReturnsAsync((User u) => u);

            _authService
                .Setup(x => x.GenerateTokenAsync(It.IsAny<User>()))
                .ReturnsAsync(expectedToken);

            var command = new LoginWithOAuthProviderCommand("GitHub", authCode);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Token, Is.EqualTo(expectedToken));
            Assert.That(result.User.Email, Is.EqualTo(email));
            Assert.That(result.User.Name, Is.EqualTo(name));

            _userRepository.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Once);
        }

        [Test]
        public async Task Should_Return_Existing_User_If_Already_Registered()
        {
            // Arrange
            var authCode = "auth-code-123";

            var gitHubId = "12345";
            var login = "johndoe";
            var email = "john@example.com";
            var name = "John Doe";
            var avatarUrl = "https://example.com/avatar.jpg";

            var existingUser = new User(gitHubId, email, name, avatarUrl);
            var expectedToken = "fake.jwt.token";

            _authService
                .Setup(x => x.GetGitHubUserInfoAsync(authCode))
                .ReturnsAsync(new GitHubUserInfo(gitHubId, login, name, email, avatarUrl));

            _userRepository
                .Setup(x => x.GetByGitHubIdAsync(gitHubId))
                .ReturnsAsync(existingUser);

            _authService
                .Setup(x => x.GenerateTokenAsync(existingUser))
                .ReturnsAsync(expectedToken);

            var command = new LoginWithOAuthProviderCommand("GitHub", authCode);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Token, Is.EqualTo(expectedToken));

            _userRepository.Verify(x => x.AddAsync(It.IsAny<User>()), Times.Never);
        }

        [Test]
        public void Should_Throw_When_GitHub_Auth_Fails()
        {
            // Arrange
            var authCode = "invalid-code";

            _authService
                .Setup(x => x.GetGitHubUserInfoAsync(authCode))
                .ReturnsAsync((GitHubUserInfo?)null);

            var command = new LoginWithOAuthProviderCommand("GitHub", authCode);

            // Act & Assert
            Assert.ThrowsAsync<InvalidOperationException>(async () =>
                await _handler.Handle(command, CancellationToken.None));
        }
    }
}
