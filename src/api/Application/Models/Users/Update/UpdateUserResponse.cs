namespace Application.Models.Users.Update
{
    /// <summary>
    /// UpdateUserResponse represents the data returned after successfully updating an existing user account, including the user's identity and timestamps.
    /// </summary>
    /// <remarks>This class is typically used to encapsulate the result of a user update operation, providing essential information
    /// about the updated user without exposing sensitive data such as passwords.</remarks>
    public class UpdateUserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastModified { get; set; }
    }
}
