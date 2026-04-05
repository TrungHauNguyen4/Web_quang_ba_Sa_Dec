using System.ComponentModel.DataAnnotations;
using Sadec.Api.Entities;

namespace Sadec.Api.Dtos;

public sealed record CommentDto(
    Guid Id,
    string TargetType,
    Guid TargetId,
    string? TargetSlug,
    string? TargetTitle,
    string UserName,
    string Email,
    string Content,
    CommentStatus Status,
    DateTime CreatedAt
);

public sealed class CommentCreateRequestDto
{
    [Required, StringLength(50)]
    public string TargetType { get; set; } = string.Empty;

    [Required]
    public Guid TargetId { get; set; }

    [StringLength(120, MinimumLength = 2)]
    public string? UserName { get; set; }

    [EmailAddress, StringLength(200)]
    public string? Email { get; set; }

    [Required, StringLength(2000, MinimumLength = 2)]
    public string Content { get; set; } = string.Empty;
}

public sealed class CommentAutoApproveUpdateDto
{
    public bool Enabled { get; set; }
}

public sealed record CommentAutoApproveDto(bool Enabled);
