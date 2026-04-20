using Application.Interfaces;

namespace Infrastructure.Security
{
    public class PasswordHasher : IPasswordHasher
    {
        string IPasswordHasher.HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        bool IPasswordHasher.VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
