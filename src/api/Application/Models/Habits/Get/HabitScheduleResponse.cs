using Domain.Common.Enums;

namespace Application.Models.Habits.Get
{
    /// <summary>
    /// Represents the scheduling details for a habit, including the schedule type, interval, and specific days of the
    /// week.
    /// </summary>
    /// <remarks>Use this class to convey how a habit is scheduled, such as whether it recurs daily, on
    /// specific days, or at a custom interval. The properties provide the necessary information to interpret or display
    /// the schedule to users.</remarks>
    public class HabitScheduleResponse
    {
        public ScheduleType Type { get; set; }

        public int IntervalDays { get; set; }

        public List<WeekDay> DaysOfWeek { get; set; }
    }
}