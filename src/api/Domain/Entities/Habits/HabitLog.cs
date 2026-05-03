namespace Domain.Entities.Habits
{
    public class HabitLog
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public DateTime Date { get; set; }

        public Habit Habit { get; set; }
    }
}
