using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
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

    public static async Task SeedPublicServicesAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (await dbContext.ThuTucDichVus.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTime.UtcNow;
        var items = new List<ThuTucDichVu>
        {
            new()
            {
                Ten = "Đăng ký khai sinh",
                MoTa = "Thủ tục hộ tịch dành cho công dân đăng ký khai sinh.",
                DangHoatDong = true,
                CauHinhBieuMauJson = JsonSerializer.Serialize(new
                {
                    title = "Mẫu hồ sơ khai sinh",
                    hint = "Nhập đầy đủ thông tin trẻ và cha mẹ.",
                    fields = new object[]
                    {
                        new { key = "childName", label = "Họ tên trẻ", required = true, type = "text", placeholder = "Ví dụ: Nguyễn Văn A" },
                        new { key = "dateOfBirth", label = "Ngày sinh", required = true, type = "date", placeholder = "" },
                        new { key = "fatherName", label = "Họ tên cha", required = true, type = "text", placeholder = "" },
                        new { key = "motherName", label = "Họ tên mẹ", required = true, type = "text", placeholder = "" }
                    }
                }),
                TaoLuc = now,
                CapNhatLuc = now
            },
            new()
            {
                Ten = "Xác nhận cư trú",
                MoTa = "Cấp giấy xác nhận cư trú theo yêu cầu.",
                DangHoatDong = true,
                CauHinhBieuMauJson = JsonSerializer.Serialize(new
                {
                    title = "Mẫu xác nhận cư trú",
                    hint = "Khai địa chỉ cư trú và mục đích sử dụng giấy xác nhận.",
                    fields = new object[]
                    {
                        new { key = "cccd", label = "Số CCCD", required = true, type = "text", placeholder = "12 số CCCD" },
                        new { key = "residenceAddress", label = "Địa chỉ cư trú", required = true, type = "text", placeholder = "" },
                        new { key = "purpose", label = "Mục đích sử dụng", required = true, type = "textarea", placeholder = "" }
                    }
                }),
                TaoLuc = now,
                CapNhatLuc = now
            },
            new()
            {
                Ten = "Chứng thực sao y giấy tờ",
                MoTa = "Chứng thực bản sao từ bản chính.",
                DangHoatDong = true,
                CauHinhBieuMauJson = JsonSerializer.Serialize(new
                {
                    title = "Mẫu chứng thực sao y",
                    hint = "Khai thông tin giấy tờ và số bản cần chứng thực.",
                    fields = new object[]
                    {
                        new { key = "documentName", label = "Tên giấy tờ", required = true, type = "text", placeholder = "" },
                        new { key = "copies", label = "Số lượng bản sao", required = true, type = "text", placeholder = "Ví dụ: 03" },
                        new { key = "issuedBy", label = "Cơ quan cấp", required = true, type = "text", placeholder = "" }
                    }
                }),
                TaoLuc = now,
                CapNhatLuc = now
            },
            new()
            {
                Ten = "Cấp phép kinh doanh hộ cá thể",
                MoTa = "Đăng ký cấp phép hoạt động hộ kinh doanh cá thể.",
                DangHoatDong = true,
                CauHinhBieuMauJson = JsonSerializer.Serialize(new
                {
                    title = "Mẫu đăng ký kinh doanh",
                    hint = "Khai thông tin hộ kinh doanh và ngành nghề.",
                    fields = new object[]
                    {
                        new { key = "businessName", label = "Tên hộ kinh doanh", required = true, type = "text", placeholder = "" },
                        new { key = "businessAddress", label = "Địa điểm kinh doanh", required = true, type = "text", placeholder = "" },
                        new { key = "businessLine", label = "Ngành nghề", required = true, type = "text", placeholder = "" },
                        new { key = "capital", label = "Vốn đăng ký", required = false, type = "text", placeholder = "" }
                    }
                }),
                TaoLuc = now,
                CapNhatLuc = now
            }
        };

        dbContext.ThuTucDichVus.AddRange(items);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
