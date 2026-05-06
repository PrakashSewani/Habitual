namespace Application.Models.Habits.Update
{
    public class UpdateHabit
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public UpdateHabitSchedule Schedule { get; set; }
    }
}
