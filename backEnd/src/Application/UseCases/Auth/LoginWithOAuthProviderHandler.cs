using Application.DTOs.Auth;
using Application.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.UseCases.Auth
{
    public class LoginWithOAuthProviderHandler : IRequestHandler<LoginWithOAuthProviderCommand, UserTokenDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;

        public LoginWithOAuthProviderHandler(IUserRepository userRepository, IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        public async Task<UserTokenDto> Handle(LoginWithOAuthProviderCommand request, CancellationToken cancellationToken)
        {
            // Get user info from GitHub
            var gitHubUser = await _authService.GetGitHubUserInfoAsync(request.AuthCode);
            if (gitHubUser == null)
            {
                throw new InvalidOperationException("Failed to authenticate with GitHub");
            }

            // Check if user already exists
            var existingUser = await _userRepository.GetByGitHubIdAsync(gitHubUser.Id);
            if (existingUser != null)
            {
                var token = await _authService.GenerateTokenAsync(existingUser);
                return new UserTokenDto(
                    new UserDto(existingUser.Email, existingUser.Name),
                    token
                );
            }

            // Create new user (pending approval)
            var newUser = new Domain.Entities.User(
                gitHubUser.Id,
                gitHubUser.Email ?? "",
                gitHubUser.Name ?? gitHubUser.Login,
                gitHubUser.AvatarUrl
            );

            await _userRepository.AddAsync(newUser);
            var newToken = await _authService.GenerateTokenAsync(newUser);

            return new UserTokenDto(
                new UserDto(newUser.Email, newUser.Name),
                newToken
            );
        }
    }
}
