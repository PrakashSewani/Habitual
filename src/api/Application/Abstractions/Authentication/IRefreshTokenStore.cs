namespace Application.Abstractions.Authentication
{
    public interface IRefreshTokenStore
    {
        /// <summary>
        /// Asynchronously stores a token associated with a user and sets its expiration time.
        /// </summary>
        /// <param name="token">The token to store. Cannot be null or empty.</param>
        /// <param name="userId">The unique identifier of the user to associate with the token.</param>
        /// <param name="expiry">The duration after which the token expires.</param>
        /// <param name="source">Optional source identifier to store alongside the token.</param>
        /// <returns>A task that represents the asynchronous store operation.</returns>
        Task StoreAsync(string token, Guid userId, TimeSpan expiry, string source = null);

        /// <summary>
        /// Asynchronously retrieves the unique identifier of a user associated with the specified authentication token.
        /// </summary>
        /// <param name="token">The authentication token used to identify the user. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the unique identifier of the
        /// user associated with the token.</returns>
        Task<Guid> GetUserIdAsync(string token);

        /// <summary>
        /// Asynchronously retrieves the source identifier associated with the specified authentication token.
        /// </summary>
        /// <param name="token">The authentication token used to identify the source. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the source identifier
        /// associated with the token.</returns>
        Task<string> GetSourceAsync(string token);

        /// <summary>
        /// Asynchronously deletes the resource associated with the specified token.
        /// </summary>
        /// <param name="token">The unique identifier of the resource to delete. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous delete operation.</returns>
        Task DeleteAsync(string token);
    }
}
