using Domain.Entities.Habits;

namespace Application.Repositories.Habits
{
    /// <summary>
    /// Interface for managing habits, which represent the recurring actions or behaviors that users want to track and improve over time. This repository provides methods to create, retrieve, update, and delete habits for users, allowing them to maintain a structured approach to habit formation and tracking.
    /// </summary>
    public interface IHabitRepository
    {
        /// <summary>
        /// Asynchronously adds a new habit to the repository. This method takes a Habit object as input, which contains details about the habit such as its name, description, and associated user. The method returns the created Habit object, which includes any generated identifiers or timestamps. This allows users to start tracking their habits and making progress towards their goals.
        /// </summary>
        /// <param name="habit">The Habit object to be added to the repository.</param>
        /// <returns>The created Habit object with any generated identifiers or timestamps.</returns>
        Task<Habit> AddHabitAsync(Habit habit);

        /// <summary>
        /// Asynchronously retrieves all habits for a specific user. This method takes the user's unique identifier as input and returns a list of Habit objects associated with that user. This allows users to view and manage their existing habits.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A list of Habit objects associated with the specified user.</returns>
        Task<List<Habit>> GetHabitsByUserIdAsync(Guid userId);

        /// <summary>
        /// Asynchronously retrieves a specific habit for a user by its unique identifier. This method takes the habit's unique identifier and the user's unique identifier as input and returns the corresponding Habit object if found. This allows users to view and manage a specific habit.
        /// </summary>
        /// <param name="habitId">The unique identifier of the habit.</param>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>The Habit object associated with the specified identifiers, or null if not found.</returns>
        Task<Habit> GetHabitByIdAsync(Guid habitId, Guid userId);

        /// <summary>
        /// Asynchronously updates an existing habit in the repository. This method takes a Habit object as input, which contains the updated details of the habit. The method returns the updated Habit object, allowing users to see the changes made to their habit.
        /// </summary>
        /// <param name="habit">The Habit object with updated details.</param>
        /// <returns>The updated Habit object.</returns>
        Task<Habit> UpdateHabitAsync(Habit habit);

        /// <summary>
        /// Asynchronously deletes a specific habit for a user by its unique identifier. This method takes the habit's unique identifier and the user's unique identifier as input and returns a boolean indicating whether the deletion was successful. This allows users to remove habits they no longer wish to track.
        /// </summary>
        /// <param name="habitId">The unique identifier of the habit.</param>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A boolean indicating whether the habit was successfully deleted.</returns>
        Task<bool> DeleteHabitAsync(Guid habitId, Guid userId);
    }
}
