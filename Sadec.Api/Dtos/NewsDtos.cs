using Sadec.Api.Entities;

namespace Sadec.Api.Dtos;

public sealed record NewsDto(
    Guid Id,
    string Title,
    string Slug,
    string? Excerpt,
    string? Content,
    ContentStatus Status,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public sealed record NewsCreateDto(
    string Title,
    string Slug,
    string? Excerpt,
    string? Content,
    ContentStatus Status,
    DateTime? PublishedAt
);

public sealed record NewsUpdateDto(
    string Title,
    string Slug,
    string? Excerpt,
    string? Content,
    ContentStatus Status,
    DateTime? PublishedAt
);
