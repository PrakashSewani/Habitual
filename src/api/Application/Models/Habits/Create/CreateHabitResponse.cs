namespace Application.Models.Habits.Create
{
    /// <summary>
    /// Represents the result of a habit creation operation, including the habit's identifier, details, status, creation
    /// time, and associated schedule.
    /// </summary>
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
