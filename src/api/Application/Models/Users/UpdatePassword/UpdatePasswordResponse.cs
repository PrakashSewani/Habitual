namespace Application.Models.Users.PasswordUpdate
{
    /// <summary>
    /// UpdatePasswordResponse represents the data returned after successfully updating a user's password.
    /// </summary>
    public class UpdatePasswordResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastModified { get; set; }
    }
}
