namespace Application.Models.Analytics
{
    public class DashboardStatsResponse
    {
        public int TotalHabits { get; set; }
        public int ActiveHabits { get; set; }
        public int TotalLogs { get; set; }
        public int ThisWeekLogs { get; set; }
        public int BestStreak { get; set; }
        public double AvgLogsPerDay { get; set; }
        public int ThisWeekCompletionRate { get; set; }
    }
}
