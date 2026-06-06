namespace Application.Models.Analytics
{
    public class DayDetailResponse
    {
        public string Date { get; set; }
        public List<DayHabitEntryResponse> CompletedHabits { get; set; }
        public List<DayHabitEntryResponse> MissedHabits { get; set; }
    }
}
