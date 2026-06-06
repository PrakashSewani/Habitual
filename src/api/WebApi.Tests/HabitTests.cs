using System.Net;
using System.Net.Http.Json;
using Domain.Common.Enums;
using Domain.Entities.Habits;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace WebApi.Tests
{
    public class HabitTests : IntegrationTestBase
    {
        [Fact]
        public async Task CreateHabit_ReturnsCreatedHabit()
        {
            var request = new
            {
                Name = "Test Habit",
                Description = "Test Description",
                IsActive = true,
                Schedule = new
                {
                    Type = 0, // Daily
                    Interval = (int?)null,
                    DaysOfWeek = (List<WeekDay>?)null
                }
            };

            var response = await Client.PostAsJsonAsync("api/v1/habit/create", request);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Contains("Test Habit", content);
        }

        [Fact]
        public async Task GetHabits_ReturnsHabits()
        {
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = TestUserId,
                Name = "Morning Run",
                Description = "Run every morning",
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

            var response = await Client.GetAsync("api/v1/habit/get");
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Contains("Morning Run", content);
        }

        [Fact]
        public async Task ToggleHabitLog_ReturnsSuccess()
        {
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = TestUserId,
                Name = "Read Book",
                Description = "Read 10 pages",
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

            var date = DateOnly.FromDateTime(DateTime.UtcNow);
            var response = await Client.PutAsync($"api/v1/habitlog?habitId={habit.Id}&date={date:yyyy-MM-dd}", null);
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Contains("Habit log updated successfully", content);
        }

        [Fact]
        public async Task DeleteHabit_ReturnsSuccess()
        {
            var habit = new Habit
            {
                Id = Guid.NewGuid(),
                UserId = TestUserId,
                Name = "Drink Water",
                Description = "Drink 2L water",
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

            var response = await Client.DeleteAsync($"api/v1/habit/delete?habitId={habit.Id}");
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Contains("Habit deleted successfully", content);

            var deleted = await DbContext.Habits.AsNoTracking().FirstOrDefaultAsync(h => h.Id == habit.Id);
            Assert.Null(deleted);
        }
    }
}
