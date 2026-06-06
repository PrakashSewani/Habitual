using Application.Models.Analytics;

namespace Application.Interfaces
{
    public interface IAnalyticsService
    {
        Task<DashboardStatsResponse> GetDashboardStatsAsync(Guid userId);
        Task<List<List<HeatmapDayResponse>>> GetHeatmapDataAsync(Guid userId);
        Task<List<LeaderboardEntryResponse>> GetLeaderboardAsync(Guid userId, int year, int month, string sortBy);
        Task<List<DayOfWeekStatResponse>> GetDayOfWeekStatsAsync(Guid userId);
        Task<List<BadgeResponse>> GetBadgesAsync(Guid userId);
        Task<DayDetailResponse> GetDayDetailAsync(Guid userId, DateOnly date);
        Task<MonthComparisonResponse> GetMonthComparisonAsync(Guid userId);
        Task<List<ExportHabitResponse>> ExportHabitsJsonAsync(Guid userId);
        Task<string> ExportHabitsCsvAsync(Guid userId);
    }
}
