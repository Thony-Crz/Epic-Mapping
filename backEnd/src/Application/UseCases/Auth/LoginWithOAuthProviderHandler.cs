using Application.DTOs.Auth;
using Application.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.UseCases.Auth
{
    public class LoginWithOAuthProviderHandler(IUserRepository userRepository, IAuthService authService) : IRequestHandler<LoginWithOAuthProviderCommand, UserTokenDto>
    {

        public Task<UserTokenDto> Handle(LoginWithOAuthProviderCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
