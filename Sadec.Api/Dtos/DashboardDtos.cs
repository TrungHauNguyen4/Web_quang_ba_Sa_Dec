namespace Sadec.Api.Dtos;

public sealed record DashboardStatsDto(
    int ReceivedToday,
    int Processing,
    int Overdue,
    int CompletedTotal,
    int TotalNewsViews,
    int PublishedNews
);

public sealed record DashboardTrendPointDto(
    string Day,
    int Received,
    int Resolved
);

public sealed record DashboardBacklogPointDto(
    string Unit,
    int Pending
);

public sealed record DashboardQuickTaskDto(
    string Label,
    int Value,
    string Level
);

public sealed record DashboardActivityDto(
    string Actor,
    string Action,
    string Target,
    string Time
);

public sealed record DashboardAccessPointDto(
    string Label,
    int Views
);

public sealed record DashboardNewsReportPointDto(
    string Title,
    int Views
);

public sealed record DashboardOverviewDto(
    DashboardStatsDto Stats,
    IReadOnlyList<DashboardTrendPointDto> Trend,
    IReadOnlyList<DashboardAccessPointDto> AccessTrend,
    IReadOnlyList<DashboardNewsReportPointDto> NewsReport,
    IReadOnlyList<DashboardBacklogPointDto> Backlog,
    IReadOnlyList<DashboardQuickTaskDto> QuickTasks,
    IReadOnlyList<DashboardActivityDto> Activities,
    DateTime GeneratedAt
);