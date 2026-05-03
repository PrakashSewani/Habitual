using Application.Repositories.Habits;
using Domain.Entities.Habits;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Habits
{
    public class HabitRepository(AppDbContext context) : IHabitRepository
    {
        private readonly AppDbContext _context = context;

        async Task<Habit> IHabitRepository.AddHabitAsync(Habit habit)
        {
            await _context.Habits.AddAsync(habit);
            await _context.SaveChangesAsync();

            return habit;
        }

        async Task<bool> IHabitRepository.DeleteHabitAsync(Guid habitId, Guid userId)
        {
            var habit = await _context.Habits
                .FirstOrDefaultAsync(h => h.Id == habitId) ?? throw new KeyNotFoundException("Habit not found");

            if (habit.UserId != userId)
            {
                throw new UnauthorizedAccessException("Requested habit is not tied to current User");
            }

            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync();

            return true;
        }

        async Task<Habit> IHabitRepository.GetHabitByIdAsync(Guid habitId, Guid userId)
        {
            var habit = await _context.Habits
                .FirstOrDefaultAsync(h => h.Id == habitId) ?? throw new KeyNotFoundException("Habit not found");

            if (habit.UserId != userId)
            {
                throw new UnauthorizedAccessException("Requested habit is not tied to current User");
            }

            return habit;
        }

        async Task<List<Habit>> IHabitRepository.GetHabitsByUserIdAsync(Guid userId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);

            if (!userExists)
            {
                throw new KeyNotFoundException("User not found");
            }

            return await _context.Habits
                .Where(h => h.UserId == userId)
                .Include(h => h.Schedule)
                .Include(h => h.HabitLog)
                .ToListAsync();
        }

        async Task<Habit> IHabitRepository.UpdateHabitAsync(Habit habit)
        {
            var habitToUpdate = await _context.Habits
                .Include(h => h.Schedule)
                .FirstOrDefaultAsync(h => h.Id == habit.Id)
                ?? throw new KeyNotFoundException("Habit not found");

            if (habitToUpdate.UserId != habit.UserId)
            {
                throw new UnauthorizedAccessException("Requested habit is not tied to current User");
            }

            habitToUpdate.Name = habit.Name;
            habitToUpdate.Description = habit.Description;
            habitToUpdate.IsActive = habit.IsActive;
            habitToUpdate.Schedule.Type = habit.Schedule.Type;
            habitToUpdate.Schedule.Interval = habit.Schedule.Interval;
            habitToUpdate.Schedule.DaysOfWeek = habit.Schedule.DaysOfWeek;
            habitToUpdate.LastModified = DateTime.UtcNow;

            _context.Habits.Update(habitToUpdate);
            await _context.SaveChangesAsync();

            return habitToUpdate;
        }
    }
}
