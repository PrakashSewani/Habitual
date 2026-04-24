namespace Application.Abstractions.Authentication
{
    public interface IRefreshTokenStore
    {
        Task StoreAsync(string token, Guid userId, TimeSpan expiry);
        Task<Guid> GetUserIdAsync(string token);
        Task DeleteAsync(string token);
    }
}
