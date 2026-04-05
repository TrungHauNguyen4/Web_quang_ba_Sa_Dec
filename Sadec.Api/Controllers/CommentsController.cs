using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;
using Sadec.Api.Services.Comments;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/comments")]
public sealed class CommentsController(ICommentService commentService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CommentDto>> Submit([FromBody] CommentCreateRequestDto request, CancellationToken cancellationToken)
    {
        var created = await commentService.SubmitAsync(request, cancellationToken);
        return Ok(created);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<CommentDto>>> GetApprovedByTarget(
        [FromQuery] string targetType,
        [FromQuery] Guid targetId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await commentService.GetApprovedByTargetAsync(targetType, targetId, page, pageSize, cancellationToken);
        return Ok(result);
    }

    [HttpGet("/api/admin/comments")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<PagedResultDto<CommentDto>>> GetForModeration(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] CommentStatus? status = null,
        [FromQuery] string? targetType = null,
        CancellationToken cancellationToken = default)
    {
        var result = await commentService.GetForModerationAsync(page, pageSize, status, targetType, cancellationToken);
        return Ok(result);
    }

    [HttpGet("/api/admin/comments/auto-approve")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<CommentAutoApproveDto>> GetAutoApprove(CancellationToken cancellationToken)
    {
        var enabled = await commentService.GetAutoApproveEnabledAsync(cancellationToken);
        return Ok(new CommentAutoApproveDto(enabled));
    }

    [HttpPut("/api/admin/comments/auto-approve")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<CommentAutoApproveDto>> SetAutoApprove([FromBody] CommentAutoApproveUpdateDto request, CancellationToken cancellationToken)
    {
        await commentService.SetAutoApproveEnabledAsync(request.Enabled, cancellationToken);
        return Ok(new CommentAutoApproveDto(request.Enabled));
    }

    [HttpPatch("/api/admin/comments/{commentId:guid}/approve")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<CommentDto>> Approve(Guid commentId, CancellationToken cancellationToken)
    {
        var result = await commentService.UpdateStatusAsync(commentId, CommentStatus.Approved, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("/api/admin/comments/{commentId:guid}/reject")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<CommentDto>> Reject(Guid commentId, CancellationToken cancellationToken)
    {
        var result = await commentService.UpdateStatusAsync(commentId, CommentStatus.Rejected, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("/api/admin/comments/{commentId:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Delete(Guid commentId, CancellationToken cancellationToken)
    {
        await commentService.DeleteAsync(commentId, cancellationToken);
        return NoContent();
    }

    [HttpDelete("/api/admin/comments/history")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeleteReviewedHistory([FromQuery] bool includePending = false, CancellationToken cancellationToken = default)
    {
        var deletedCount = await commentService.DeleteReviewedHistoryAsync(includePending, cancellationToken);
        return Ok(new { deletedCount });
    }

    [HttpDelete("/api/admin/comments")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeleteAll(CancellationToken cancellationToken = default)
    {
        var deletedCount = await commentService.DeleteReviewedHistoryAsync(includePending: true, cancellationToken);
        return Ok(new { deletedCount });
    }
}
