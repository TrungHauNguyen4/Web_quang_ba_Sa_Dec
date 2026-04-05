using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin,Editor")]
public sealed class AdminDashboardController(ApplicationDbContext dbContext) : ControllerBase
{
    private const int DefaultSlaDays = 3;

    private static readonly string[] PendingStatuses = ["pending", "new", "submitted"];
    private static readonly string[] ProcessingStatuses = ["processing", "inprogress", "in_progress", "handling"];
    private static readonly string[] CompletedStatuses = ["completed", "resolved", "done", "success"];
    private static readonly string[] RejectedStatuses = ["rejected", "supplement", "needsupplement", "need_supplement", "bo_sung"];

    [HttpGet("overview")]
    public async Task<ActionResult<DashboardOverviewDto>> GetOverview(CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;

        var allStatuses = PendingStatuses
            .Concat(ProcessingStatuses)
            .Concat(CompletedStatuses)
            .Concat(RejectedStatuses)
            .Distinct()
            .ToArray();

        var receivedToday = await dbContext.HoSoDichVus.CountAsync(
            x => x.NgayNopLuc >= today,
            cancellationToken);

        var processing = await dbContext.HoSoDichVus.CountAsync(
            x => x.TrangThai != null && ProcessingStatuses.Contains(x.TrangThai.ToLower()),
            cancellationToken);

        var overdueThreshold = DateTime.UtcNow.AddDays(-DefaultSlaDays);

        var overdue = await dbContext.HoSoDichVus.CountAsync(
            x => x.TrangThai != null
                && (PendingStatuses.Contains(x.TrangThai.ToLower()) || ProcessingStatuses.Contains(x.TrangThai.ToLower()))
                && x.NgayNopLuc < overdueThreshold,
            cancellationToken);

        var completedTotal = await dbContext.HoSoDichVus.CountAsync(
            x => x.TrangThai != null && CompletedStatuses.Contains(x.TrangThai.ToLower()),
            cancellationToken);

        var fromDate = today.AddDays(-6);
        var applicationsInWeek = await dbContext.HoSoDichVus
            .Where(x => x.NgayNopLuc >= fromDate && x.TrangThai != null && allStatuses.Contains(x.TrangThai.ToLower()))
            .ToListAsync(cancellationToken);

        var trend = Enumerable.Range(0, 7)
            .Select(i => fromDate.AddDays(i))
            .Select(date =>
            {
                var dayItems = applicationsInWeek.Where(x => x.NgayNopLuc.Date == date).ToList();
                return new DashboardTrendPointDto(
                    ToVietnameseDay(date.DayOfWeek),
                    dayItems.Count,
                    dayItems.Count(x => x.TrangThai != null && CompletedStatuses.Contains(x.TrangThai.ToLower())));
            })
            .ToList();

        var backlogRaw = await dbContext.HoSoDichVus
            .Where(x => x.TrangThai != null && (PendingStatuses.Contains(x.TrangThai.ToLower()) || ProcessingStatuses.Contains(x.TrangThai.ToLower())))
            .GroupBy(x => x.TenThuTuc)
            .Select(g => new { Unit = g.Key, Pending = g.Count() })
            .OrderByDescending(x => x.Pending)
            .Take(5)
            .ToListAsync(cancellationToken);

        var backlog = backlogRaw
            .Select(x => new DashboardBacklogPointDto(x.Unit, x.Pending))
            .ToList();

        var pendingComments = await dbContext.BinhLuans.CountAsync(x => x.TrangThai == Entities.CommentStatus.Pending, cancellationToken);
        var pendingNews = await dbContext.TinTucs.CountAsync(x => x.TrangThai == Entities.ContentStatus.Draft, cancellationToken);
        var publishedNews = await dbContext.TinTucs.CountAsync(x => x.TrangThai == Entities.ContentStatus.Published, cancellationToken);
        var totalNewsViews = await dbContext.TinTucs.SumAsync(x => x.LuotXem, cancellationToken);
        var waitingReception = await dbContext.HoSoDichVus.CountAsync(
            x => x.TrangThai != null && PendingStatuses.Contains(x.TrangThai.ToLower()),
            cancellationToken);

        var quickTasks = new List<DashboardQuickTaskDto>
        {
            new("Bình luận chờ duyệt", pendingComments, "warning"),
            new("Tin tức bản nháp", pendingNews, "info"),
            new("Hồ sơ chờ tiếp nhận", waitingReception, "warning"),
            new("Cảnh báo quá hạn", overdue, "danger")
        };

        var fromAccessDate = today.AddDays(-6);
        var accessRows = await dbContext.TinTucs
            .Where(x => x.TrangThai == Entities.ContentStatus.Published)
            .Select(x => new { Date = (x.PhatHanhLuc ?? x.TaoLuc).Date, x.LuotXem })
            .ToListAsync(cancellationToken);

        var accessTrend = Enumerable.Range(0, 7)
            .Select(i => fromAccessDate.AddDays(i))
            .Select(date => new DashboardAccessPointDto(
                ToVietnameseDay(date.DayOfWeek),
                accessRows.Where(x => x.Date == date).Sum(x => x.LuotXem)))
            .ToList();

        var newsReport = await dbContext.TinTucs
            .Where(x => x.TrangThai == Entities.ContentStatus.Published)
            .OrderByDescending(x => x.LuotXem)
            .Take(5)
            .Select(x => new DashboardNewsReportPointDto(x.TieuDe, x.LuotXem))
            .ToListAsync(cancellationToken);

        var recentActivities = await dbContext.AuditLogs
            .OrderByDescending(x => x.CreatedAt)
            .Take(6)
            .Select(x => new DashboardActivityDto(
                string.IsNullOrWhiteSpace(x.UserName) ? "Hệ thống" : x.UserName!,
                x.Action,
                string.IsNullOrWhiteSpace(x.TargetId) ? x.TargetType : x.TargetId!,
                RelativeTime(x.CreatedAt)))
            .ToListAsync(cancellationToken);

        var result = new DashboardOverviewDto(
            new DashboardStatsDto(receivedToday, processing, overdue, completedTotal, totalNewsViews, publishedNews),
            trend,
            accessTrend,
            newsReport,
            backlog,
            quickTasks,
            recentActivities,
            DateTime.UtcNow);

        return Ok(result);
    }

    private static string RelativeTime(DateTime utcTime)
    {
        var span = DateTime.UtcNow - utcTime;
        if (span.TotalMinutes < 1) return "vừa xong";
        if (span.TotalMinutes < 60) return $"{(int)span.TotalMinutes} phút trước";
        if (span.TotalHours < 24) return $"{(int)span.TotalHours} giờ trước";
        return $"{(int)span.TotalDays} ngày trước";
    }

    private static string ToVietnameseDay(DayOfWeek dayOfWeek)
    {
        return dayOfWeek switch
        {
            DayOfWeek.Monday => "T2",
            DayOfWeek.Tuesday => "T3",
            DayOfWeek.Wednesday => "T4",
            DayOfWeek.Thursday => "T5",
            DayOfWeek.Friday => "T6",
            DayOfWeek.Saturday => "T7",
            DayOfWeek.Sunday => "CN",
            _ => string.Empty
        };
    }
}