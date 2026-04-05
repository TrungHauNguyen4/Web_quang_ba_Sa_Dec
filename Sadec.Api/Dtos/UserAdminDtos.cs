using System.ComponentModel.DataAnnotations;

namespace Sadec.Api.Dtos;

public sealed record UserAdminDto(
    Guid Id,
    string DisplayName,
    string Email,
    string UserName,
    string Role,
    DateTime CreatedAt
);

public sealed class UserCreateDto
{
    [Required, StringLength(120, MinimumLength = 2)]
    public string DisplayName { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(100, MinimumLength = 3)]
    public string UserName { get; set; } = string.Empty;

    [Required, StringLength(200, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required, StringLength(30)]
    public string Role { get; set; } = "Editor";
}

public sealed class UserUpdateRoleDto
{
    [Required, StringLength(30)]
    public string Role { get; set; } = "Editor";
}