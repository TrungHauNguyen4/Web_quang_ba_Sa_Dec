using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Services.Comments;

public interface ICommentService
{
    Task<CommentDto> SubmitAsync(CommentCreateRequestDto request, CancellationToken cancellationToken = default);
    Task<PagedResultDto<CommentDto>> GetApprovedByTargetAsync(string targetType, Guid targetId, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default);
    Task<PagedResultDto<CommentDto>> GetForModerationAsync(int page = 1, int pageSize = 20, CommentStatus? status = null, string? targetType = null, CancellationToken cancellationToken = default);
    Task<CommentDto> UpdateStatusAsync(Guid commentId, CommentStatus status, CancellationToken cancellationToken = default);
}
