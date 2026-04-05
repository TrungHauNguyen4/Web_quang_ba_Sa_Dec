using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Services.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<Guid>> roleManager,
    ApplicationDbContext dbContext,
    IConfiguration configuration) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly IConfiguration _configuration = configuration;

    private SymmetricSecurityKey GetSigningKey()
    {
        var key = _configuration["Jwt:Key"] ?? "THIS_IS_DEMO_KEY_CHANGE_ME_32+CHARS_LONG_SECRET_KEY_123";
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    }

    private int GetAccessTokenMinutes() => _configuration.GetValue<int?>("Jwt:AccessTokenMinutes") ?? 60;

    private int GetRefreshTokenDays() => _configuration.GetValue<int?>("Jwt:RefreshTokenDays") ?? 7;

    public async Task<AuthResponseDto?> LoginAsync(string usernameOrEmail, string password, CancellationToken cancellationToken = default)
    {
        var normalized = usernameOrEmail.Trim();

        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.Email == normalized || u.UserName == normalized, cancellationToken);

        if (user is null) return null;

        var valid = await _userManager.CheckPasswordAsync(user, password);
        if (!valid) return null;

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto?> RefreshAsync(string token, string refreshToken, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken)) return null;

        var stored = await _dbContext.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshToken, cancellationToken);

        if (stored is null || stored.User is null || !stored.IsActive)
        {
            return null;
        }

        // revoke old token
        stored.RevokedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return await IssueTokensAsync(stored.User, cancellationToken);
    }

    private async Task<AuthResponseDto?> IssueTokensAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        var signingKey = GetSigningKey();
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? string.Empty;

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.DisplayName ?? user.UserName ?? user.Email ?? ""),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        foreach (var r in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, r));
        }

        var now = DateTime.UtcNow;
        var accessExpires = now.AddMinutes(GetAccessTokenMinutes());

        var jwt = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            notBefore: now,
            expires: accessExpires,
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

        var refresh = new RefreshToken
        {
            Token = Guid.NewGuid().ToString("N"),
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(GetRefreshTokenDays())
        };

        _dbContext.RefreshTokens.Add(refresh);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new AuthResponseDto(
            accessToken,
            refresh.Token,
            new AuthUserDto(user.Id, user.DisplayName ?? user.UserName ?? string.Empty, user.Email ?? string.Empty, role)
        );
    }
}
