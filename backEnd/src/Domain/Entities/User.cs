namespace Domain.Entities
{
    public enum UserRole
    {
        User = 0,
        Admin = 1
    }

    public enum ApprovalStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }

    public class User
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

        public User() { }

        public User(string gitHubId, string email, string name, string? avatarUrl = null)
        {
            Id = Guid.NewGuid();
            GitHubId = gitHubId;
            Email = email;
            Name = name;
            AvatarUrl = avatarUrl;
            CreatedAt = DateTime.UtcNow;
        }

        public bool IsApproved => ApprovalStatus == ApprovalStatus.Approved;
        public bool IsAdmin => Role == UserRole.Admin;
    }
}
