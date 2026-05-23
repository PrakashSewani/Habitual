using Application.Repositories.Habits;
using Domain.Entities.Habits;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Habits
{
    /// <summary>
    /// HabitRepository is responsible for managing habit data in the database. It implements the IHabitRepository interface, providing methods to add, delete, retrieve, and update habits for users. This repository interacts with the AppDbContext to perform CRUD operations on the Habit entity, ensuring that all habit-related data is properly stored and retrieved from the database. The repository also includes necessary checks to ensure that users can only access and modify their own habits, maintaining data integrity and security.
    /// </summary>
    /// <param name="context">The database context used to interact with the underlying database.</param>
    public class HabitRepository(AppDbContext context) : IHabitRepository
    {
        private readonly AppDbContext _context = context;

        /// <summary>
        /// Adds a new habit to the database. This method takes a Habit object as input, adds it to the Habits DbSet, and saves the changes to the database. It returns the added Habit object, which includes any generated values such as the Id. This method is asynchronous and ensures that the habit is properly stored in the database for future retrieval and management.
        /// </summary>
        /// <param name="habit">The habit object to be added to the database.</param>
        /// <returns>The added habit object with any generated values such as the Id.</returns>
        public async Task<Habit> AddHabitAsync(Habit habit)
        {
            var doesHabitWithSameNameExists = await GetHabitByNameAsync(habit);

            if (doesHabitWithSameNameExists)
            {
                throw new InvalidOperationException("Habit with the same name already exists for the user");
            }

            await _context.Habits.AddAsync(habit);
            await _context.SaveChangesAsync();

            return habit;
        }

        /// <summary>
        /// Deletes a habit from the database. This method takes the habit's unique identifier and the user's unique identifier as input, retrieves the habit from the database, and removes it. It ensures that the habit belongs to the specified user before deletion. The method returns a boolean indicating whether the deletion was successful.
        /// </summary>
        /// <param name="habitId">The unique identifier of the habit to be deleted.</param>
        /// <param name="userId">The unique identifier of the user who owns the habit.</param>
        /// <returns>A boolean indicating whether the habit was successfully deleted.</returns>
        public async Task<bool> DeleteHabitAsync(Guid habitId, Guid userId)
        {
            var habit = await GetHabitByIdAsync(habitId, userId);

            _context.Habits.Remove(habit);
            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Gets a habit by its unique identifier. This method takes the habit's unique identifier and the user's unique identifier as input, retrieves the habit from the database, and returns it. It ensures that the habit belongs to the specified user before returning it. If the habit is not found or does not belong to the user, appropriate exceptions are thrown.
        /// </summary>
        /// <param name="habitId">The unique identifier of the habit to be retrieved.</param>
        /// <param name="userId">The unique identifier of the user who owns the habit.</param>
        /// <returns>The habit object if found and belongs to the user.</returns>
        /// <exception cref="KeyNotFoundException">Thrown when the habit is not found.</exception>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public async Task<Habit> GetHabitByIdAsync(Guid habitId, Guid userId)
        {
            var habit = await _context.Habits
                .Include(h => h.Schedule)
                .FirstOrDefaultAsync(h => h.Id == habitId) ?? throw new KeyNotFoundException("Habit not found");

            if (habit.UserId != userId)
            {
                throw new UnauthorizedAccessException("Requested habit is not tied to current User");
            }

            return habit;
        }

        /// <summary>
        /// Gets a habit by its name. This method takes a habit object as input, retrieves the habit from the database based on its name, and returns it. It ensures that the habit belongs to the specified user before returning it. If the habit is not found or does not belong to the user, appropriate exceptions are thrown. Note that this method is currently not implemented and will throw a NotImplementedException when called.
        /// </summary>
        /// <param name="habit">The Habit object containing the name and user identifier.</param>
        /// <returns>A boolean indicating whether a habit with the same name already exists for the user.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public async Task<bool> GetHabitByNameAsync(Habit habit)
        {
            var existingHabit = await _context.Habits
                .AsNoTracking()
                .FirstOrDefaultAsync(h => h.Name == habit.Name && h.UserId == habit.UserId);

            if (existingHabit != null)
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Gets all habits for a specific user. This method takes the user's unique identifier as input, retrieves all habits associated with the user from the database, and returns them as a list. The method includes related schedule and habit log information for each habit. Habit logs are filtered in-memory by the optional date range.
        /// </summary>
        /// <param name="userId">The unique identifier of the user whose habits are to be retrieved.</param>
        /// <param name="from">Optional start date to filter habit logs.</param>
        /// <param name="to">Optional end date to filter habit logs.</param>
        /// <returns>A list of habits belonging to the specified user.</returns>
        public async Task<List<Habit>> GetHabitsByUserIdAsync(Guid userId, DateOnly? from = null, DateOnly? to = null)
        {
            var habits = await _context.Habits
                .AsNoTracking()
                .Where(h => h.UserId == userId)
                .Include(h => h.Schedule)
                .Include(h => h.HabitLogs)
                .ToListAsync();

            foreach (var habit in habits)
            {
                habit.HabitLogs = habit.HabitLogs
                    .Where(log =>
                        (!from.HasValue || log.Date >= from.Value) &&
                        (!to.HasValue || log.Date <= to.Value))
                    .ToList();
            }

            return habits;
        }

        /// <summary>
        /// Updates an existing habit in the database. This method takes a habit object as input, retrieves the corresponding habit from the database, and updates its properties. It ensures that the habit belongs to the specified user before performing the update. The method returns the updated habit object.
        /// </summary>
        /// <param name="habit">The habit object containing updated information.</param>
        /// <returns>The updated habit object.</returns>
        /// <exception cref="UnauthorizedAccessException">Thrown when the habit does not belong to the specified user.</exception>
        public async Task<Habit> UpdateHabitAsync(Habit habit)
        {
            var habitToUpdate = await GetHabitByIdAsync(habit.Id, habit.UserId);

            if (habitToUpdate.UserId != habit.UserId)
            {
                throw new UnauthorizedAccessException("Requested habit is not tied to current User");
            }

            var doesHabitWithSameNameExists = await GetHabitByNameAsync(habit);

            if (doesHabitWithSameNameExists)
            {
                throw new InvalidOperationException("Habit with the same name already exists for the user");
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
