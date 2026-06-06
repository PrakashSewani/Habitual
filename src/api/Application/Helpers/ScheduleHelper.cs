using Domain.Common.Enums;
using Domain.Entities.Habits;

namespace Application.Helpers
{
    public static class ScheduleHelper
    {
        public static bool IsScheduledForDate(HabitSchedule schedule, DateTime createdAt, DateOnly date)
        {
            var dayOfWeek = (int)date.DayOfWeek;

            switch (schedule.Type)
            {
                case ScheduleType.Daily:
                    return true;

                case ScheduleType.Weekly:
                    if (schedule.DaysOfWeek == null || schedule.DaysOfWeek.Count == 0)
                        return true;
                    return schedule.DaysOfWeek.Any(d => (int)d == dayOfWeek);

                case ScheduleType.Interval:
                    var interval = schedule.Interval ?? 0;
                    if (interval <= 0) return true;

                    var createdDate = DateOnly.FromDateTime(createdAt);
                    var diffDays = (date.ToDateTime(TimeOnly.MinValue) - createdDate.ToDateTime(TimeOnly.MinValue)).TotalDays;

                    return diffDays >= 0 && diffDays % interval == 0;

                default:
                    return true;
            }
        }

        public static bool IsScheduledForDate(HabitSchedule schedule, DateTime createdAt, DateTime date)
        {
            return IsScheduledForDate(schedule, createdAt, DateOnly.FromDateTime(date));
        }
    }
}
