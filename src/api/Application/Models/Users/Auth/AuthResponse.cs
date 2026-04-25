namespace Application.Models.Users.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public AuthUserDTO UserInfo { get; set; }
    }
}