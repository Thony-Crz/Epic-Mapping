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
    }
}
