using Domain.Common.Enums;

namespace Application.Models.Habits.Get
{
    /// <summary>
    /// Represents the details of a habit assigned to a user, including its metadata, schedule, and associated log
    /// entries.
    /// </summary>
    /// <remarks>This response type is typically used to return comprehensive information about a specific
    /// habit for a user, such as when retrieving habit details in a habit-tracking application. It includes the habit's
    /// unique identifier, descriptive information, activation status, creation timestamp, scheduling details, and a
    /// collection of log entries related to the habit's completion or progress.</remarks>
    public class GetHabitForUserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public Source CreatedFrom { get; set; }
        public DateTime CreatedAt { get; set; }
        public HabitScheduleResponse Schedule { get; set; }
        public List<GetHabitLogEntryForUserResponse> HabitLogs { get; set; }
    }
}
