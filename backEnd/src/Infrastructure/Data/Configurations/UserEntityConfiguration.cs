using Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class UserEntityConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.GitHubId)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(u => u.GitHubId)
            .IsUnique();

        builder.Property(u => u.Email)
            .HasMaxLength(255);

        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(u => u.AvatarUrl)
            .HasMaxLength(500);

        builder.Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(u => u.ApprovalStatus)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(u => u.CreatedAt)
            .IsRequired();

        builder.HasIndex(u => u.ApprovalStatus);
    }
}
