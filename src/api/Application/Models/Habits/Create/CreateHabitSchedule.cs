using Domain.Common.Enums;

namespace Application.Models.Habits.Create
{
    /// <summary>
    /// Represents the data required to create a new habit schedule, including the schedule type, interval, and
    /// applicable days of the week.
    /// </summary>
    /// <remarks>Use this class to specify the recurrence pattern when creating a habit, such as daily,
    /// weekly, or custom intervals. The properties should be set according to the desired scheduling logic. For
    /// example, set the <see cref="Type"/> to indicate the schedule type, <see cref="Interval"/> for custom intervals,
    /// and <see cref="DaysOfWeek"/> for weekly schedules.</remarks>
    public class CreateHabitSchedule
    {
        public ScheduleType Type { get; set; }
        public int? Interval { get; set; }
        public List<WeekDay> DaysOfWeek { get; set; }
    }
}
