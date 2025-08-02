using Application.UseCases.AuthenticateUser;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace EpicMapping.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExternalAuthController(IMediator mediator) : ControllerBase
    {
        [HttpPost("authenticate")]
        [AllowAnonymous]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<IActionResult> Authenticate([FromBody] AuthorizeExternalProviderCommand command)
        {
            try
            {
                var result = await mediator.Send(command);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { 
                    message = "Validation failed",
                    errors = ex.Errors.Select(e => e.ErrorMessage) 
                });
            }
            catch (UnauthorizedAccessException)
            {
                // Add a small delay to prevent brute force attacks
                await Task.Delay(TimeSpan.FromSeconds(1));
                return Unauthorized(new { message = "Authentication failed" });
            }
            catch (Exception ex)
            {
                // Log the exception (consider using ILogger)
                Console.WriteLine($"External authentication error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during external authentication" });
            }
        }
    }
}
