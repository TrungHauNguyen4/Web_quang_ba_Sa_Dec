using Microsoft.AspNetCore.Http;

namespace Sadec.Api.Services.Media;

public sealed record StoredMediaResult(
    string RelativeUrl,
    string StoredFileName,
    string ContentType,
    long SizeBytes
);

public interface IMediaStorageService
{
    Task<StoredMediaResult> SaveAsync(IFormFile file, CancellationToken cancellationToken = default);
}
