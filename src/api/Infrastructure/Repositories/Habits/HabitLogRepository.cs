using Application.Repositories.Habits;
using Domain.Entities.Habits;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Habits
{
    public class HabitLogRepository(AppDbContext context) : IHabitLogRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<bool> ToggleHabitLogAsync(Guid habitId, Guid userId, DateOnly date)
        {
            var habitExists = await _context.Habits
                .AsNoTracking()
                .AnyAsync(h =>
                    h.Id == habitId &&
                    h.UserId == userId);

            if (!habitExists)
            {
                throw new UnauthorizedAccessException("Requested habit is not tied to current user");
            }

            var existingLog = await _context.HabitLogs
                .FirstOrDefaultAsync(h =>
                    h.HabitId == habitId &&
                    h.Date == date);

            if (existingLog != null)
            {
                _context.HabitLogs.Remove(existingLog);

                await _context.SaveChangesAsync();

                return false;
            }

            var habitLog = new HabitLog
            {
                Id = Guid.NewGuid(),
                HabitId = habitId,
                Date = date
            };

            await _context.HabitLogs.AddAsync(habitLog);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
