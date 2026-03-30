using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Entities;

namespace Sadec.Api.Data;

public static class DataSeeder
{
    public static async Task SeedIdentityAsync(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        CancellationToken cancellationToken = default)
    {
        var roles = new[] { "Admin", "Editor", "Viewer" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }

        if (await userManager.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        async Task CreateUserAsync(string email, string displayName, string password, string role)
        {
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                DisplayName = displayName,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(user, password);
            if (createResult.Succeeded)
            {
                await userManager.AddToRoleAsync(user, role);
            }
        }

        await CreateUserAsync("admin@sadec.local", "Admin", "Admin@123", "Admin");
        await CreateUserAsync("editor@sadec.local", "Editor", "Editor@123", "Editor");
        await CreateUserAsync("viewer@sadec.local", "Viewer", "Viewer@123", "Viewer");
    }
}
