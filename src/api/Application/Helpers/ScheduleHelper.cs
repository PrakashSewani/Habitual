using Domain.Common.Enums;
using Domain.Entities.Habits;

namespace Application.Helpers
{
    /// <summary>
    /// Provides helper methods for evaluating whether a habit is scheduled for a specific date.
    /// </summary>
    public static class ScheduleHelper
    {
        /// <summary>
        /// Determines whether a habit is scheduled for the given date based on its schedule configuration.
        /// </summary>
        /// <param name="schedule">The habit schedule.</param>
        /// <param name="createdAt">The habit creation date (used as anchor for interval schedules).</param>
        /// <param name="date">The date to check.</param>
        /// <returns>True if the habit is scheduled for the date; otherwise false.</returns>
        public static bool IsScheduledForDate(HabitSchedule schedule, DateTime createdAt, DateOnly date)
        {
            return schedule.Type switch
            {
                ScheduleType.Daily => true,
                ScheduleType.Weekly => IsWeeklyScheduled(schedule, date),
                ScheduleType.Interval => IsIntervalScheduled(schedule, createdAt, date),
                _ => true
            };
        }

        private static bool IsWeeklyScheduled(HabitSchedule schedule, DateOnly date)
        {
            if (schedule.DaysOfWeek == null || schedule.DaysOfWeek.Count == 0)
                return true; // fallback: no restriction means every day

            var dayOfWeek = (WeekDay)date.DayOfWeek;
            return schedule.DaysOfWeek.Contains(dayOfWeek);
        }

        private static bool IsIntervalScheduled(HabitSchedule schedule, DateTime createdAt, DateOnly date)
        {
            if (!schedule.Interval.HasValue || schedule.Interval.Value <= 0)
                return true; // fallback: treat as daily if interval is invalid

            var createdDate = DateOnly.FromDateTime(createdAt);
            var daysDiff = date.DayNumber - createdDate.DayNumber;

            return daysDiff >= 0 && daysDiff % schedule.Interval.Value == 0;
        }
    }
}
