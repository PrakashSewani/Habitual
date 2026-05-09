using Domain.Entities.Habits;

namespace Domain.Entities.Users
{
    /// <summary>
    /// Represents a user account with identifying information, contact details, authentication data, and associated
    /// habits.
    /// </summary>
    /// <remarks>The User class encapsulates core user profile data, including unique identifiers,
    /// credentials, and related habits. It is typically used to manage user registration, authentication, and profile
    /// management within the system. Sensitive information such as the password hash should be handled securely and
    /// never exposed in plain text. Timestamps track account creation and modification for auditing and data
    /// consistency purposes.</remarks>
    public class User
    {
        /// <summary>
        /// Unique identifier for the user, typically a GUID to ensure global uniqueness across distributed systems.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Name identifying the user, which can be used for display purposes and may not be unique across the system.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Email address of the user, which should be unique across the system and is used for authentication and communication purposes.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Password hash of the user's password, which is a secure representation of the password used for authentication. 
        /// It should be generated using a strong hashing algorithm and should never be stored or transmitted in plain text for security reasons.
        /// </summary>
        public string PasswordHash { get; set; }

        /// <summary>
        /// Phone number of the user, which can be used for contact purposes and may also be used for multi-factor authentication.
        /// </summary>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Date of birth of the user, which can be used for age verification, personalization, and other purposes.
        /// </summary>
        public DateOnly DateOfBirth { get; set; }

        /// <summary>
        /// Creation timestamp of the user account, which indicates when the user was registered in the system.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Last modified timestamp of the user account, which indicates the last time any changes were made to the user's information.
        /// </summary>
        public DateTime LastModified { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Habits associated with the user, which represents the collection of habits that the user is tracking or has created.
        /// </summary>
        public List<Habit> Habits { get; set; } = [];
    }
}
