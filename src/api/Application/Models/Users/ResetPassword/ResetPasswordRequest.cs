namespace Application.Models.Users.ResetPassword
{
    /// <summary>
    /// Represents a request to reset a user's password using a token.
    /// </summary>
    public class ResetPasswordRequest
    {
        /// <summary>
        /// The email address associated with the user account.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// The reset token received by the user.
        /// </summary>
        public string Token { get; set; }

        /// <summary>
        /// The new password to set for the user account.
        /// </summary>
        public string NewPassword { get; set; }
    }
}
