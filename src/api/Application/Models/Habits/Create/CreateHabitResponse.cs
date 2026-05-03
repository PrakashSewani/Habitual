namespace Application.Models.Habits.Create
{
    public class CreateHabitResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public CreateHabitSchedule Schedule { get; set; }
    }
}
