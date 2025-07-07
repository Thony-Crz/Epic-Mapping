using Application.DTOs.Authentication;
using Domain.Interfaces;
using MediatR;

namespace Application.UseCases.AuthenticateUser
{
    public record AuthorizeExternalProviderCommand(string AuthorizationCode, string RedirectUri)
        : IRequest<AuthenticateUserResult>;

    public class AuthorizeExternalProvider(IAuthenticationService authService)
        : IRequestHandler<AuthorizeExternalProviderCommand, AuthenticateUserResult>
    {
        public async Task<AuthenticateUserResult> Handle(AuthorizeExternalProviderCommand request, CancellationToken cancellationToken)
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
