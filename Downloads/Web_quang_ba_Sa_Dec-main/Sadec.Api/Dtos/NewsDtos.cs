using System.ComponentModel.DataAnnotations;
using Sadec.Api.Entities;

namespace Sadec.Api.Dtos;

public sealed record NewsDto(
    Guid Id,
    string Title,
    string Slug,
    string? Excerpt,
    string? Content,
    string? ImageUrl,
    ContentStatus Status,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public sealed class NewsCreateDto
{
    [Required, StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(200, MinimumLength = 3), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    public string Slug { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Excerpt { get; set; }

    public string? Content { get; set; }

    [StringLength(1000)]
    public string? ImageUrl { get; set; }

    public ContentStatus Status { get; set; }

    public DateTime? PublishedAt { get; set; }
}

public sealed class NewsUpdateDto
{
    [Required, StringLength(200, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(200, MinimumLength = 3), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    public string Slug { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Excerpt { get; set; }

    public string? Content { get; set; }

    [StringLength(1000)]
    public string? ImageUrl { get; set; }

    public ContentStatus Status { get; set; }

    public DateTime? PublishedAt { get; set; }
}
