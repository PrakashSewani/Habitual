using Domain.Entities.Habits;

namespace Application.Models.Habits.Update
{
    public class UpdateHabitResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public List<HabitLog> HabitLog { get; set; }
        public HabitSchedule Schedule { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
