using System.ComponentModel.DataAnnotations;

namespace Sadec.Api.Dtos;

public sealed record ServiceApplicationDto(
    string Id,
    string ServiceName,
    string Applicant,
    DateTime SubmittedAt,
    DateTime DueAt,
    string Status,
    bool IsOverdue,
    string? Phone,
    string? Email,
    string? Address,
    string? Note,
    IReadOnlyList<string> AttachmentUrls,
    DateTime UpdatedAt
);

public sealed class ServiceApplicationCreateDto
{
    [Required, StringLength(250, MinimumLength = 2)]
    public string ServiceName { get; set; } = string.Empty;

    [Required, StringLength(250, MinimumLength = 2)]
    public string Applicant { get; set; } = string.Empty;

    [Required, RegularExpression(@"^[0-9]{8,15}$", ErrorMessage = "Số điện thoại chỉ được chứa chữ số và dài từ 8 đến 15 số."), StringLength(30)]
    public string Phone { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(500, MinimumLength = 2)]
    public string Address { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Note { get; set; }

    public IReadOnlyList<string>? AttachmentUrls { get; set; }
}

public sealed record ServiceAttachmentUploadDto(
    Guid Id,
    string Url,
    string FileName,
    long SizeBytes,
    string ContentType
);

public sealed class ServiceApplicationStatusUpdateDto
{
    [Required, StringLength(20)]
    public string Status { get; set; } = "processing";

    [StringLength(2000)]
    public string? Note { get; set; }
}

public sealed record PublicServiceDto(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive,
    ServiceFormSchemaDto? FormSchema,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public sealed record ServiceFormFieldDto(
    string Key,
    string Label,
    bool Required,
    string Type,
    string? Placeholder
);

public sealed record ServiceFormSchemaDto(
    string? Title,
    string? Hint,
    string? TemplateUrl,
    string? RequiredDocuments,
    IReadOnlyList<ServiceFormFieldDto> Fields
);

public sealed class PublicServiceCreateDto
{
    [Required, StringLength(250, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public ServiceFormSchemaDto? FormSchema { get; set; }
}

public sealed class PublicServiceUpdateDto
{
    [Required, StringLength(250, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public ServiceFormSchemaDto? FormSchema { get; set; }
}