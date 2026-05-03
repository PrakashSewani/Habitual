using Domain.Common.Enums;

namespace Application.Models.Habits.Update
{
    public class UpdateHabitSchedule
    {
        public ScheduleType Type { get; set; }
        public int? Interval { get; set; }
        public List<string> DaysOfWeek { get; set; }
    }
}
