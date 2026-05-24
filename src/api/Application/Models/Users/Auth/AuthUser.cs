using Domain.Common.Enums;

namespace Application.Models.Users.Auth
{
    /// <summary>
    /// Represents a data transfer object containing authentication-related user information.
    /// </summary>
    /// <remarks>This class is typically used to transfer user identity details between authentication
    /// services and application components. It does not include sensitive credential data.</remarks>
    public class AuthUser
    {
        public string Email { get; set; }
        public string password { get; set; }
        public Source Source { get; set; }
    }
}
