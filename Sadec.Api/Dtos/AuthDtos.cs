using System.ComponentModel.DataAnnotations;

namespace Sadec.Api.Dtos;

public sealed class LoginRequestDto
{
    [Required, MinLength(3)]
    public string Username { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
}

public sealed record AuthUserDto(
    Guid Id,
    string DisplayName,
    string Email,
    string Role
);

public sealed record AuthResponseDto(
    string Token,
    string? RefreshToken,
    AuthUserDto User
);

public sealed class RefreshTokenRequestDto
{
    [Required]
    public string Token { get; set; } = string.Empty;

    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
