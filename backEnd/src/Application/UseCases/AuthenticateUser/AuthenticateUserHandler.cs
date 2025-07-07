using Application.DTOs.Authentication;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.AuthenticateUser
{
    public record AuthenticateUserCommand(string AuthorizationCode, string RedirectUri)
        : IRequest<AuthenticateUserResult>;

    public class AuthenticateUserHandler(IAuthenticationService authService)
        : IRequestHandler<AuthenticateUserCommand, AuthenticateUserResult>
    {
        public async Task<AuthenticateUserResult> Handle(AuthenticateUserCommand request, CancellationToken cancellationToken)
        {
            var authResult = await authService.AuthenticateWithOAuthAsync(request.AuthorizationCode, request.RedirectUri);

            return new AuthenticateUserResult
            {
                JwtToken = authResult.JwtToken,
                UserName = authResult.UserName,
                ExpiresAt = authResult.ExpiresAt
            };
        }
    }
}
