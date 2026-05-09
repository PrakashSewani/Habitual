using Application.Repositories.Habits;
using Domain.Entities.Habits;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Habits
{
    /// <summary>
    /// HabitLogRepository is responsible for managing habit logs, which represent the tracking of habit completion for users on specific dates. This repository provides methods to toggle habit logs, allowing users to mark habits as completed or not completed for a given date. It interacts with the AppDbContext to perform database operations related to habit logs and ensures that the requested habit is tied to the current user before allowing any modifications to the logs.
    /// </summary>
    /// <param name="context">The database context used to interact with the underlying database.</param>
    public class HabitLogRepository(AppDbContext context) : IHabitLogRepository
    {
        private readonly AppDbContext _context = context;

        /// <summary>
        /// Toggles the habit log for a specific habit, user, and date. If a log already exists for the given habit and date, it will be removed (indicating that the habit was not completed). If no log exists, a new log will be created (indicating that the habit was completed). The method ensures that the habit being toggled is associated with the current user before performing any operations on the logs.
        /// </summary>
        /// <param name="habitId">The unique identifier of the habit.</param>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="date">The date for which the habit log is being toggled.</param>
        /// <returns>A boolean indicating whether the habit log was created (true) or removed (false).</returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
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
