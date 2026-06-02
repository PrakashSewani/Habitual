namespace Application.Models.Users.PasswordUpdate
{
    /// <summary>
    /// UpdatePassword represents the payload for changing a user's password.
    /// </summary>
    public class UpdatePassword
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
