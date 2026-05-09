using Domain.Entities.Users;

namespace Application.Repositories.Users
{
    /// <summary>
    /// Interface for managing users, which represent the individuals who use the habit tracking application. This repository provides methods to create, retrieve, update, and delete user information, allowing for user account management and authentication within the application.
    /// </summary>
    public interface IUserRepository
    {
        /// <summary>
        /// Asynchronously adds a new user to the repository. This method takes a User object as input and returns the created User object, which may include additional information such as a generated unique identifier (Id) and timestamps for creation and last modification. This operation is essential for user registration and account creation within the habit tracking application.
        /// </summary>
        /// <param name="user">The User object to be added to the repository.</param>
        /// <returns>The created User object with any generated identifiers or timestamps.</returns>
        Task<User> AddUserAsync(User user);

        /// <summary>
        /// Asynchronously retrieves a user by their unique identifier. This method takes the user's unique identifier as input and returns the corresponding User object if found.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>The User object associated with the specified identifier, or null if not found.</returns>
        Task<User> GetUserByIdAsync(Guid userId);

        /// <summary>
        /// Asynchronously retrieves a user by their email address. This method takes the user's email address as input and returns the corresponding User object if found.
        /// </summary>
        /// <param name="emailId">The email address of the user.</param>
        /// <returns>The User object associated with the specified email address, or null if not found.</returns>
        Task<User> GetUserByEmailIdAsync(string emailId);

        /// <summary>
        /// Asynchronously updates an existing user in the repository. This method takes a User object as input, which contains the updated details of the user. The method returns the updated User object, allowing users to see the changes made to their account.
        /// </summary>
        /// <param name="user">The User object with updated details.</param>
        /// <returns>The updated User object.</returns>
        Task<User> UpdateUserAsync(User user);

        /// <summary>
        /// Asynchronously deletes a user by their unique identifier. This method takes the user's unique identifier as input and returns a boolean indicating whether the deletion was successful.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A boolean indicating whether the user was successfully deleted.</returns>
        Task<bool> DeleteUserAsync(Guid userId);
    }
}