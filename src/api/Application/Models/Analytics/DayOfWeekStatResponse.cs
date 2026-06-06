namespace Application.Models.Analytics
{
    public class DayOfWeekStatResponse
    {
        public string Day { get; set; }
        public int Index { get; set; }
        public int Scheduled { get; set; }
        public int Completed { get; set; }
        public int Rate { get; set; }
    }
}
