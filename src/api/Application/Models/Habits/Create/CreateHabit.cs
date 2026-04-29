namespace Application.Models.Habits.Create
{
    public class CreateHabit
    {
        public Guid UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public CreateHabitSchedule Schedule { get; set; }
    }
}
