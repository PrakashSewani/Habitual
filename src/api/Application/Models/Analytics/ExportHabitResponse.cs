namespace Application.Models.Analytics
{
    public class ExportHabitResponse
    {
        public Guid HabitId { get; set; }
        public string HabitName { get; set; }
        public List<ExportHabitLogEntryResponse> Logs { get; set; }
    }
}
