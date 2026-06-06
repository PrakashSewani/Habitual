namespace Application.Models.Analytics
{
    public class MonthSummaryResponse
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int TotalScheduledDays { get; set; }
        public int TotalCompletedDays { get; set; }
        public int CompletionRate { get; set; }
        public int TotalLogs { get; set; }
        public int ActiveHabitCount { get; set; }
        public string BestHabitName { get; set; }
        public int BestHabitRate { get; set; }
    }
}
