namespace Application.Models.Habits.Update
{
    public class UpdateHabit
    {
        public Guid UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public UpdateHabitSchedule Schedule { get; set; }
    }
}
