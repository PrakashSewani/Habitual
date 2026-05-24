using Domain.Common.Enums;

namespace Application.Models.Habits.Create
{
    /// <summary>
    /// Represents the data required to create a new habit, including its name, description, status, and scheduling
    /// information.
    /// </summary>
    /// <remarks>Use this class to encapsulate all information needed when defining a new habit in the system.
    /// The properties should be set to describe the habit's characteristics and recurrence pattern.</remarks>
    public class CreateHabit
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public CreateHabitSchedule Schedule { get; set; }
    }
}
