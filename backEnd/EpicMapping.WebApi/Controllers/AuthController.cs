using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EpicMapping.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        IUserRepository userRepository,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _userRepository = userRepository;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Get GitHub OAuth authorization URL
    /// </summary>
    [HttpGet("github/url")]
    [AllowAnonymous]
    public ActionResult<GitHubAuthUrlResponse> GetGitHubAuthUrl([FromQuery] string? returnUrl = null)
    {
        var state = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        var authUrl = _authService.GetGitHubAuthorizationUrl(state);
        
        return Ok(new GitHubAuthUrlResponse(authUrl, state));
    }

    /// <summary>
    /// Handle GitHub OAuth callback
    /// </summary>
    [HttpPost("github/callback")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> GitHubCallback([FromBody] GitHubCallbackRequest request)
    {
        try
        {
            var gitHubUser = await _authService.GetGitHubUserInfoAsync(request.Code);
            if (gitHubUser == null)
            {
                return BadRequest(new { error = "Failed to authenticate with GitHub" });
            }

            // Check if user already exists
            var existingUser = await _userRepository.GetByGitHubIdAsync(gitHubUser.Id);
            User user;

            if (existingUser != null)
            {
                user = existingUser;
                // Update user info if changed
                user.Name = gitHubUser.Name ?? gitHubUser.Login;
                user.Email = gitHubUser.Email ?? "";
                user.AvatarUrl = gitHubUser.AvatarUrl;
                await _userRepository.UpdateAsync(user);
            }
            else
            {
                // Check if this is the first user or admin GitHub ID
                var adminGitHubId = Environment.GetEnvironmentVariable("ADMIN_GITHUB_ID") 
                    ?? _configuration["Admin:GitHubId"];
                var hasAnyUsers = await _userRepository.HasAnyUsersAsync();
                var isAdmin = !hasAnyUsers || gitHubUser.Id == adminGitHubId;

                user = new User(
                    gitHubUser.Id,
                    gitHubUser.Email ?? "",
                    gitHubUser.Name ?? gitHubUser.Login,
                    gitHubUser.AvatarUrl
                );

                if (isAdmin)
                {
                    user.Role = UserRole.Admin;
                    user.ApprovalStatus = ApprovalStatus.Approved;
                    user.ApprovedAt = DateTime.UtcNow;
                }
                else
                {
                    user.Role = UserRole.User;
                    user.ApprovalStatus = ApprovalStatus.Pending;
                }

                await _userRepository.AddAsync(user);
                _logger.LogInformation("New user registered: {Name} ({GitHubId}), Role: {Role}, Status: {Status}", 
                    user.Name, user.GitHubId, user.Role, user.ApprovalStatus);
            }

            var token = await _authService.GenerateTokenAsync(user);

            return Ok(new AuthResponse(
                Token: token,
                User: new UserResponse(
                    Id: user.Id,
                    Name: user.Name,
                    Email: user.Email,
                    AvatarUrl: user.AvatarUrl,
                    Role: user.Role.ToString(),
                    ApprovalStatus: user.ApprovalStatus.ToString(),
                    IsApproved: user.IsApproved,
                    IsAdmin: user.IsAdmin
                )
            ));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during GitHub authentication");
            return StatusCode(500, new { error = "Authentication failed" });
        }
    }

    /// <summary>
    /// Get current user info
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized();
        }

        var user = await _userRepository.GetByIdAsync(userGuid);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserResponse(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            AvatarUrl: user.AvatarUrl,
            Role: user.Role.ToString(),
            ApprovalStatus: user.ApprovalStatus.ToString(),
            IsApproved: user.IsApproved,
            IsAdmin: user.IsAdmin
        ));
    }

    /// <summary>
    /// Get pending users (Admin only)
    /// </summary>
    [HttpGet("users/pending")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetPendingUsers()
    {
        var users = await _userRepository.GetPendingUsersAsync();
        return Ok(users.Select(u => new UserResponse(
            Id: u.Id,
            Name: u.Name,
            Email: u.Email,
            AvatarUrl: u.AvatarUrl,
            Role: u.Role.ToString(),
            ApprovalStatus: u.ApprovalStatus.ToString(),
            IsApproved: u.IsApproved,
            IsAdmin: u.IsAdmin
        )));
    }

    /// <summary>
    /// Get all users (Admin only)
    /// </summary>
    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserResponse>>> GetAllUsers()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return Ok(users.Select(u => new UserResponse(
            Id: u.Id,
            Name: u.Name,
            Email: u.Email,
            AvatarUrl: u.AvatarUrl,
            Role: u.Role.ToString(),
            ApprovalStatus: u.ApprovalStatus.ToString(),
            IsApproved: u.IsApproved,
            IsAdmin: u.IsAdmin
        )));
    }

    /// <summary>
    /// Approve a user (Admin only)
    /// </summary>
    [HttpPost("users/{userId}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserResponse>> ApproveUser(Guid userId)
    {
        var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(adminId) || !Guid.TryParse(adminId, out var adminGuid))
        {
            return Unauthorized();
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.ApprovalStatus = ApprovalStatus.Approved;
        user.ApprovedAt = DateTime.UtcNow;
        user.ApprovedBy = adminGuid;

        await _userRepository.UpdateAsync(user);

        _logger.LogInformation("User {UserName} approved by admin {AdminId}", user.Name, adminId);

        return Ok(new UserResponse(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            AvatarUrl: user.AvatarUrl,
            Role: user.Role.ToString(),
            ApprovalStatus: user.ApprovalStatus.ToString(),
            IsApproved: user.IsApproved,
            IsAdmin: user.IsAdmin
        ));
    }

    /// <summary>
    /// Reject a user (Admin only)
    /// </summary>
    [HttpPost("users/{userId}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserResponse>> RejectUser(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        user.ApprovalStatus = ApprovalStatus.Rejected;
        await _userRepository.UpdateAsync(user);

        _logger.LogInformation("User {UserName} rejected", user.Name);

        return Ok(new UserResponse(
            Id: user.Id,
            Name: user.Name,
            Email: user.Email,
            AvatarUrl: user.AvatarUrl,
            Role: user.Role.ToString(),
            ApprovalStatus: user.ApprovalStatus.ToString(),
            IsApproved: user.IsApproved,
            IsAdmin: user.IsAdmin
        ));
    }
}

public record GitHubAuthUrlResponse(string Url, string State);
public record GitHubCallbackRequest(string Code, string State);
public record AuthResponse(string Token, UserResponse User);
public record UserResponse(
    Guid Id,
    string Name,
    string? Email,
    string? AvatarUrl,
    string Role,
    string ApprovalStatus,
    bool IsApproved,
    bool IsAdmin
);
