using Application.DTOs.ProjectManagement;
using Application.UseCases.ProjectManagement;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EpicMapping.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController(IMediator mediator) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<CreateProjectResult>> CreateProject([FromBody] CreateProjectCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetProjectById), new { id = result.Id }, result);
        }

        // TODO : Stub temporaire pour CreatedAtAction
        [HttpGet("{id}")]
        public IActionResult GetProjectById(Guid id) => Ok();
    }
}
