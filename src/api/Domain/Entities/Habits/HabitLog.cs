namespace Domain.Entities.Habits
{
    /// <summary>
    /// Represents a log entry for a specific habit, recording when a habit was performed or tracked.
    /// </summary>
    /// <remarks>Each HabitLog instance associates a date with a particular habit, enabling tracking of habit
    /// completion or progress over time. This class is typically used in applications that monitor user habits or
    /// routines, supporting features such as habit streaks, analytics, or reporting. The Habit property provides access
    /// to the related habit details when needed.</remarks>
    public class HabitLog
    {
        /// <summary>
        /// Identifier for the habit log entry, typically a GUID to ensure global uniqueness across distributed systems. This serves as the primary key for the habit log entity and is used to uniquely identify each log entry in the database and throughout the application.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Foreign key referencing the habit associated with this log entry. This establishes a relationship between the HabitLog entity and the Habit entity, allowing us to associate each log entry with a specific habit.
        /// </summary>
        public Guid HabitId { get; set; }

        /// <summary>
        /// Date of the habit log entry, which indicates when the log entry was created or recorded.
        /// </summary>
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        /// <summary>
        /// Navigation property for the habit associated with this log entry. This allows us to access the details of the habit when needed.
        /// </summary>
        public Habit Habit { get; set; }
    }
}
