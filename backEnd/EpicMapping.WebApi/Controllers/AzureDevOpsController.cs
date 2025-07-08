using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EpicMapping.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AzureDevOpsController(IMediator mediator) : ControllerBase
    {
        //[HttpPost("authenticate")]
        //public async Task<IActionResult> Authenticate([FromBody] AuthenticateAzureDevOpsCommand command)
        //    => await mediator.Send(command).ContinueWith(ToActionResult);


        //[HttpGet("validate-path")]
        //public async Task<IActionResult> ValidatePath([FromQuery] string project, [FromQuery] string areaPath)
        //    => await mediator.Send(new ValidateAzureDevOpsPathQuery(project, areaPath)).ContinueWith(ToActionResult);

        //[HttpPost("epics")]
        //public async Task<IActionResult> CreateEpic([FromBody] CreateEpicCommand command)
        //    => await mediator.Send(command).ContinueWith(ToActionResult);

        //[HttpPost("features")]
        //public async Task<IActionResult> CreateFeatures([FromBody] CreateFeaturesCommand command)
        //    => await mediator.Send(command).ContinueWith(ToActionResult);

        //[HttpPost("scenarios")]
        //public async Task<IActionResult> CreateScenarios([FromBody] CreateScenariosCommand command)
        //    => await mediator.Send(command).ContinueWith(ToActionResult);

        private IActionResult ToActionResult(Task<object> task)
        {
            if (task.IsFaulted)
            {
                var ex = task.Exception?.GetBaseException();
                return ex is FluentValidation.ValidationException validationEx
                    ? BadRequest(new { Errors = validationEx.Errors.Select(e => e.ErrorMessage) })
                    : StatusCode(500, ex?.Message);
            }

            return Ok(task.Result);
        }
    }
}
