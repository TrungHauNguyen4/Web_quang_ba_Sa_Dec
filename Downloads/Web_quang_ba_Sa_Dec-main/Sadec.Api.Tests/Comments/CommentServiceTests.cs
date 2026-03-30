using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;
using Sadec.Api.Exceptions;
using Sadec.Api.Services.Comments;
using Xunit;

namespace Sadec.Api.Tests.Comments;

public sealed class CommentServiceTests
{
    [Fact]
    public async Task SubmitAsync_ShouldCreatePendingComment_WhenTargetPublished()
    {
        await using var dbContext = CreateDbContext();
        var newsId = SeedPublishedNews(dbContext);
        var service = new CommentService(dbContext);

        var created = await service.SubmitAsync(new CommentCreateRequestDto
        {
            TargetType = "news",
            TargetId = newsId,
            UserName = "Nguyen Van A",
            Email = "a@test.local",
            Content = "Bài viết rất hữu ích"
        });

        Assert.Equal(CommentStatus.Pending, created.Status);
        Assert.Equal("news", created.TargetType);

        var persisted = await dbContext.BinhLuans.FirstOrDefaultAsync(x => x.MaSo == created.Id);
        Assert.NotNull(persisted);
        Assert.Equal(CommentStatus.Pending, persisted!.TrangThai);
    }

    [Fact]
    public async Task SubmitAsync_ShouldThrowValidation_WhenTargetNotPublished()
    {
        await using var dbContext = CreateDbContext();
        var draftNewsId = SeedDraftNews(dbContext);
        var service = new CommentService(dbContext);

        await Assert.ThrowsAsync<ApiValidationException>(() => service.SubmitAsync(new CommentCreateRequestDto
        {
            TargetType = "news",
            TargetId = draftNewsId,
            UserName = "Le Thi B",
            Email = "b@test.local",
            Content = "Comment thử"
        }));
    }

    [Fact]
    public async Task ApproveAndReject_ShouldUpdateCommentStatus()
    {
        await using var dbContext = CreateDbContext();
        var pendingCommentId = SeedPendingComment(dbContext, SeedPublishedNews(dbContext));
        var service = new CommentService(dbContext);

        var approved = await service.ApproveAsync(pendingCommentId);
        Assert.Equal(CommentStatus.Approved, approved.Status);

        var rejected = await service.RejectAsync(pendingCommentId);
        Assert.Equal(CommentStatus.Rejected, rejected.Status);
    }

    [Fact]
    public async Task GetForModeration_ShouldFilterByStatus()
    {
        await using var dbContext = CreateDbContext();
        var newsId = SeedPublishedNews(dbContext);

        dbContext.BinhLuans.AddRange(
            new BinhLuan
            {
                TargetType = "news",
                TargetId = newsId,
                TenNguoiGui = "Pending User",
                Email = "pending@test.local",
                NoiDung = "Pending",
                TrangThai = CommentStatus.Pending
            },
            new BinhLuan
            {
                TargetType = "news",
                TargetId = newsId,
                TenNguoiGui = "Approved User",
                Email = "approved@test.local",
                NoiDung = "Approved",
                TrangThai = CommentStatus.Approved
            }
        );
        await dbContext.SaveChangesAsync();

        var service = new CommentService(dbContext);

        var pendingPage = await service.GetForModerationAsync(page: 1, pageSize: 10, status: CommentStatus.Pending, targetType: null);

        Assert.Single(pendingPage.Items);
        Assert.Equal(CommentStatus.Pending, pendingPage.Items[0].Status);
    }

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase($"comment-tests-{Guid.NewGuid():N}")
            .Options;

        return new ApplicationDbContext(options);
    }

    private static Guid SeedPublishedNews(ApplicationDbContext dbContext)
    {
        var entity = new TinTuc
        {
            TieuDe = "Tin đã duyệt",
            DuongDan = $"tin-da-duyet-{Guid.NewGuid():N}",
            TrangThai = ContentStatus.Published,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow
        };

        dbContext.TinTucs.Add(entity);
        dbContext.SaveChanges();
        return entity.MaSo;
    }

    private static Guid SeedDraftNews(ApplicationDbContext dbContext)
    {
        var entity = new TinTuc
        {
            TieuDe = "Tin nháp",
            DuongDan = $"tin-nhap-{Guid.NewGuid():N}",
            TrangThai = ContentStatus.Draft,
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow
        };

        dbContext.TinTucs.Add(entity);
        dbContext.SaveChanges();
        return entity.MaSo;
    }

    private static Guid SeedPendingComment(ApplicationDbContext dbContext, Guid newsId)
    {
        var entity = new BinhLuan
        {
            TargetType = "news",
            TargetId = newsId,
            TenNguoiGui = "Test",
            Email = "test@test.local",
            NoiDung = "Noi dung",
            TrangThai = CommentStatus.Pending
        };

        dbContext.BinhLuans.Add(entity);
        dbContext.SaveChanges();
        return entity.MaSo;
    }
}
