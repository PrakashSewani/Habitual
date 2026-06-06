using System.Net;
using System.Net.Http.Json;
using Domain.Common.Enums;
using Domain.Entities.Habits;
using Xunit;

namespace WebApi.Tests
{
    public class AnalyticsTests : IntegrationTestBase
    {
        [Fact]
        public async Task GetDashboard_ReturnsStats()
        {
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = TestUserId,
                Name = "Exercise",
                Description = "Daily exercise",
                IsActive = true,
                CreatedFrom = Source.Web,
                CreatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow,
                Schedule = new HabitSchedule
                {
                    Id = Guid.NewGuid(),
                    Type = ScheduleType.Daily,
                    HabitId = Guid.NewGuid()
                }
            };
            DbContext.Habits.Add(habit);
            DbContext.HabitLogs.Add(new HabitLog
            {
                Id = Guid.NewGuid(),
                HabitId = habit.Id,
                Date = DateOnly.FromDateTime(DateTime.UtcNow)
            });
            DbContext.SaveChanges();

            var response = await Client.GetAsync("api/v1/analytics/dashboard");
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Contains("totalHabits", content);
        }

        [Fact]
        public async Task ExportHabits_ReturnsCsv()
        {
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = TestUserId,
                Name = "Meditate",
                Description = "Meditate 10 mins",
                IsActive = true,
                CreatedFrom = Source.Web,
                CreatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow,
                Schedule = new HabitSchedule
                {
                    Id = Guid.NewGuid(),
                    Type = ScheduleType.Daily,
                    HabitId = Guid.NewGuid()
                }
            };
            DbContext.Habits.Add(habit);
            DbContext.SaveChanges();

            var response = await Client.GetAsync("api/v1/export/habits?format=csv");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal("text/csv", response.Content.Headers.ContentType?.MediaType);
            var contentDisposition = response.Content.Headers.ContentDisposition;
            Assert.NotNull(contentDisposition);
            Assert.True(
                contentDisposition.FileName == "habits.csv" || contentDisposition.FileNameStar == "habits.csv",
                "Expected Content-Disposition filename to be habits.csv"
            );
        }
    }
}
