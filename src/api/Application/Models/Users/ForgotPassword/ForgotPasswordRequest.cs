namespace Application.Models.Users.ForgotPassword
{
    /// <summary>
    /// Represents a request to initiate a password reset for a user account.
    /// </summary>
    public class ForgotPasswordRequest
    {
        /// <summary>
        /// The email address associated with the user account.
        /// </summary>
        public string Email { get; set; }
    }
}
