using Domain.Entities.Habits;

namespace Application.Repositories.Habits
{
    public interface IHabitLogRepository
    {
        Task<bool> ToggleHabitLogAsync(Guid habitId, Guid userId, DateOnly date);
    }
}
