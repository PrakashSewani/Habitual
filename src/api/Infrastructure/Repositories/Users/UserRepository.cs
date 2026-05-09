using Application.Repositories.Users;
using Domain.Entities.Users;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Users
{
    /// <summary>
    /// UserRepository is responsible for managing user data in the database. It implements the IUserRepository interface, providing methods to add, delete, retrieve, and update user information. The repository interacts with the AppDbContext to perform database operations related to users, ensuring that user data is stored and retrieved efficiently while maintaining data integrity.
    /// </summary>
    /// <param name="context">The database context used to interact with the underlying database.</param>
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        private readonly AppDbContext _context = context;

        /// <summary>
        /// Adds a new user to the database. This method takes a User object as input, adds it to the Users DbSet, and saves the changes to the database. It returns the added User object, which includes any generated values such as the Id. This method is asynchronous and ensures that the user is properly stored in the database for future retrieval and management.
        /// </summary>
        /// <param name="user">The user object to be added to the database.</param>
        /// <returns>The added user object with any generated values such as the Id.</returns>
        public async Task<User> AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        /// <summary>
        /// Deletes a user from the database based on the provided userId. This method first retrieves the user with the specified Id from the Users DbSet. If the user is found, it is removed from the DbSet, and the changes are saved to the database. The method returns true if the user was successfully deleted, or false if no user with the given Id was found. This operation is performed asynchronously to ensure efficient database interaction.
        /// </summary>
        /// <param name="userId">The unique identifier of the user to be deleted.</param>
        /// <returns>A boolean indicating whether the user was successfully deleted.</returns>
        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            var user = await _context.Users
                                     .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Gets a user from the database based on the provided emailId. This method queries the Users DbSet to find a user whose Email property matches the given emailId. If a matching user is found, it is returned; otherwise, null is returned. The query is performed asynchronously and uses AsNoTracking to optimize performance since the retrieved user is not intended to be modified in the current context. This method allows for efficient retrieval of user information based on their email address, which is often used as a unique identifier for users in many applications.
        /// </summary>
        /// <param name="emailId">The email address of the user to be retrieved.</param>
        /// <returns>The user object if found; otherwise, null.</returns>
        public async Task<User> GetUserByEmailIdAsync(string emailId)
        {
            return await _context.Users
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(u => u.Email == emailId);
        }

        /// <summary>
        /// Gets a user from the database based on the provided userId. This method queries the Users DbSet to find a user whose Id property matches the given userId. If a matching user is found, it is returned; otherwise, null is returned. The query is performed asynchronously and uses AsNoTracking to optimize performance since the retrieved user is not intended to be modified in the current context. This method allows for efficient retrieval of user information based on their unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the user to be retrieved.</param>
        /// <returns>The user object if found; otherwise, null.</returns>
        public async Task<User> GetUserByIdAsync(Guid userId)
        {
            return await _context.Users
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(u => u.Id == userId);
        }

        /// <summary>
        /// Updates an existing user in the database. This method takes a User object as input, checks if there is another user with the same email address (excluding the current user), and if so, throws an exception to prevent duplicate email entries. If the email is unique, it updates the user information in the Users DbSet and saves the changes to the database. The method returns the updated User object. This operation is performed asynchronously to ensure efficient database interaction while maintaining data integrity by enforcing unique email addresses for users.
        /// </summary>
        /// <param name="user">The user object containing updated information.</param>
        /// <returns>The updated user object.</returns>
        /// <exception cref="Exception">Thrown when another user with the same email address exists.</exception>
        public async Task<User> UpdateUserAsync(User user)
        {
            var existingUser = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u =>
                    u.Email == user.Email);

            if (existingUser != null &&
                existingUser.Id != user.Id)
            {
                throw new Exception("Email already exists");
            }

            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            return user;
        }
    }
}