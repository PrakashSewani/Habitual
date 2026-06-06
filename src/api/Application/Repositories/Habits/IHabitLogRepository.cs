using Domain.Entities.Habits;

namespace Application.Repositories.Habits
{
    /// <summary>
    /// Interface for managing habit logs, which represent the tracking of habit completion for users on specific dates. This repository provides methods to toggle habit logs, allowing users to mark habits as completed or not completed for a given date.
    /// </summary>
    public interface IHabitLogRepository
    {
        /// <summary>
        /// Toggles the habit log for a specific habit, user, and date. If a log entry exists for the given parameters, it will be removed; otherwise, a new log entry will be created.
        /// </summary>
        /// <param name="habitId">The unique identifier of the habit.</param>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="date">The date for which the habit log should be toggled.</param>
        /// <returns>A boolean indicating whether the habit log was successfully toggled.</returns>
        Task<bool> ToggleHabitLogAsync(Guid habitId, Guid userId, DateOnly date);

        /// <summary>
        /// Archives habit logs older than 3 months by moving them from the hot table (HabitLogs) to the cold table (HabitLogArchives).
        /// </summary>
        /// <returns>A task representing the asynchronous operation.</returns>
        Task ArchiveOldLogsAsync();
    }
}
