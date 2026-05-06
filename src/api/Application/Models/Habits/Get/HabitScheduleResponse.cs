using Domain.Common.Enums;

namespace Application.Models.Habits.Get
{
    public class HabitScheduleResponse
    {
        public ScheduleType Type { get; set; }

        public int IntervalDays { get; set; }

        public List<WeekDay> DaysOfWeek { get; set; }
    }
}