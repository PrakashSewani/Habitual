namespace Application.Models.Analytics
{
    public class HeatmapDayResponse
    {
        public string Date { get; set; }
        public int DayNum { get; set; }
        public int Count { get; set; }
        public bool IsScheduled { get; set; }
        public List<string> CompletedHabitIds { get; set; } = new();
    }
}
