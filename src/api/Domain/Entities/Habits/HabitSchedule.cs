using Domain.Common.Enums;

namespace Domain.Entities.Habits
{
    public class HabitSchedule
    {
        public Guid Id { get; set; }
        public Guid HabitId { get; set; }
        public ScheduleType Type { get; set; }
        public int? Interval { get; set; }
        public List<string> DaysOfWeek { get; set; }

        public Habit Habit { get; set; }
    }
}
