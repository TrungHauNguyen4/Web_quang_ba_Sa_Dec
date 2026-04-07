using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;
using Sadec.Api.Services.Audit;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public sealed class AdminUsersController(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole<Guid>> roleManager,
    IAuditLogService auditLogService) : ControllerBase
{
    private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        "Admin",
        "Editor"
    };

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<UserAdminDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] string? role = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = userManager.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.DisplayName.Contains(keyword) || x.Email!.Contains(keyword) || x.UserName!.Contains(keyword));
        }

        var users = await query.OrderByDescending(x => x.CreatedAt).ToListAsync(cancellationToken);
        var mapped = new List<UserAdminDto>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            var currentRole = roles.FirstOrDefault() ?? "Unassigned";

            if (!string.IsNullOrWhiteSpace(role) && !currentRole.Equals(role, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            mapped.Add(new UserAdminDto(user.Id, user.DisplayName, user.Email ?? string.Empty, user.UserName ?? string.Empty, currentRole, user.CreatedAt));
        }

        var total = mapped.Count;
        var items = mapped.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);

        return Ok(new PagedResultDto<UserAdminDto>(items, page, pageSize, total, totalPages));
    }

    [HttpPost]
    public async Task<ActionResult<UserAdminDto>> Create([FromBody] UserCreateDto request)
    {
        var normalizedRole = request.Role.Trim();
        if (!AllowedRoles.Contains(normalizedRole))
        {
            return BadRequest(new { message = "Chi ho tro role Admin hoac Editor." });
        }

        if (!await roleManager.RoleExistsAsync(normalizedRole))
        {
            return BadRequest(new { message = "Role khong hop le." });
        }

        var existsByEmail = await userManager.FindByEmailAsync(request.Email.Trim());
        if (existsByEmail is not null)
        {
            return Conflict(new { message = "Email da ton tai." });
        }

        var existsByUserName = await userManager.FindByNameAsync(request.UserName.Trim());
        if (existsByUserName is not null)
        {
            return Conflict(new { message = "UserName da ton tai." });
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            DisplayName = request.DisplayName.Trim(),
            Email = request.Email.Trim(),
            UserName = request.UserName.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });
        }

        await userManager.AddToRoleAsync(user, normalizedRole);

        await auditLogService.WriteAsync(
            action: "user.created",
            targetType: "user",
            targetId: user.Id.ToString(),
            metadata: normalizedRole);

        return Ok(new UserAdminDto(user.Id, user.DisplayName, user.Email ?? string.Empty, user.UserName ?? string.Empty, normalizedRole, user.CreatedAt));
    }

    [HttpPatch("{id:guid}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UserUpdateRoleDto request)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null) return NotFound();

        var normalizedRole = request.Role.Trim();
        if (!AllowedRoles.Contains(normalizedRole))
        {
            return BadRequest(new { message = "Chi ho tro role Admin hoac Editor." });
        }

        if (!await roleManager.RoleExistsAsync(normalizedRole))
        {
            return BadRequest(new { message = "Role khong hop le." });
        }

        var currentRoles = await userManager.GetRolesAsync(user);
        if (currentRoles.Count > 0)
        {
            await userManager.RemoveFromRolesAsync(user, currentRoles);
        }

        await userManager.AddToRoleAsync(user, normalizedRole);

        await auditLogService.WriteAsync(
            action: "user.role_updated",
            targetType: "user",
            targetId: user.Id.ToString(),
            metadata: normalizedRole);

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null) return NotFound();

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Any(x => x.Equals("Admin", StringComparison.OrdinalIgnoreCase)))
        {
            return BadRequest(new { message = "Khong duoc xoa tai khoan Admin." });
        }

        await userManager.DeleteAsync(user);

        await auditLogService.WriteAsync(
            action: "user.deleted",
            targetType: "user",
            targetId: user.Id.ToString(),
            metadata: user.Email);

        return NoContent();
    }

    [HttpPost("{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id, [FromBody] UserResetPasswordDto request)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null) return NotFound(new { message = "Không tìm thấy người dùng." });

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });
        }

        await auditLogService.WriteAsync(
            action: "user.password_reset_by_admin",
            targetType: "user",
            targetId: user.Id.ToString(),
            metadata: user.Email);

        return NoContent();
    }
}