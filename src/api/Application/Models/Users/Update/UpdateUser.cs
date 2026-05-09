namespace Application.Models.Users.Update
{
    /// <summary>
    /// UpdateUser represents the data that can be updated for an existing user account. All properties are optional, allowing for partial updates.
    /// </summary>
    /// <remarks>Use this class to encapsulate user information when updating an existing user. Only the properties that need to be changed should be populated.</remarks>
    public class UpdateUser
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public DateOnly? DateOfBirth { get; set; }
    }
}
