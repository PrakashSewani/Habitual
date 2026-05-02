namespace Application.Models.Habits.Create
{
    public class CreateHabit
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public CreateHabitSchedule Schedule { get; set; }
    }
}
