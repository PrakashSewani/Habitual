using Domain.Common.Enums;

namespace Domain.Entities.Habits
{
    /// <summary>
    /// HabitSchedule represents the scheduling information for a specific habit, including the type of schedule, interval, and days of the week on which the habit should be performed. This class is used to define how often and when a habit should be tracked or performed by the user. It establishes a relationship with the Habit entity, allowing us to associate each schedule with a specific habit in the system.
    /// </summary>
    public class HabitSchedule
    {
        /// <summary>
        /// Identifier for the habit schedule, typically a GUID to ensure global uniqueness across distributed systems. This serves as the primary key for the habit schedule entity and is used to uniquely identify each schedule in the database and throughout the application.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Foreign key referencing the habit associated with this schedule. This establishes a relationship between the HabitSchedule entity and the Habit entity, allowing us to associate each schedule with a specific habit.
        /// </summary>
        public Guid HabitId { get; set; }

        /// <summary>
        /// Type of the schedule, which indicates the frequency or pattern of the habit. This property is used to define how often the habit should be performed.
        /// </summary>
        public ScheduleType Type { get; set; }

        /// <summary>
        /// Interval of the schedule, which specifies the number of units (e.g., days, weeks) between each occurrence of the habit. This property is used in conjunction with the Type property to define the schedule's frequency.
        /// </summary>
        public int? Interval { get; set; }

        /// <summary>
        /// Days of the week on which the habit should be performed. This property is used when the schedule type is weekly to specify the specific days of the week for the habit.
        /// </summary>
        public List<WeekDay> DaysOfWeek { get; set; }

        /// <summary>
        /// Navigation property for the habit associated with this schedule. This allows us to access the details of the habit when needed.
        /// </summary>
        public Habit Habit { get; set; }
    }
}
