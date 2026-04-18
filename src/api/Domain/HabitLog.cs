namespace Domain
{
    public class HabitLog
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public Habit Habit { get; set; }
        public DateTime Date { get; set; }
    }
}
