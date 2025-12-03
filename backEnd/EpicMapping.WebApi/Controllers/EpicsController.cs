using System.Globalization;
using System.Security.Claims;
using System.Text;
using Application.Epics;
using Application.Epics.Exceptions;
using Domain.Epics.Exceptions;
using MediatR;
using EpicMapping.WebApi.RateLimiting;
using EpicMapping.WebApi.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace EpicMapping.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class EpicsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<EpicsController> _logger;
    private readonly IReadyEpicExportLimiter _exportLimiter;

    public EpicsController(IMediator mediator, ILogger<EpicsController> logger, IReadyEpicExportLimiter exportLimiter)
    {
        _mediator = mediator;
        _logger = logger;
        _exportLimiter = exportLimiter;
    }

    [HttpGet("{id:guid}/export")]
    public async Task<IActionResult> ExportReadyEpicAsync(Guid id, CancellationToken cancellationToken)
    {
        var requestedBy = ResolveRequestedBy();

        if (!_exportLimiter.TryAcquire(requestedBy, out var retryAfter))
        {
            var retrySeconds = Math.Max(1, (int)Math.Ceiling(retryAfter.TotalSeconds));
            Response.Headers["Retry-After"] = retrySeconds.ToString(CultureInfo.InvariantCulture);
            var problem = CreateProblem(StatusCodes.Status429TooManyRequests,
                "Too many export requests",
                "Please wait before requesting another export.");
            problem.Extensions["retry_after_seconds"] = retrySeconds;
            return StatusCode(StatusCodes.Status429TooManyRequests, problem);
        }

        try
        {
            var result = await _mediator.Send(new ExportReadyEpicQuery(id, requestedBy), cancellationToken);
            var payload = Encoding.UTF8.GetBytes(result.Payload);

            Response.Headers["ETag"] = $"\"{result.Checksum}\"";

            return File(payload, result.ContentType, result.FileName);
        }
        catch (EpicNotFoundException ex)
        {
            _logger.LogWarning(ex, "Export failed because epic {EpicId} was not found", id);
            return NotFound(CreateProblem(StatusCodes.Status404NotFound,
                "Epic not found",
                ex.Message));
        }
        catch (ReadyEpicExportValidationException ex)
        {
            _logger.LogWarning(ex, "Export blocked because epic {EpicId} is not Ready", id);
            var problem = CreateProblem(StatusCodes.Status409Conflict,
                "Epic is not Ready",
                ex.Message);
            problem.Extensions["required_status"] = "Ready";
            problem.Extensions["current_status"] = ex.CurrentStatus;
            problem.Extensions["missing_checklist_items"] = ex.MissingChecklistItems;
            Response.Headers["Retry-After"] = "30";
            return Conflict(problem);
        }
    }

    private string ResolveRequestedBy()
    {
        return User.FindFirstValue("preferred_username")
            ?? User.FindFirstValue(ClaimTypes.Upn)
            ?? User.FindFirstValue(ClaimTypes.Email)
            ?? User.Identity?.Name
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? "unknown";
    }

    private ProblemDetails CreateProblem(int statusCode, string title, string detail)
    {
        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = HttpContext.Request.Path,
            Type = statusCode switch
            {
                StatusCodes.Status404NotFound => "https://httpstatuses.com/404",
                StatusCodes.Status409Conflict => "https://httpstatuses.com/409",
                StatusCodes.Status429TooManyRequests => "https://httpstatuses.com/429",
                _ => "about:blank"
            }
        };

        problem.Extensions["traceId"] = HttpContext.TraceIdentifier;
        return problem;
    }
}
