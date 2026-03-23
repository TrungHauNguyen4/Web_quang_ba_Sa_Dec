using Sadec.Api.Entities;

namespace Sadec.Api.Dtos;

public sealed record DestinationDto(
    Guid Id,
    string Title,
    string Slug,
    string? Excerpt,
    string? Content,
    double? Latitude,
    double? Longitude,
    ContentStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public sealed record DestinationCreateDto(
    string Title,
    string Slug,
    string? Excerpt,
    string? Content,
    double? Latitude,
    double? Longitude,
    ContentStatus Status
);

public sealed record DestinationUpdateDto(
    string Title,
    string Slug,
    string? Excerpt,
    string? Content,
    double? Latitude,
    double? Longitude,
    ContentStatus Status
);
