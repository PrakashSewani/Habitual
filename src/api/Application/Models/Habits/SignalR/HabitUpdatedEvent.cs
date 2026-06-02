using Application.Models.Habits.Get;

namespace Application.Models.Habits.SignalR
{
    /// <summary>
    /// Represents the payload for a habit update event that is broadcasted to clients via SignalR
    /// when a habit is created, updated, or deleted.
    /// </summary>
    public class HabitUpdatedEvent
    {
        public Guid HabitId { get; set; }
        public string Action { get; set; } = string.Empty;
        public GetHabitForUserResponse? Habit { get; set; }
    }
}
