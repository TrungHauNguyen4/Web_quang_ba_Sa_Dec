namespace Sadec.Api.Dtos;

public sealed record SystemSettingsDto(
    string SiteName,
    string Slogan,
    string SeoDescription,
    string? LogoUrl,
    string? AdministrativeMapImageUrl,
    string ContactPhone,
    string ContactEmail,
    string ContactAddress,
    string? FacebookUrl,
    string? InstagramUrl,
    string? YoutubeUrl
);

public sealed record UpdateSystemSettingsDto(
    string SiteName,
    string Slogan,
    string SeoDescription,
    string? LogoUrl,
    string? AdministrativeMapImageUrl,
    string ContactPhone,
    string ContactEmail,
    string ContactAddress,
    string? FacebookUrl,
    string? InstagramUrl,
    string? YoutubeUrl
);
