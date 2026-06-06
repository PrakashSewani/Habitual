using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Domain.Entities.Users;
using Xunit;

namespace WebApi.Tests
{
    public class AuthTests : IntegrationTestBase
    {
        [Fact]
        public async Task Login_ReturnsToken()
        {
            var loginRequest = new
            {
                Email = TestUserEmail,
                password = TestUserPassword,
                Source = 1
            };

            var response = await Client.PostAsJsonAsync("api/v1/user/login", loginRequest);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Contains("token", content);
            Assert.Contains("refreshToken", content);
        }

        [Fact]
        public async Task Register_CreatesUser()
        {
            var request = new
            {
                Name = "New User",
                Email = "newuser@example.com",
                Password = "NewPassword123!",
                PhoneNumber = "9876543210",
                DateOfBirth = new DateOnly(1995, 5, 5)
            };

            var response = await Client.PostAsJsonAsync("api/v1/user/create", request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var user = DbContext.Users.FirstOrDefault(u => u.Email == "newuser@example.com");
            Assert.NotNull(user);
            Assert.Equal("New User", user.Name);
        }

    }
}
