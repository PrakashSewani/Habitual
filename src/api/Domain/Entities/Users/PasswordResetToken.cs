namespace Domain.Entities.Users
{
    /// <summary>
    /// Represents a password reset token issued to a user for recovering their account.
    /// </summary>
    public class PasswordResetToken
    {
        /// <summary>
        /// Unique identifier for the password reset token.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Identifier of the user who requested the password reset.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// The token value used to verify the password reset request.
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// The date and time when the token expires.
        /// </summary>
        public DateTime ExpiresAt { get; set; }

        /// <summary>
        /// The date and time when the token was used, if applicable.
        /// </summary>
        public DateTime? UsedAt { get; set; }
    }
}
