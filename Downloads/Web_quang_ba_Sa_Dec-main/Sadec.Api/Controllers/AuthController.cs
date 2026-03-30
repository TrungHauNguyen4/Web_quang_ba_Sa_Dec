using Microsoft.AspNetCore.Mvc;
using Sadec.Api.Dtos;
using Sadec.Api.Services.Auth;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(request.Username, request.Password, cancellationToken);
        if (result is null)
        {
            return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
        }

        return Ok(result);
    }

    [HttpPost("refresh")]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _authService.RefreshAsync(request.Token, request.RefreshToken, cancellationToken);
        if (result is null)
        {
            return Unauthorized(new { message = "Refresh token không hợp lệ" });
        }

        return Ok(result);
    }
}
