using Application.Interfaces;

namespace Infrastructure.Security
{
    /// <summary>
    /// PasswordHasher is a service that provides functionality for hashing and verifying passwords. It implements the IPasswordHasher interface, which defines methods for hashing a password and verifying a password against a hashed password. The implementation uses the BCrypt algorithm to securely hash passwords and verify them, ensuring that user credentials are stored and managed securely in the application.
    /// </summary>
    public class PasswordHasher : IPasswordHasher
    {
        /// <summary>
        /// Hashes a password using the BCrypt algorithm. This method takes a plain text password as input and returns a securely hashed version of the password. The BCrypt algorithm is designed to be computationally expensive, making it resistant to brute-force attacks and ensuring that even if the hashed passwords are compromised, they are difficult to reverse-engineer back to the original plain text passwords.
        /// </summary>
        /// <param name="password">The plain text password to be hashed.</param>
        /// <returns>The hashed password.</returns>
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        /// <summary>
        /// Verifies a password against a hashed password using the BCrypt algorithm. This method takes a plain text password and a hashed password as input and returns a boolean indicating whether the plain text password matches the hashed password. The BCrypt algorithm ensures that the verification process is secure and resistant to common attacks, providing a reliable way to authenticate users based on their hashed passwords.
        /// </summary>
        /// <param name="password">The plain text password to be verified.</param>
        /// <param name="hashedPassword">The hashed password to verify against.</param>
        /// <returns>True if the password matches the hashed password; otherwise, false.</returns>
        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
