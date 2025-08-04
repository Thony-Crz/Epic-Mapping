using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly EpicMappingDbContext _context;

    public ProjectRepository(EpicMappingDbContext context)
    {
        _context = context;
    }

    public async Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default)
    {
        var entry = await _context.Projects.AddAsync(project, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return entry.Entity;
    }

    public async Task<Project?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Include(p => p.Epics)
            .ThenInclude(e => e.Features)
            .ThenInclude(f => f.Scenarios)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Project>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Projects
            .Include(p => p.Epics)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project> UpdateAsync(Project project, CancellationToken cancellationToken = default)
    {
        _context.Projects.Update(project);
        await _context.SaveChangesAsync(cancellationToken);
        return project;
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await _context.Projects.FindAsync(id, cancellationToken);
        if (project != null)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Projects.AnyAsync(p => p.Id == id, cancellationToken);
    }
}
