using Application.UseCases.Token;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace EpicMapping.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TokenController(IMediator mediator) : ControllerBase
    {
        [HttpPost("login")]
        [AllowAnonymous]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Login([FromBody] GenerateTokenCommand command)
        {
            try
            {
                var result = await mediator.Send(command);
                return Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                // Add a small delay to prevent brute force attacks
                await Task.Delay(TimeSpan.FromSeconds(1));
                return Unauthorized(new { message = "Invalid credentials" });
            }
            catch (Exception ex)
            {
                // Log the exception (consider using ILogger)
                Console.WriteLine($"Login error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during authentication" });
            }
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> RefreshToken()
        {
            // TODO: Implement token refresh logic
            return StatusCode(501, new { message = "Token refresh will be implemented soon" });
        }

        [HttpPost("revoke")]
        [Authorize]
        public async Task<IActionResult> RevokeToken()
        {
            // TODO: Implement token revocation logic
            return Ok(new { message = "Token revoked successfully" });
        }

        [HttpPost("dev-token")]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateDevToken([FromBody] GenerateDevTokenRequest? request = null)
        {
            try
            {
                // Use provided username or default to "dev-user"
                var username = request?.Username ?? "dev-user";
                
                // Create a command with the dev user credentials
                var command = new GenerateTokenCommand(username, "dev-password");
                var result = await mediator.Send(command);
                
                return Ok(new
                {
                    token = result.TokenString,
                    tokenType = result.TokenType,
                    expiresAt = result.ExpiresAt,
                    userName = result.UserName,
                    message = "Development token generated successfully. Do not use in production!"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Dev token generation error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while generating dev token" });
            }
        }
    }

    public class GenerateDevTokenRequest
    {
        public string? Username { get; set; }
    }
}
