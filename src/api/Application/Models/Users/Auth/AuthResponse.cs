namespace Application.Models.Users.Auth
{
    /// <summary>
    /// AuthResponse is a model that represents the response returned after a successful authentication or token refresh operation. It contains two properties: Token, which holds the access token that can be used for authenticated requests, and RefreshToken, which holds the refresh token that can be used to obtain a new access token when the current one expires. This model is typically returned by authentication handlers such as AuthUserRequestHandler and RefreshUserRequestHandler to provide the necessary tokens for client applications to maintain authenticated sessions.
    /// </summary>
    public class AuthResponse
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}