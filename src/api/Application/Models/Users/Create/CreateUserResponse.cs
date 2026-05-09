namespace Application.Models.Users.Create
{
    /// <summary>
    /// Represents the data returned after successfully creating a new user account, including the user's identity and timestamps.
    /// </summary>
    /// <remarks>This class is typically used to encapsulate the result of a user creation operation, providing essential information
    /// about the newly created user without exposing sensitive data such as passwords.</remarks>
    public class CreateUserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastModified { get; set; }
    }
}
