namespace Application.Models.Habits.Update
{
    /// <summary>
    /// Represents the data required to update an existing habit, including its identity, descriptive information,
    /// status, and scheduling details.
    /// </summary>
    /// <remarks>Use this class to supply updated values when modifying an existing habit in the system. All
    /// properties should be set to reflect the desired new state of the habit. The associated schedule can be updated
    /// by providing a new or modified schedule object.</remarks>
    public class UpdateHabit
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public UpdateHabitSchedule Schedule { get; set; }
    }
}
