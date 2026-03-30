using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Services.Comments;

public interface ICommentService
{
    Task<CommentDto> SubmitAsync(CommentCreateRequestDto request, CancellationToken cancellationToken = default);

    Task<PagedResultDto<CommentDto>> GetForModerationAsync(
        int page,
        int pageSize,
        CommentStatus? status,
        string? targetType,
        CancellationToken cancellationToken = default);

    Task<CommentDto> ApproveAsync(Guid commentId, CancellationToken cancellationToken = default);

    Task<CommentDto> RejectAsync(Guid commentId, CancellationToken cancellationToken = default);

    Task<PagedResultDto<CommentDto>> GetApprovedByTargetAsync(
        string targetType,
        Guid targetId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);
}
