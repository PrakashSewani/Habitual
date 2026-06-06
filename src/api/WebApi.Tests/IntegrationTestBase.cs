using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Abstractions.Authentication;
using Application.Interfaces;
using Domain.Common.Enums;
using Domain.Entities.Users;
using Infrastructure.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;
using StackExchange.Redis;

namespace WebApi.Tests
{
    public abstract class IntegrationTestBase : IDisposable
    {
        protected readonly CustomWebApplicationFactory Factory;
        protected readonly HttpClient Client;
        protected readonly AppDbContext DbContext;
        protected readonly ITokenService TokenService;
        protected readonly IPasswordHasher PasswordHasher;
        protected readonly IServiceScope Scope;
        protected Guid TestUserId;
        protected const string TestUserEmail = "test@example.com";
        protected const string TestUserPassword = "TestPassword123!";
        protected string TestToken;

        protected static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        protected IntegrationTestBase()
        {
            Factory = new CustomWebApplicationFactory();
            Client = Factory.CreateClient();

            Scope = Factory.Services.CreateScope();
            DbContext = Scope.ServiceProvider.GetRequiredService<AppDbContext>();
            TokenService = Scope.ServiceProvider.GetRequiredService<ITokenService>();
            PasswordHasher = Scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

            DbContext.Database.EnsureCreated();
            SeedTestUser();
            TestToken = TokenService.GenerateAccessToken(TestUserId, TestUserEmail, Source.Web);
            Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TestToken);
        }

        private void SeedTestUser()
        {
            TestUserId = Guid.NewGuid();
            var user = new User
            {
                Id = TestUserId,
                Name = "Test User",
                Email = TestUserEmail.ToLower(),
                PasswordHash = PasswordHasher.HashPassword(TestUserPassword),
                PhoneNumber = "1234567890",
                DateOfBirth = new DateOnly(1990, 1, 1),
                CreatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow
            };
            DbContext.Users.Add(user);
            DbContext.SaveChanges();
        }

        public void Dispose()
        {
            Scope.Dispose();
            Client.Dispose();
            Factory.Dispose();
        }
    }

    public class CustomWebApplicationFactory : WebApplicationFactory<WebApi.Controllers.HabitController>
    {
        private readonly SqliteConnection _connection;

        public CustomWebApplicationFactory()
        {
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Jwt:Secret"] = "test-secret-key-that-is-at-least-32-characters-long!",
                    ["Redis:Connection"] = "localhost:6379"
                });
            });

            builder.ConfigureServices(services =>
            {
                var dbContextDescriptors = services.Where(d =>
                    d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                    d.ServiceType == typeof(AppDbContext)).ToList();
                foreach (var descriptor in dbContextDescriptors) services.Remove(descriptor);

                var redisDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IConnectionMultiplexer));
                if (redisDescriptor != null) services.Remove(redisDescriptor);

                var hostedServiceDescriptors = services.Where(d => d.ServiceType == typeof(Microsoft.Extensions.Hosting.IHostedService)
                    && d.ImplementationType?.Name == "ArchivalBackgroundService").ToList();
                foreach (var descriptor in hostedServiceDescriptors) services.Remove(descriptor);

                services.AddSingleton(_connection);
                services.AddScoped<AppDbContext>(sp =>
                {
                    var options = new DbContextOptionsBuilder<AppDbContext>()
                        .UseSqlite(_connection)
                        .Options;
                    return new FakeAppDbContext(options);
                });

                services.AddSingleton<IConnectionMultiplexer>(FakeRedis.Create());
            });
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _connection.Dispose();
            }
            base.Dispose(disposing);
        }
    }

    public class FakeAppDbContext : AppDbContext
    {
        private DatabaseFacade? _database;

        public FakeAppDbContext(DbContextOptions options) : base(options)
        {
        }

        public override DatabaseFacade Database => _database ??= new FakeDatabaseFacade(this);
    }

    public class FakeDatabaseFacade : DatabaseFacade, IInfrastructure<IServiceProvider>
    {
        private readonly IServiceProvider _fakeProvider;

        public FakeDatabaseFacade(DbContext context) : base(context)
        {
            var realProvider = ((IInfrastructure<IServiceProvider>)this).Instance;
            _fakeProvider = new FakeServiceProvider(realProvider);
        }

        IServiceProvider IInfrastructure<IServiceProvider>.Instance => _fakeProvider;
    }

    public class FakeServiceProvider : IServiceProvider
    {
        private readonly IServiceProvider _realProvider;
        private readonly FakeMigrator _fakeMigrator = new();

        public FakeServiceProvider(IServiceProvider realProvider)
        {
            _realProvider = realProvider;
        }

        public object? GetService(Type serviceType)
        {
            if (serviceType == typeof(IMigrator))
                return _fakeMigrator;
            return _realProvider.GetService(serviceType);
        }
    }

    public class FakeMigrator : IMigrator
    {
        public void Migrate(string? targetMigration = null) { }
        public Task MigrateAsync(string? targetMigration = null, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public string GenerateScript(string? fromMigration = null, string? toMigration = null, MigrationsSqlGenerationOptions options = MigrationsSqlGenerationOptions.Default) => string.Empty;
        public bool HasPendingModelChanges() => false;
    }

    public static class FakeRedis
    {
        public static IConnectionMultiplexer Create()
        {
            var store = new Dictionary<string, (string Value, DateTime? Expiry)>();
            var db = Substitute.For<IDatabase, IDatabaseAsync>();

            ((IDatabaseAsync)db).StringSetAsync(Arg.Any<RedisKey>(), Arg.Any<RedisValue>(), Arg.Any<TimeSpan?>(), Arg.Any<When>(), Arg.Any<CommandFlags>())
                .Returns(callInfo =>
                {
                    var key = callInfo.ArgAt<RedisKey>(0).ToString()!;
                    var value = callInfo.ArgAt<RedisValue>(1).ToString()!;
                    var expiry = callInfo.ArgAt<TimeSpan?>(2);
                    Console.WriteLine($"[FakeRedis] SET key={key} value={value} expiry={expiry}");
                    store[key] = (value, expiry.HasValue ? DateTime.UtcNow.Add(expiry.Value) : null);
                    return Task.FromResult(true);
                });

            db.StringGetAsync(Arg.Any<RedisKey>(), Arg.Any<CommandFlags>())
                .Returns(callInfo =>
                {
                    var key = callInfo.ArgAt<RedisKey>(0).ToString()!;
                    if (store.TryGetValue(key, out var entry))
                    {
                        if (entry.Expiry.HasValue && DateTime.UtcNow > entry.Expiry.Value)
                        {
                            store.Remove(key);
                            return Task.FromResult(RedisValue.Null);
                        }
                        return Task.FromResult((RedisValue)entry.Value);
                    }
                    return Task.FromResult(RedisValue.Null);
                });

            db.KeyDeleteAsync(Arg.Any<RedisKey>(), Arg.Any<CommandFlags>())
                .Returns(callInfo =>
                {
                    var key = callInfo.ArgAt<RedisKey>(0).ToString()!;
                    store.Remove(key);
                    return Task.FromResult(true);
                });

            var testResult = db.StringSetAsync("test", "value", TimeSpan.FromMinutes(1)).Result;
            var testGet = db.StringGetAsync("test").Result;
            Console.WriteLine($"[FakeRedis] Test SET result={testResult} GET result={testGet}");

            var multiplexer = Substitute.For<IConnectionMultiplexer>();
            multiplexer.GetDatabase(Arg.Any<int>(), Arg.Any<object>()).Returns(callInfo =>
            {
                Console.WriteLine($"[FakeRedis] GetDatabase called with db={callInfo.ArgAt<int>(0)}");
                return db;
            });
            return multiplexer;
        }
    }
}
