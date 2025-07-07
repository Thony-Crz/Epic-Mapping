using Application.UseCases.AuthenticateUser;
using FluentValidation.TestHelper;

namespace Application.UnitTests.Authentification
{
    public class AuthorizeExternalProviderValidatorTests
    {
        private AuthorizeExternalProviderValidator _validator;

        [SetUp]
        public void Setup()
        {
            _validator = new AuthorizeExternalProviderValidator();
        }

        [Test]
        public void Should_HaveValidationError_When_AuthorizationCode_IsEmpty()
        {
            var command = new AuthorizeExternalProviderCommand(string.Empty, "https://localhost/callback");

            var result = _validator.TestValidate(command);

            result.ShouldHaveValidationErrorFor(c => c.AuthorizationCode);
        }

        [Test]
        public void Should_HaveValidationError_When_RedirectUri_IsEmpty()
        {
            var command = new AuthorizeExternalProviderCommand("auth-code", string.Empty);

            var result = _validator.TestValidate(command);

            result.ShouldHaveValidationErrorFor(c => c.RedirectUri);
        }

        [Test]
        public void Should_NotHaveValidationErrors_When_CommandIsValid()
        {
            var command = new AuthorizeExternalProviderCommand("auth-code", "https://localhost/callback");

            var result = _validator.TestValidate(command);

            result.ShouldNotHaveAnyValidationErrors();
        }

    }
}
