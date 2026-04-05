using Microsoft.AspNetCore.Http;

namespace Sadec.Api.Services.Media;

public sealed class LocalMediaStorageService(IWebHostEnvironment environment) : IMediaStorageService
{
    public async Task<StoredMediaResult> SaveAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(file.FileName);
        var safeExtension = string.IsNullOrWhiteSpace(extension) ? string.Empty : extension.ToLowerInvariant();

        var utcNow = DateTime.UtcNow;
        var year = utcNow.ToString("yyyy");
        var month = utcNow.ToString("MM");

        var webRootPath = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        var uploadsFolder = Path.Combine(webRootPath, "uploads", year, month);
        Directory.CreateDirectory(uploadsFolder);

        var storedFileName = $"{Guid.NewGuid():N}{safeExtension}";
        var absolutePath = Path.Combine(uploadsFolder, storedFileName);

        await using (var stream = System.IO.File.Create(absolutePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var relativeUrl = $"/uploads/{year}/{month}/{storedFileName}";

        return new StoredMediaResult(
            relativeUrl,
            storedFileName,
            file.ContentType,
            file.Length
        );
    }
}
