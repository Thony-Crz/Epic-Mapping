using Application.DTOs.Auth;
using MediatR;

namespace Application.UseCases.Auth
{
    public record LoginWithOAuthProviderCommand(string Provider, string AuthCode)
        : IRequest<UserTokenDto>;
}
