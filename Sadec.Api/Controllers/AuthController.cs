using Microsoft.AspNetCore.Mvc;
using Sadec.Api.Dtos;
using Sadec.Api.Services.Audit;
using Sadec.Api.Services.Auth;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService, IAuditLogService auditLogService) : ControllerBase
{
    private readonly IAuthService _authService = authService;
    private readonly IAuditLogService _auditLogService = auditLogService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(request.Username, request.Password, cancellationToken);
        if (result is null)
        {
            await _auditLogService.WriteAsync(
                action: "auth.login_failed",
                targetType: "auth",
                metadata: request.Username.Trim(),
                cancellationToken: cancellationToken);
            return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
        }

        await _auditLogService.WriteAsync(
            action: "auth.login_success",
            targetType: "user",
            targetId: result.User.Id.ToString(),
            metadata: result.User.Role,
            userId: result.User.Id,
            userName: result.User.Email,
            cancellationToken: cancellationToken);

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
