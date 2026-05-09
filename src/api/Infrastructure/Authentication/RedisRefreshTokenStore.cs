using Application.Abstractions.Authentication;
using StackExchange.Redis;

namespace Infrastructure.Authentication
{
    public class RedisRefreshTokenStore(IConnectionMultiplexer redis) : IRefreshTokenStore
    {
        private readonly IDatabase _db = redis.GetDatabase();

        async Task IRefreshTokenStore.DeleteAsync(string token)
        {
            var key = $"refresh:{token}";
            await _db.KeyDeleteAsync(key);
        }

        async Task<Guid> IRefreshTokenStore.GetUserIdAsync(string token)
        {
            var key = $"refresh:{token}";
            var value = await _db.StringGetAsync(key);

            if (!value.HasValue)
                throw new Exception("User Refresh Token Expired, try logging in again");

            return Guid.Parse(value.ToString());
        }

        async Task IRefreshTokenStore.StoreAsync(string token, Guid userId, TimeSpan expiry)
        {
            var key = $"refresh:{token}";
            await _db.StringSetAsync(key, userId.ToString(), expiry);
        }
    }
}
