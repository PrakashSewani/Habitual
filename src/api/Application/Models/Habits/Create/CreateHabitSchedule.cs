using Domain.Common.Enums;

namespace Application.Models.Habits.Create
{
    public class CreateHabitSchedule
    {
        public ScheduleType Type { get; set; }
        public int? Interval { get; set; }
        public List<WeekDay> DaysOfWeek { get; set; }
    }
}
