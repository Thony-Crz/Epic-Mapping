using FluentValidation;

namespace Application.UseCases.AuthenticateUser;

public class AuthorizeExternalProviderValidator : AbstractValidator<AuthorizeExternalProviderCommand>
{
    public AuthorizeExternalProviderValidator()
    {
        RuleFor(x => x.AuthorizationCode)
            .NotEmpty().WithMessage("Authorization code is required.");

        RuleFor(x => x.RedirectUri)
            .NotEmpty().WithMessage("Redirect URI is required.");
    }
}