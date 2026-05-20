namespace Application.Models.Users.Get
{
    /// <summary>
    /// Represents a data transfer object containing authentication-related user information.
    /// </summary>
    /// <remarks>This class is typically used to transfer user identity details between authentication
    /// services and application components. It does not include sensitive credential data.</remarks>
    public class GetUserResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
