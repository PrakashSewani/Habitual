using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Abstractions.Authentication;
using Microsoft.IdentityModel.Tokens;
namespace Infrastructure.Authentication
{
    public class TokenService(string secret) : ITokenService
    {
        private readonly string _secret = secret;

        string ITokenService.GenerateAccessToken(Guid userId, string email)
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

        string ITokenService.GenerateRefreshToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
