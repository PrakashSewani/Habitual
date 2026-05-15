namespace Application.Models.Habits.SignalR
{
    /// <summary>
    /// Represents the payload for a habit log update event that is broadcasted to clients via SignalR when a habit log entry is updated.
    /// </summary>
    public class HabitLogUpdatedEvent
    {
        public Guid HabitId { get; set; }
        public DateOnly Date { get; set; }
        public bool Completed { get; set; }
    }
}
