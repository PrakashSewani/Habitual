namespace Application.Models.Analytics
{
    public class MonthComparisonResponse
    {
        public MonthSummaryResponse CurrentMonth { get; set; }
        public MonthSummaryResponse PreviousMonth { get; set; }
        public int DeltaRate { get; set; }
    }
}
