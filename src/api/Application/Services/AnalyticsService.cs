using Application.Helpers;
using Application.Interfaces;
using Application.Models.Analytics;
using Application.Repositories.Habits;
using Domain.Entities.Habits;
using System.Text;

namespace Application.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly IHabitRepository _habitRepository;

        public AnalyticsService(IHabitRepository habitRepository)
        {
            _habitRepository = habitRepository;
        }

        public async Task<DashboardStatsResponse> GetDashboardStatsAsync(Guid userId)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var activeHabits = habits.Where(h => h.IsActive).ToList();
            var allLogs = habits.SelectMany(h => h.HabitLogs).ToList();
            var totalLogs = allLogs.Count;

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var diffToMonday = ((int)today.DayOfWeek + 6) % 7;
            var monday = today.AddDays(-diffToMonday);
            var sunday = monday.AddDays(6);

            var thisWeekLogs = allLogs.Count(l => l.Date >= monday && l.Date <= sunday);

            var bestStreak = habits.Any()
                ? habits.Max(h => ComputeLongestStreak(h.HabitLogs, h.Schedule, h.CreatedAt))
                : 0;

            var uniqueDays = allLogs.Select(l => l.Date).Distinct().Count();
            var avgLogsPerDay = uniqueDays > 0 ? Math.Round((double)totalLogs / uniqueDays, 1) : 0;

            int weekScheduled = 0;
            int weekCompleted = 0;

            foreach (var h in activeHabits)
            {
                var cursor = monday;
                while (cursor <= sunday)
                {
                    if (ScheduleHelper.IsScheduledForDate(h.Schedule, h.CreatedAt, cursor))
                    {
                        weekScheduled++;
                        if (h.HabitLogs.Any(l => l.Date == cursor))
                        {
                            weekCompleted++;
                        }
                    }
                    cursor = cursor.AddDays(1);
                }
            }

            var thisWeekCompletionRate = weekScheduled > 0 ? (int)Math.Round((double)weekCompleted / weekScheduled * 100) : 0;

            return new DashboardStatsResponse
            {
                TotalHabits = habits.Count,
                ActiveHabits = activeHabits.Count,
                TotalLogs = totalLogs,
                ThisWeekLogs = thisWeekLogs,
                BestStreak = bestStreak,
                AvgLogsPerDay = avgLogsPerDay,
                ThisWeekCompletionRate = thisWeekCompletionRate
            };
        }

        public async Task<List<List<HeatmapDayResponse>>> GetHeatmapDataAsync(Guid userId)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var now = DateOnly.FromDateTime(DateTime.UtcNow);
            var result = new List<List<HeatmapDayResponse>>();

            for (int i = 11; i >= 0; i--)
            {
                var monthDate = now.AddMonths(-i);
                result.Add(GetMonthHeatmapData(habits, monthDate.Year, monthDate.Month));
            }

            return result;
        }

        public async Task<List<LeaderboardEntryResponse>> GetLeaderboardAsync(Guid userId, int year, int month, string sortBy)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var activeHabits = habits.Where(h => h.IsActive).ToList();

            var entries = activeHabits.Select(habit =>
            {
                int scheduledDays = 0;
                int completedDays = 0;
                int monthlyLogs = 0;

                for (int d = 1; d <= daysInMonth; d++)
                {
                    var date = new DateOnly(year, month, d);
                    if (ScheduleHelper.IsScheduledForDate(habit.Schedule, habit.CreatedAt, date))
                    {
                        scheduledDays++;
                        if (habit.HabitLogs.Any(l => l.Date == date))
                        {
                            completedDays++;
                            monthlyLogs++;
                        }
                    }
                }

                var completionRate = scheduledDays > 0 ? (int)Math.Round((double)completedDays / scheduledDays * 100) : 0;

                return new LeaderboardEntryResponse
                {
                    HabitId = habit.Id,
                    HabitName = habit.Name,
                    Rank = 0,
                    CompletionRate = completionRate,
                    ScheduledDays = scheduledDays,
                    CompletedDays = completedDays,
                    CurrentStreak = ComputeCurrentStreak(habit.HabitLogs, habit.Schedule, habit.CreatedAt),
                    LongestStreak = ComputeLongestStreak(habit.HabitLogs, habit.Schedule, habit.CreatedAt),
                    TotalLogs = habit.HabitLogs.Count,
                    MonthlyLogs = monthlyLogs
                };
            }).ToList();

            var sorted = sortBy switch
            {
                "currentStreak" => entries.OrderByDescending(e => e.CurrentStreak).ThenByDescending(e => e.CompletionRate).ToList(),
                "totalLogs" => entries.OrderByDescending(e => e.TotalLogs).ToList(),
                "monthlyLogs" => entries.OrderByDescending(e => e.MonthlyLogs).ToList(),
                _ => entries.OrderByDescending(e => e.CompletionRate).ThenByDescending(e => e.MonthlyLogs).ToList()
            };

            for (int i = 0; i < sorted.Count; i++)
                sorted[i].Rank = i + 1;

            return sorted;
        }

        public async Task<List<DayOfWeekStatResponse>> GetDayOfWeekStatsAsync(Guid userId)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var activeHabits = habits.Where(h => h.IsActive).ToList();
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var allDates = new HashSet<DateOnly>();

            foreach (var h in activeHabits)
            {
                var createdDate = DateOnly.FromDateTime(h.CreatedAt);
                var cursor = createdDate;
                while (cursor <= today)
                {
                    if (ScheduleHelper.IsScheduledForDate(h.Schedule, h.CreatedAt, cursor))
                        allDates.Add(cursor);
                    cursor = cursor.AddDays(1);
                }
            }

            var stats = new Dictionary<int, (int scheduled, int completed)>
            {
                {0, (0, 0)}, {1, (0, 0)}, {2, (0, 0)}, {3, (0, 0)}, {4, (0, 0)}, {5, (0, 0)}, {6, (0, 0)}
            };

            foreach (var date in allDates)
            {
                var dayIndex = (int)date.DayOfWeek;
                int dayScheduled = 0;
                int dayCompleted = 0;

                foreach (var h in activeHabits)
                {
                    if (ScheduleHelper.IsScheduledForDate(h.Schedule, h.CreatedAt, date))
                    {
                        dayScheduled++;
                        if (h.HabitLogs.Any(l => l.Date == date))
                            dayCompleted++;
                    }
                }

                var current = stats[dayIndex];
                stats[dayIndex] = (current.scheduled + dayScheduled, current.completed + dayCompleted);
            }

            var dayLabels = new[] { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };

            return Enumerable.Range(0, 7).Select(i =>
            {
                var s = stats[i];
                return new DayOfWeekStatResponse
                {
                    Day = dayLabels[i],
                    Index = i,
                    Scheduled = s.scheduled,
                    Completed = s.completed,
                    Rate = s.scheduled > 0 ? (int)Math.Round((double)s.completed / s.scheduled * 100) : 0
                };
            }).ToList();
        }

        public async Task<List<BadgeResponse>> GetBadgesAsync(Guid userId)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var activeHabits = habits.Where(h => h.IsActive).ToList();
            var allLogs = activeHabits.SelectMany(h => h.HabitLogs).ToList();
            var totalLogs = allLogs.Count;

            var bestStreak = activeHabits.Any()
                ? activeHabits.Max(h => ComputeLongestStreak(h.HabitLogs, h.Schedule, h.CreatedAt))
                : 0;

            var currentStreak = activeHabits.Any()
                ? activeHabits.Max(h => ComputeCurrentStreak(h.HabitLogs, h.Schedule, h.CreatedAt))
                : 0;

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var todayScheduled = activeHabits.Where(h => ScheduleHelper.IsScheduledForDate(h.Schedule, h.CreatedAt, today)).ToList();
            var todayCompleted = todayScheduled.Where(h => h.HabitLogs.Any(l => l.Date == today)).ToList();
            var perfectDay = todayScheduled.Count > 0 && todayCompleted.Count == todayScheduled.Count;

            return new List<BadgeResponse>
            {
                new BadgeResponse { Id = "7-day-streak", Label = "7-Day Streak", Icon = "flame", Earned = currentStreak >= 7, Color = "#F59E0B" },
                new BadgeResponse { Id = "perfect-day", Label = "Perfect Day", Icon = "check", Earned = perfectDay, Color = "#10B981" },
                new BadgeResponse { Id = "habit-master", Label = "Habit Master", Icon = "trophy", Earned = totalLogs >= 30, Color = "#6366F1" },
                new BadgeResponse { Id = "longest-streak", Label = $"{bestStreak}d Best Streak", Icon = "zap", Earned = bestStreak >= 14, Color = "#EF4444" }
            };
        }

        public async Task<DayDetailResponse> GetDayDetailAsync(Guid userId, DateOnly date)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var activeHabits = habits.Where(h => h.IsActive).ToList();
            var colors = new[] { "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6" };

            var completed = new List<DayHabitEntryResponse>();
            var missed = new List<DayHabitEntryResponse>();

            for (int i = 0; i < activeHabits.Count; i++)
            {
                var h = activeHabits[i];
                if (ScheduleHelper.IsScheduledForDate(h.Schedule, h.CreatedAt, date))
                {
                    var entry = new DayHabitEntryResponse
                    {
                        Id = h.Id,
                        Name = h.Name,
                        Color = colors[i % colors.Length]
                    };

                    if (h.HabitLogs.Any(l => l.Date == date))
                        completed.Add(entry);
                    else
                        missed.Add(entry);
                }
            }

            return new DayDetailResponse
            {
                Date = date.ToString("yyyy-MM-dd"),
                CompletedHabits = completed,
                MissedHabits = missed
            };
        }

        public async Task<MonthComparisonResponse> GetMonthComparisonAsync(Guid userId)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var now = DateTime.UtcNow;
            var currentYear = now.Year;
            var currentMonth = now.Month;
            var prevMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var prevYear = currentMonth == 1 ? currentYear - 1 : currentYear;

            var currentMonthSummary = GetMonthSummary(habits, currentYear, currentMonth);
            var previousMonthSummary = GetMonthSummary(habits, prevYear, prevMonth);

            var deltaRate = currentMonthSummary.CompletionRate - previousMonthSummary.CompletionRate;

            return new MonthComparisonResponse
            {
                CurrentMonth = currentMonthSummary,
                PreviousMonth = previousMonthSummary,
                DeltaRate = deltaRate
            };
        }

        public async Task<List<ExportHabitResponse>> ExportHabitsJsonAsync(Guid userId)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            return habits.Select(h => new ExportHabitResponse
            {
                HabitId = h.Id,
                HabitName = h.Name,
                Logs = h.HabitLogs.Select(l => new ExportHabitLogEntryResponse
                {
                    Date = l.Date,
                    Completed = true
                }).ToList()
            }).ToList();
        }

        public async Task<string> ExportHabitsCsvAsync(Guid userId)
        {
            var habits = await _habitRepository.GetHabitsByUserIdAsync(userId);
            var sb = new StringBuilder();
            sb.AppendLine("HabitId,HabitName,Date,Completed");

            foreach (var h in habits)
            {
                foreach (var log in h.HabitLogs.OrderBy(l => l.Date))
                {
                    sb.AppendLine($"{h.Id},{EscapeCsv(h.Name)},{log.Date:yyyy-MM-dd},true");
                }
            }

            return sb.ToString();
        }

        private static List<HeatmapDayResponse> GetMonthHeatmapData(List<Habit> habits, int year, int month)
        {
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var activeHabits = habits.Where(h => h.IsActive).ToList();
            var result = new List<HeatmapDayResponse>();

            for (int d = 1; d <= daysInMonth; d++)
            {
                var date = new DateOnly(year, month, d);
                var isScheduled = activeHabits.Any(h => ScheduleHelper.IsScheduledForDate(h.Schedule, h.CreatedAt, date));
                var completedHabits = activeHabits.Where(h => h.HabitLogs.Any(l => l.Date == date)).ToList();
                var count = completedHabits.Count;

                result.Add(new HeatmapDayResponse
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    DayNum = d,
                    Count = count,
                    IsScheduled = isScheduled,
                    CompletedHabitIds = completedHabits.Select(h => h.Id.ToString()).ToList()
                });
            }

            return result;
        }

        private static MonthSummaryResponse GetMonthSummary(List<Habit> habits, int year, int month)
        {
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var activeHabits = habits.Where(h => h.IsActive).ToList();

            int totalScheduledDays = 0;
            int totalCompletedDays = 0;
            int totalLogs = 0;
            string bestHabitName = "-";
            int bestHabitRate = 0;

            foreach (var habit in activeHabits)
            {
                int scheduled = 0;
                int completed = 0;
                int logs = 0;

                for (int d = 1; d <= daysInMonth; d++)
                {
                    var date = new DateOnly(year, month, d);
                    if (ScheduleHelper.IsScheduledForDate(habit.Schedule, habit.CreatedAt, date))
                    {
                        scheduled++;
                        if (habit.HabitLogs.Any(l => l.Date == date))
                        {
                            completed++;
                            logs++;
                        }
                    }
                }

                totalScheduledDays += scheduled;
                totalCompletedDays += completed;
                totalLogs += logs;

                var rate = scheduled > 0 ? (int)Math.Round((double)completed / scheduled * 100) : 0;
                if (rate > bestHabitRate)
                {
                    bestHabitRate = rate;
                    bestHabitName = habit.Name;
                }
            }

            var completionRate = totalScheduledDays > 0 ? (int)Math.Round((double)totalCompletedDays / totalScheduledDays * 100) : 0;

            return new MonthSummaryResponse
            {
                Year = year,
                Month = month,
                TotalScheduledDays = totalScheduledDays,
                TotalCompletedDays = totalCompletedDays,
                CompletionRate = completionRate,
                TotalLogs = totalLogs,
                ActiveHabitCount = activeHabits.Count,
                BestHabitName = bestHabitName,
                BestHabitRate = bestHabitRate
            };
        }

        public static int ComputeCurrentStreak(List<HabitLog> logs, HabitSchedule schedule, DateTime createdAt, DateOnly? upTo = null)
        {
            var logSet = new HashSet<DateOnly>(logs.Select(l => l.Date));
            var cursor = upTo ?? DateOnly.FromDateTime(DateTime.UtcNow);
            var createdDate = DateOnly.FromDateTime(createdAt);
            int streak = 0;

            while (cursor >= createdDate)
            {
                if (ScheduleHelper.IsScheduledForDate(schedule, createdAt, cursor))
                {
                    if (logSet.Contains(cursor))
                        streak++;
                    else
                        break;
                }
                cursor = cursor.AddDays(-1);
            }

            return streak;
        }

        public static int ComputeLongestStreak(List<HabitLog> logs, HabitSchedule schedule, DateTime createdAt)
        {
            if (logs.Count == 0) return 0;

            var logSet = new HashSet<DateOnly>(logs.Select(l => l.Date));
            var createdDate = DateOnly.FromDateTime(createdAt);
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            int maxStreak = 0;
            int current = 0;
            var cursor = createdDate;

            while (cursor <= today)
            {
                if (ScheduleHelper.IsScheduledForDate(schedule, createdAt, cursor))
                {
                    if (logSet.Contains(cursor))
                    {
                        current++;
                        maxStreak = Math.Max(maxStreak, current);
                    }
                    else
                    {
                        current = 0;
                    }
                }
                cursor = cursor.AddDays(1);
            }

            return maxStreak;
        }

        private static string EscapeCsv(string value)
        {
            if (string.IsNullOrEmpty(value))
                return "\"\"";
            if (value.Contains(',') || value.Contains('"') || value.Contains('\n'))
            {
                return "\"" + value.Replace("\"", "\"\"") + "\"";
            }
            return value;
        }
    }
}
