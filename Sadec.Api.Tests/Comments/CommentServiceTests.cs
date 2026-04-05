using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
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
            Content = "Bai viet rat huu ich"
        });

        Assert.Equal(CommentStatus.Pending, created.Status);
        Assert.Equal("news", created.TargetType);

        var persisted = await dbContext.BinhLuans.FirstOrDefaultAsync(x => x.MaSo == created.Id);
        Assert.NotNull(persisted);
        Assert.Equal(CommentStatus.Pending, persisted!.TrangThai);
    }

    [Fact]
    public async Task SubmitAsync_ShouldThrow_WhenTargetNotPublished()
    {
        await using var dbContext = CreateDbContext();
        var newsId = SeedDraftNews(dbContext);
        var service = new CommentService(dbContext);

        var ex = await Assert.ThrowsAsync<AppException>(() => service.SubmitAsync(new CommentCreateRequestDto
        {
            TargetType = "news",
            TargetId = newsId,
            UserName = "Nguyen Van B",
            Email = "b@test.local",
            Content = "Noi dung"
        }));

        Assert.Equal(StatusCodes.Status404NotFound, ex.StatusCode);
    }

    [Fact]
    public async Task UpdateStatusAsync_ShouldApproveComment()
    {
        await using var dbContext = CreateDbContext();
        var commentId = SeedPendingComment(dbContext);
        var service = new CommentService(dbContext);

        var result = await service.UpdateStatusAsync(commentId, CommentStatus.Approved);

        Assert.Equal(CommentStatus.Approved, result.Status);
        var persisted = await dbContext.BinhLuans.FirstAsync(x => x.MaSo == commentId);
        Assert.Equal(CommentStatus.Approved, persisted.TrangThai);
    }

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase($"SadecApiTestDb-{Guid.NewGuid():N}")
            .Options;

        return new ApplicationDbContext(options);
    }

    private static Guid SeedPublishedNews(ApplicationDbContext dbContext)
    {
        var news = new TinTuc
        {
            TieuDe = "News A",
            DuongDan = $"news-a-{Guid.NewGuid():N}",
            TrangThai = ContentStatus.Published
        };

        dbContext.TinTucs.Add(news);
        dbContext.SaveChanges();
        return news.MaSo;
    }

    private static Guid SeedDraftNews(ApplicationDbContext dbContext)
    {
        var news = new TinTuc
        {
            TieuDe = "News Draft",
            DuongDan = $"news-draft-{Guid.NewGuid():N}",
            TrangThai = ContentStatus.Draft
        };

        dbContext.TinTucs.Add(news);
        dbContext.SaveChanges();
        return news.MaSo;
    }

    private static Guid SeedPendingComment(ApplicationDbContext dbContext)
    {
        var comment = new BinhLuan
        {
            TargetType = "news",
            TargetId = Guid.NewGuid(),
            TenNguoiGui = "Pending User",
            Email = "pending@test.local",
            NoiDung = "Pending comment",
            TrangThai = CommentStatus.Pending
        };

        dbContext.BinhLuans.Add(comment);
        dbContext.SaveChanges();
        return comment.MaSo;
    }
}
