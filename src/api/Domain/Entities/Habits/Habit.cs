using Domain.Entities.Users;

namespace Domain.Entities.Habits
{
    public class Habit
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastModified { get; set; } = DateTime.UtcNow;

        public List<HabitLog> HabitLogs { get; set; } = [];
        public HabitSchedule Schedule { get; set; }
    }
}
