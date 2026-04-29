using Application.Repositories.Habits;
using Domain;

namespace Infrastructure.Repositories.Habits
{
    public class HabitRepository : IHabitRepository
    {
        Task<Habit> IHabitRepository.AddHabitAsync(Habit habit)
        {
            throw new NotImplementedException();
        }

        Task<bool> IHabitRepository.DeleteHabitAsync(Guid habitId, Guid userId)
        {
            throw new NotImplementedException();
        }

        Task<Habit> IHabitRepository.GetHabitByIdAsync(Guid habitId, Guid userId)
        {
            throw new NotImplementedException();
        }

        Task<List<Habit>> IHabitRepository.GetHabitsByUserIdAsync(Guid userId)
        {
            throw new NotImplementedException();
        }

        Task<Habit> IHabitRepository.UpdateHabitAsync(Habit habit)
        {
            throw new NotImplementedException();
        }
    }
}
