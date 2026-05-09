namespace Domain.Entities.Habits
{
    /// <summary>
    /// Represents an archived entry of a habit log, including the associated habit, the date of the archive, and unique
    /// identifiers.
    /// </summary>
    /// <remarks>Use this class to store or retrieve historical records of habit logs that have been archived.
    /// Each instance links to a specific habit and records the date the archive entry was created. This type is
    /// typically used in scenarios where tracking or analyzing past habit activity is required.</remarks>
    public class HabitLogArchive
    {
        /// <summary>
        /// Identifier for the habit log archive entry, typically a GUID to ensure global uniqueness across distributed systems. This serves as the primary key for the habit log archive entity and is used to uniquely identify each archive entry in the database and throughout the application.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Foreign key referencing the habit associated with this archive entry. This establishes a relationship between the HabitLogArchive entity and the Habit entity, allowing us to associate each archive entry with a specific habit.
        /// </summary>
        public Guid HabitId { get; set; }

        /// <summary>
        /// Date of the habit log archive entry, which indicates when the archive entry was created or recorded.
        /// </summary>
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        /// <summary>
        /// Navigation property for the habit associated with this archive entry. This allows us to access the details of the habit when needed.
        /// </summary>
        public Habit Habit { get; set; }
    }
}