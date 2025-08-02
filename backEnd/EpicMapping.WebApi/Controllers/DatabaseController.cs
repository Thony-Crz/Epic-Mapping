using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EpicMapping.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous] // Temporaire pour les tests
public class DatabaseController : ControllerBase
{
    private readonly EpicMappingDbContext _context;
    private readonly ILogger<DatabaseController> _logger;

    public DatabaseController(EpicMappingDbContext context, ILogger<DatabaseController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Teste la connexion à la base de données
    /// </summary>
    [HttpGet("health")]
    public async Task<IActionResult> CheckDatabaseHealth()
    {
        try
        {
            // Tenter de se connecter à la base de données
            var canConnect = await _context.Database.CanConnectAsync();
            
            if (!canConnect)
            {
                return StatusCode(503, new { 
                    status = "Unhealthy", 
                    message = "Cannot connect to database" 
                });
            }

            // Obtenir des informations sur la base de données
            var connectionString = _context.Database.GetConnectionString();
            var providerName = _context.Database.ProviderName;

            return Ok(new
            {
                status = "Healthy",
                message = "Database connection successful",
                provider = providerName,
                database = "EPICMAPPING",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database health check failed");
            return StatusCode(503, new
            {
                status = "Unhealthy",
                message = "Database health check failed",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Obtient des informations sur les migrations
    /// </summary>
    [HttpGet("migrations")]
    public async Task<IActionResult> GetMigrations()
    {
        try
        {
            var appliedMigrations = await _context.Database.GetAppliedMigrationsAsync();
            var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();

            return Ok(new
            {
                appliedMigrations = appliedMigrations.ToList(),
                pendingMigrations = pendingMigrations.ToList(),
                totalApplied = appliedMigrations.Count(),
                totalPending = pendingMigrations.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve migration information");
            return StatusCode(500, new
            {
                error = "Failed to retrieve migration information",
                message = ex.Message
            });
        }
    }
}
