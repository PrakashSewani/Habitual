using Domain.Entities.Users;

namespace Domain.Entities.Habits
{
    /// <summary>
    /// Represents a habit tracked by a user, including its identifying information, descriptive details, status,
    /// schedule, and associated logs.
    /// </summary>
    /// <remarks>The Habit class models a user's habit within the system, supporting features such as activity
    /// tracking, scheduling, and association with user accounts. It is typically used in applications that monitor or
    /// encourage habit formation and maintenance. The class includes navigation properties for integration with
    /// object-relational mapping (ORM) frameworks, enabling efficient data access and relationship
    /// management.</remarks>
    public class Habit
    {
        /// <summary>
        /// Identifier for the habit, typically a GUID to ensure global uniqueness across distributed systems. This serves as the primary key for the habit entity and is used to uniquely identify each habit in the database and throughout the application.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// UserId is a foreign key that references the unique identifier of the user who owns or created the habit. This establishes a relationship between the Habit entity and the User entity, allowing us to associate each habit with a specific user in the system. The User property is a navigation property that provides access to the related User entity, enabling us to easily retrieve information about the user who owns the habit when needed.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// User is a navigation property that represents the relationship between the Habit entity and the User entity. It allows us to access the details of the user who owns or created the habit. This property is typically used in object-relational mapping (ORM) frameworks to facilitate data retrieval and manipulation, enabling us to easily navigate from a habit to its associated user and vice versa.
        /// </summary>
        public User User { get; set; }

        /// <summary>
        /// Name of the habit, which serves as a descriptive identifier for the habit. This property is used to provide a human-readable name for the habit, making it easier for users to identify and differentiate between their various habits when viewing or managing them in the application.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Description of the habit, which provides additional details about the habit's purpose, goals, or any other relevant information. This property helps users understand the context and significance of the habit.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Indicates whether the habit is currently active. This property can be used to enable or disable habits without deleting them, allowing users to temporarily pause tracking or focus on other habits.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Creation timestamp of the habit, which indicates when the habit was created in the system.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Last modified timestamp of the habit, which indicates the last time any changes were made to the habit's information.
        /// </summary>
        public DateTime LastModified { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Logs associated with the habit, which represent the history of actions or events related to the habit. This property allows us to track the progress and changes of the habit over time.
        /// </summary>
        public List<HabitLog> HabitLogs { get; set; } = [];

        /// <summary>
        /// Schedule associated with the habit, which defines the recurrence pattern or timing for the habit. This property allows us to manage and track the habit's schedule.
        /// </summary>
        public HabitSchedule Schedule { get; set; }
    }
}
