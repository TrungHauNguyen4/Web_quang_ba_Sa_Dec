using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Sadec.Api.Dtos;
using Sadec.Api.Services.Audit;
using Sadec.Api.Services.Auth;
using Sadec.Api.Services.Email;
using Sadec.Api.Entities;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    IAuthService authService,
    IAuditLogService auditLogService,
    UserManager<ApplicationUser> userManager,
    IEmailSender emailSender,
    IConfiguration configuration) : ControllerBase
{
    private readonly IAuthService _authService = authService;
    private readonly IAuditLogService _auditLogService = auditLogService;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IEmailSender _emailSender = emailSender;
    private readonly IConfiguration _configuration = configuration;

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

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request, CancellationToken cancellationToken)
    {
        // Do not reveal whether the account exists.
        var genericMessage = "Nếu tài khoản tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi tới email đăng ký.";

        var normalized = request.UsernameOrEmail.Trim();
        if (string.IsNullOrWhiteSpace(normalized))
        {
            return Ok(new { message = genericMessage });
        }

        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.Email == normalized || u.UserName == normalized, cancellationToken);

        if (user is null || string.IsNullOrWhiteSpace(user.Email))
        {
            await _auditLogService.WriteAsync(
                action: "auth.forgot_password_requested",
                targetType: "auth",
                metadata: normalized,
                cancellationToken: cancellationToken);
            return Ok(new { message = genericMessage });
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var frontendBaseUrl = _configuration["FrontendBaseUrl"];
        if (string.IsNullOrWhiteSpace(frontendBaseUrl))
        {
            frontendBaseUrl = Request.Headers.Origin.ToString();
        }

        var resetUrl = string.Empty;
        if (!string.IsNullOrWhiteSpace(frontendBaseUrl))
        {
            resetUrl = $"{frontendBaseUrl.TrimEnd('/')}/reset-password?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";
        }

        var subject = "Đặt lại mật khẩu";
        var body = $@"<div style='font-family:Arial,sans-serif;font-size:14px'>
<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
<p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu:</p>
<p><a href='{resetUrl}'>Đặt lại mật khẩu</a></p>
<p>Nếu bạn không yêu cầu, bạn có thể bỏ qua email này.</p>
</div>";

        var sent = false;
        if (!string.IsNullOrWhiteSpace(resetUrl))
        {
            try
            {
                sent = await _emailSender.SendAsync(user.Email, subject, body, cancellationToken);
            }
            catch
            {
                sent = false;
            }
        }

        await _auditLogService.WriteAsync(
            action: "auth.forgot_password_issued",
            targetType: "user",
            targetId: user.Id.ToString(),
            metadata: sent ? "email_sent" : (string.IsNullOrWhiteSpace(resetUrl) ? "no_frontend_base_url" : "email_not_configured"),
            userId: user.Id,
            userName: user.Email,
            cancellationToken: cancellationToken);

        return Ok(new { message = genericMessage });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim();
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return BadRequest(new { message = "Thông tin đặt lại mật khẩu không hợp lệ." });
        }

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });
        }

        await _auditLogService.WriteAsync(
            action: "auth.password_reset",
            targetType: "user",
            targetId: user.Id.ToString(),
            metadata: "password_reset",
            userId: user.Id,
            userName: user.Email,
            cancellationToken: cancellationToken);

        return Ok(new { message = "Đặt lại mật khẩu thành công." });
    }
}
