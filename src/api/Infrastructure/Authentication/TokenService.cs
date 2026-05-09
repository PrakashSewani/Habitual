using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Abstractions.Authentication;
using Microsoft.IdentityModel.Tokens;
namespace Infrastructure.Authentication
{
    /// <summary>
    /// TokenService is responsible for generating access tokens and refresh tokens for user authentication. It uses a secret key to sign the tokens and includes user information (such as user ID and email) in the claims of the access token. The GenerateAccessToken method creates a JWT access token that expires after a specified duration (e.g., 1 hour), while the GenerateRefreshToken method generates a random refresh token that can be used to obtain new access tokens without requiring the user to re-authenticate. This service is essential for implementing secure authentication and authorization mechanisms in the application.
    /// </summary>
    /// <param name="secret">The secret key used to sign the tokens.</param>
    public class TokenService(string secret) : ITokenService
    {
        private readonly string _secret = secret;

        /// <summary>
        /// Generates a JWT access token containing the user's ID and email as claims. The token is signed using the HMAC SHA256 algorithm and has an expiration time of 1 hour. This token can be used for authenticating API requests and authorizing access to protected resources within the application.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="email">The email address of the user.</param>
        /// <returns>A JWT access token as a string.</returns>
        public string GenerateAccessToken(Guid userId, string email)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
            };

            var token = new JwtSecurityToken(
               claims: claims,
               expires: DateTime.UtcNow.AddHours(1),
               signingCredentials: creds
               );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Generates a random refresh token that can be used to obtain new access tokens without requiring the user to re-authenticate.
        /// </summary>
        /// <returns>A refresh token as a string.</returns>
        public string GenerateRefreshToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
