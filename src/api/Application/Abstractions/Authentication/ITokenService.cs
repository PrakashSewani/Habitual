namespace Application.Abstractions.Authentication
{
    public interface ITokenService
    {
        /// <summary>
        /// Generates a new access token for the specified user and email address.
        /// </summary>
        /// <param name="userId">The unique identifier of the user for whom the access token is generated.</param>
        /// <param name="email">The email address associated with the user. Cannot be null or empty.</param>
        /// <returns>A string containing the generated access token. The token can be used to authenticate subsequent requests on
        /// behalf of the user.</returns>
        string GenerateAccessToken(Guid userId, string email);

        /// <summary>
        /// Generates a new refresh token for use in authentication workflows.
        /// </summary>
        /// <returns>A string containing the newly generated refresh token. The token is typically used to obtain new access
        /// tokens without requiring user credentials.</returns>
        string GenerateRefreshToken();
    }
}
