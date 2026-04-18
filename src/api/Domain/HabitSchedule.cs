namespace Domain
{
    public enum ScheduleType
    {
        Daily,
        Weekly,
        Interval
    }
    
    public class HabitSchedule
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public Habit Habit { get; set; }
        public ScheduleType Type { get; set; }
        public int? Interval { get; set; }
    }
}
