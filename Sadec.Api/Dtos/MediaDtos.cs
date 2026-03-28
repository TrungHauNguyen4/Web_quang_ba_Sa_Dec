namespace Sadec.Api.Dtos;

public sealed class MediaUploadRequestDto
{
    public IFormFile? File { get; set; }
}

public sealed record MediaFileDto(
    Guid Id,
    string Url,
    string FileName,
    long SizeBytes,
    string ContentType,
    DateTime CreatedAt
);

public sealed record MediaUploadResponseDto(
    Guid Id,
    string Url,
    string FileName,
    long SizeBytes,
    string ContentType
);