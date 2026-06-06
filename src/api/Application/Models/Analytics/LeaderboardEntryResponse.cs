namespace Application.Models.Analytics
{
    public class LeaderboardEntryResponse
    {
        public Guid HabitId { get; set; }
        public string HabitName { get; set; }
        public int Rank { get; set; }
        public int CompletionRate { get; set; }
        public int ScheduledDays { get; set; }
        public int CompletedDays { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public int TotalLogs { get; set; }
        public int MonthlyLogs { get; set; }
    }
}
