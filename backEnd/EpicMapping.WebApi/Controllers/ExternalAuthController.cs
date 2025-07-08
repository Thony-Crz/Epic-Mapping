using Application.UseCases.AuthenticateUser;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EpicMapping.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExternalAuthController(IMediator mediator) : ControllerBase
    {
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthorizeExternalProviderCommand command)
        {
            try
            {
                var result = await mediator.Send(command);
                return Ok(result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { Errors = ex.Errors.Select(e => e.ErrorMessage) });
            }
        }
    }
}
