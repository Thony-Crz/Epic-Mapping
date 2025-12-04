using Domain.Entities;

namespace Infrastructure.Data.Entities;

public class UserEntity
{
    public Guid Id { get; set; }
    public string GitHubId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedAt { get; set; }
    public Guid? ApprovedBy { get; set; }

    public User ToDomain()
    {
        return new User
        {
            Id = Id,
            GitHubId = GitHubId,
            Email = Email,
            Name = Name,
            AvatarUrl = AvatarUrl,
            Role = Role,
            ApprovalStatus = ApprovalStatus,
            CreatedAt = CreatedAt,
            ApprovedAt = ApprovedAt,
            ApprovedBy = ApprovedBy
        };
    }

    public static UserEntity FromDomain(User user)
    {
        return new UserEntity
        {
            Id = user.Id,
            GitHubId = user.GitHubId,
            Email = user.Email,
            Name = user.Name,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role,
            ApprovalStatus = user.ApprovalStatus,
            CreatedAt = user.CreatedAt,
            ApprovedAt = user.ApprovedAt,
            ApprovedBy = user.ApprovedBy
        };
    }
}
