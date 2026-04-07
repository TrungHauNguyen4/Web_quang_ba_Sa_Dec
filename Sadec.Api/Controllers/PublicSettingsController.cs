using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/settings")]
[AllowAnonymous]
public sealed class PublicSettingsController(ApplicationDbContext dbContext) : ControllerBase
{
    private const string SiteNameKey = "site.name";
    private const string SloganKey = "site.slogan";
    private const string SeoDescriptionKey = "site.seoDescription";
    private const string LogoUrlKey = "site.logoUrl";
    private const string AdministrativeMapImageUrlKey = "site.administrativeMapImageUrl";
    private const string ContactPhoneKey = "contact.phone";
    private const string ContactEmailKey = "contact.email";
    private const string ContactAddressKey = "contact.address";
    private const string FacebookUrlKey = "social.facebook";
    private const string InstagramUrlKey = "social.instagram";
    private const string YoutubeUrlKey = "social.youtube";
    private const string LegacyTwitterUrlKey = "social.twitter";

    [HttpGet]
    public async Task<ActionResult<SystemSettingsDto>> Get(CancellationToken cancellationToken)
    {
        var settings = await dbContext.CaiDatHeThongs
            .AsNoTracking()
            .ToDictionaryAsync(x => x.Khoa, x => x.GiaTri, cancellationToken);

        return Ok(new SystemSettingsDto(
            SiteName: Read(settings, SiteNameKey, "Cổng thông tin điện tử cấp phường"),
            Slogan: Read(settings, SloganKey, "Minh bạch - Hiệu quả - Phục vụ"),
            SeoDescription: Read(settings, SeoDescriptionKey, "Cổng thông tin điện tử cấp phường, cung cấp dịch vụ công trực tuyến, thông báo điều hành và tiếp nhận phản ánh kiến nghị."),
            LogoUrl: ReadOptional(settings, LogoUrlKey),
            AdministrativeMapImageUrl: ReadOptional(settings, AdministrativeMapImageUrlKey),
            ContactPhone: Read(settings, ContactPhoneKey, "0277 3861 xxx"),
            ContactEmail: Read(settings, ContactEmailKey, "contact@sadec.gov.vn"),
            ContactAddress: Read(settings, ContactAddressKey, "UBND TP Sa Đéc, Phường 1, TP Sa Đéc, Phường Sa Đéc"),
            FacebookUrl: ReadOptional(settings, FacebookUrlKey),
            InstagramUrl: ReadOptional(settings, InstagramUrlKey),
            YoutubeUrl: ReadOptional(settings, YoutubeUrlKey) ?? ReadOptional(settings, LegacyTwitterUrlKey)
        ));
    }

    private static string Read(Dictionary<string, string> map, string key, string fallback)
    {
        if (!map.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
        {
            return fallback;
        }

        return value;
    }

    private static string? ReadOptional(Dictionary<string, string> map, string key)
    {
        if (!map.TryGetValue(key, out var value) || string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value;
    }
}