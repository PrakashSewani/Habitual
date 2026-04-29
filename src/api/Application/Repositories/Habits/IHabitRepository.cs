using Domain.Entities.Habits;

namespace Application.Repositories.Habits
{
    public interface IHabitRepository
    {
        Task<Habit> AddHabitAsync(Habit habit);

        Task<List<Habit>> GetHabitsByUserIdAsync(Guid userId);

        Task<Habit> GetHabitByIdAsync(Guid habitId, Guid userId);

        Task<Habit> UpdateHabitAsync(Habit habit);

        Task<bool> DeleteHabitAsync(Guid habitId, Guid userId);
    }
}
