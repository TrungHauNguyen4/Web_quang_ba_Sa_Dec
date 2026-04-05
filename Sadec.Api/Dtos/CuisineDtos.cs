using System.ComponentModel.DataAnnotations;
using Sadec.Api.Entities;

namespace Sadec.Api.Dtos;

public sealed record CuisineDto(
    Guid Id,
    string Title,
    string Slug,
    string? Description,
    string? Category,
    string? ImageUrl,
    IReadOnlyList<string> GalleryImageUrls,
    string? VideoUrl,
    double? Latitude,
    double? Longitude,
    ContentStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public sealed class CuisineCreateDto
{
    [Required, StringLength(200, MinimumLength = 2)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(200, MinimumLength = 2), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    public string Slug { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [StringLength(120)]
    public string? Category { get; set; }

    [StringLength(1000)]
    public string? ImageUrl { get; set; }

    public IReadOnlyList<string>? GalleryImageUrls { get; set; }

    [StringLength(1000)]
    public string? VideoUrl { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public ContentStatus Status { get; set; }
}

public sealed class CuisineUpdateDto
{
    [Required, StringLength(200, MinimumLength = 2)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(200, MinimumLength = 2), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    public string Slug { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [StringLength(120)]
    public string? Category { get; set; }

    [StringLength(1000)]
    public string? ImageUrl { get; set; }

    public IReadOnlyList<string>? GalleryImageUrls { get; set; }

    [StringLength(1000)]
    public string? VideoUrl { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public ContentStatus Status { get; set; }
}