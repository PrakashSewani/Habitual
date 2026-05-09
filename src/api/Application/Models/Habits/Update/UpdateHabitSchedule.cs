using Domain.Common.Enums;

namespace Application.Models.Habits.Update
{
    /// <summary>
    /// Represents the schedule configuration used to update a habit's recurrence pattern.
    /// </summary>
    /// <remarks>Use this class to specify how often and on which days a habit should occur. The schedule can
    /// be defined by type, interval, and specific days of the week, allowing for flexible habit recurrence
    /// settings.</remarks>
    public class UpdateHabitSchedule
    {
        public ScheduleType Type { get; set; }
        public int? Interval { get; set; }
        public List<WeekDay> DaysOfWeek { get; set; }
    }
}
