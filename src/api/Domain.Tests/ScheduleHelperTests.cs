using Application.Helpers;
using Domain.Common.Enums;
using Domain.Entities.Habits;
using Xunit;

namespace Domain.Tests
{
    public class ScheduleHelperTests
    {
        [Fact]
        public void IsScheduledForDate_DailySchedule_ReturnsTrue()
        {
            var schedule = new HabitSchedule { Type = ScheduleType.Daily };
            var createdAt = new DateTime(2024, 1, 1);
            var date = new DateOnly(2024, 6, 15);

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.True(result);
        }

        [Fact]
        public void IsScheduledForDate_WeeklySchedule_OnSpecifiedDay_ReturnsTrue()
        {
            var schedule = new HabitSchedule
            {
                Type = ScheduleType.Weekly,
                DaysOfWeek = new List<WeekDay> { WeekDay.Monday, WeekDay.Wednesday, WeekDay.Friday }
            };
            var createdAt = new DateTime(2024, 1, 1);
            var date = new DateOnly(2024, 1, 3); // Wednesday

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.True(result);
        }

        [Fact]
        public void IsScheduledForDate_WeeklySchedule_OnNonSpecifiedDay_ReturnsFalse()
        {
            var schedule = new HabitSchedule
            {
                Type = ScheduleType.Weekly,
                DaysOfWeek = new List<WeekDay> { WeekDay.Monday, WeekDay.Wednesday, WeekDay.Friday }
            };
            var createdAt = new DateTime(2024, 1, 1);
            var date = new DateOnly(2024, 1, 2); // Tuesday

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.False(result);
        }

        [Fact]
        public void IsScheduledForDate_WeeklySchedule_NoDaysSpecified_ReturnsTrue()
        {
            var schedule = new HabitSchedule
            {
                Type = ScheduleType.Weekly,
                DaysOfWeek = new List<WeekDay>()
            };
            var createdAt = new DateTime(2024, 1, 1);
            var date = new DateOnly(2024, 1, 2);

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.True(result);
        }

        [Fact]
        public void IsScheduledForDate_IntervalSchedule_EveryTwoDays_ReturnsTrueOnInterval()
        {
            var schedule = new HabitSchedule
            {
                Type = ScheduleType.Interval,
                Interval = 2
            };
            var createdAt = new DateTime(2024, 1, 1);
            var date = new DateOnly(2024, 1, 3); // 2 days after creation

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.True(result);
        }

        [Fact]
        public void IsScheduledForDate_IntervalSchedule_EveryTwoDays_ReturnsFalseOnOffInterval()
        {
            var schedule = new HabitSchedule
            {
                Type = ScheduleType.Interval,
                Interval = 2
            };
            var createdAt = new DateTime(2024, 1, 1);
            var date = new DateOnly(2024, 1, 2); // 1 day after creation

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.False(result);
        }

        [Fact]
        public void IsScheduledForDate_IntervalSchedule_ZeroInterval_ReturnsTrue()
        {
            var schedule = new HabitSchedule
            {
                Type = ScheduleType.Interval,
                Interval = 0
            };
            var createdAt = new DateTime(2024, 1, 1);
            var date = new DateOnly(2024, 1, 5);

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.True(result);
        }

        [Fact]
        public void IsScheduledForDate_IntervalSchedule_DateBeforeCreatedAt_ReturnsFalse()
        {
            var schedule = new HabitSchedule
            {
                Type = ScheduleType.Interval,
                Interval = 3
            };
            var createdAt = new DateTime(2024, 1, 10);
            var date = new DateOnly(2024, 1, 5); // Before creation

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.False(result);
        }

        [Fact]
        public void IsScheduledForDate_DailySchedule_DateBeforeCreatedAt_ReturnsTrue()
        {
            var schedule = new HabitSchedule { Type = ScheduleType.Daily };
            var createdAt = new DateTime(2024, 1, 15);
            var date = new DateOnly(2024, 1, 10); // Before creation

            var result = ScheduleHelper.IsScheduledForDate(schedule, createdAt, date);

            Assert.True(result);
        }
    }
}
