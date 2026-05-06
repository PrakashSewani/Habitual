namespace Domain.Entities.Habits
{
    public class HabitLogArchive
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        
        public Habit Habit { get; set; }
    }
}