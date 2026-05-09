namespace Application.Models.Users.Auth
{
    /// <summary>
    /// Represents the response returned after a successful authentication request, including access tokens and user
    /// information.
    /// </summary>
    /// <remarks>This class is typically used to encapsulate authentication results, such as when issuing JWT
    /// tokens and related user data after login. The tokens provided can be used for subsequent authorization and token
    /// refresh operations.</remarks>
    public class AuthResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public AuthUserDTO UserInfo { get; set; }
    }
}