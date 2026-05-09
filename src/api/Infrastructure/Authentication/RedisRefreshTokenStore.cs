using Application.Abstractions.Authentication;
using StackExchange.Redis;

namespace Infrastructure.Authentication
{
    /// <summary>
    /// RedisRefreshTokenStore is an implementation of the IRefreshTokenStore interface that uses Redis as the underlying storage mechanism for managing refresh tokens. It provides methods to store, retrieve, and delete refresh tokens in Redis, allowing for efficient and scalable management of user sessions and authentication tokens. The class interacts with the Redis database through the IConnectionMultiplexer interface, enabling it to perform necessary operations to manage refresh tokens effectively.
    /// </summary>
    /// <param name="redis">The Redis connection multiplexer used to interact with the Redis database.</param>
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
