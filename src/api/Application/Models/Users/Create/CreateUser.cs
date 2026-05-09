namespace Application.Models.Users.Create
{
    /// <summary>
    /// Represents the data required to create a new user account.
    /// </summary>
    /// <remarks>Use this class to encapsulate user information when registering a new user. All properties
    /// should be populated with valid values before submitting to user creation services.</remarks>
    public class CreateUser
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }
}
