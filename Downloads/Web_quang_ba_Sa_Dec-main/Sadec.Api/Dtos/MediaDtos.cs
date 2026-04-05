using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Sadec.Api.Dtos;

public sealed record MediaItemDto(
    Guid Id,
    string FileName,
    string Url,
    string? MimeType,
    long? SizeBytes,
    DateTime UploadedAt,
    Guid? UploadedBy
);

public sealed record MediaUploadResponseDto(
    Guid Id,
    string Url,
    string FileName,
    string? MimeType,
    long? SizeBytes,
    DateTime UploadedAt
);

public sealed class MediaUploadRequestDto
{
    [Required]
    public IFormFile File { get; set; } = default!;
}
