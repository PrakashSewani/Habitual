namespace Domain
{
    public class Habit
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;

        public List<HabitLog> HabitStats { get; set; } = [];
        public HabitSchedule Schedule { get; set; }
        public DateTime CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
