using Application.DTOs.ProjectManagement;
using Application.UseCases.ProjectManagement;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EpicMapping.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController(IMediator mediator) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Project>> GetProjectById(Guid id)
        {
            var query = new GetProjectByIdQuery(id);
            var project = await mediator.Send(query);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        [HttpPost]
        public async Task<ActionResult<CreateProjectResult>> CreateProject([FromBody] CreateProjectCommand command)
        {
            var result = await mediator.Send(command);
            return CreatedAtAction(nameof(GetFakeProjectById), new { id = result.Id }, result);
        }

        [HttpGet("team/{teamOwnerId}")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjectsByTeamId(int teamOwnerId)
        {
            var query = new GetProjectsByTeamIdQuery(teamOwnerId);
            var projects = await mediator.Send(query);
            return Ok(projects);
        }

        // TODO : Stub temporaire pour CreatedAtAction
        [HttpGet("fake/{id}")]
        public IActionResult GetFakeProjectById(Guid id) => Ok();
    }
}
