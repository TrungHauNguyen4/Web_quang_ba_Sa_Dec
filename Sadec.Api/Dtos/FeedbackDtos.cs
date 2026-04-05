using System.ComponentModel.DataAnnotations;

namespace Sadec.Api.Dtos;

public sealed class FeedbackCreateDto
{
    [Required, StringLength(200, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, RegularExpression(@"^[0-9]{8,15}$", ErrorMessage = "Số điện thoại chỉ được chứa chữ số và dài từ 8 đến 15 số."), StringLength(30)]
    public string Phone { get; set; } = string.Empty;

    [Required, StringLength(500, MinimumLength = 2)]
    public string Address { get; set; } = string.Empty;

    [Required, StringLength(3000, MinimumLength = 10)]
    public string Content { get; set; } = string.Empty;
}

public sealed record FeedbackSubmitResultDto(
    string TicketId,
    string Status,
    DateTime SubmittedAt
);
