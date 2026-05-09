namespace Application.Models.Habits.Get
{
    /// <summary>
    /// Represents the response containing a specific habit log entry for a user, including its unique identifier and
    /// the date of the entry.
    /// </summary>
    public class GetHabitLogEntryForUserResponse
    {
        public Guid Id { get; set; }
        public DateOnly Date { get; set; }
    }
}