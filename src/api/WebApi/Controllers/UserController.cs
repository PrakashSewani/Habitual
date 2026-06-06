using Application.Features.Users.Command.Auth;
using Application.Features.Users.Command.Create;
using Application.Features.Users.Command.Delete;
using Application.Features.Users.Command.Logout;
using Application.Features.Users.Command.Refresh;
using Application.Features.Users.Command.Update;
using Application.Features.Users.Command.UpdatePassword;
using Application.Features.Users.Query.Get;
using Application.Interfaces;
using Application.Models.Users.Auth;
using Application.Models.Users.Create;
using Application.Models.Users.ForgotPassword;
using Application.Models.Users.ResetPassword;
using Application.Models.Users.Update;
using Application.Models.Users.PasswordUpdate;
using Application.Repositories.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Security.Claims;
using WebApi.Common.Responses;

namespace Webapi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/[controller]")]
    public class UserController(
        IMediator mediator,
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IConnectionMultiplexer redis) : Controller
    {
        private readonly IMediator _mediator = mediator;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;
        private readonly IDatabase _redisDb = redis.GetDatabase();

        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(CreateUser User)
        {
            var resp = await _mediator.Send(new CreateUserRequest(User));
            return Ok(ApiResponseFactory.Success(resp, "User created successfully"));
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] AuthUser authUser)
        {
            var resp = await _mediator.Send(new AuthUserRequest(authUser.Email, authUser.password, authUser.Source));
            return Ok(ApiResponseFactory.Success(resp, "User logged in successfully"));
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);
            var resp = await _mediator.Send(new GetUserRequest(userId));
            return Ok(ApiResponseFactory.Success(resp, "User retrieved successfully"));
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            var resp = await _mediator.Send(new RefreshUserRequest(refreshToken));
            return Ok(ApiResponseFactory.Success(resp, "Token refreshed successfully"));
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser(UpdateUser user)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                  ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new UpdateUserRequest(userId, user));
            return Ok(ApiResponseFactory.Success(resp, "User updated successfully"));
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser()
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new DeleteUserRequest(userId));
            return Ok(ApiResponseFactory.Success(resp, "User deleted successfully"));
        }

        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword(Application.Models.Users.PasswordUpdate.UpdatePassword passwordRequest)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new UpdatePasswordRequest(userId, passwordRequest));
            return Ok(ApiResponseFactory.Success(resp, "Password updated successfully"));
        }

        [HttpDelete("logout")]
        public async Task<IActionResult> LogoutUser(string refreshToken)
        {
            var resp = await _mediator.Send(new LogoutUserRequest(refreshToken));
            return Ok(ApiResponseFactory.Success(resp, "User logged out successfully"));
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var email = request.Email?.Trim().ToLower();
            var user = await _userRepository.GetUserByEmailIdAsync(email);
            if (user == null)
            {
                return Ok(ApiResponseFactory.Success<object>(null, "If the email exists, a reset token has been generated"));
            }

            var token = Random.Shared.Next(100000, 999999).ToString();
            var key = $"password-reset:{email}";
            await _redisDb.StringSetAsync(key, token, TimeSpan.FromMinutes(15));

            return Ok(ApiResponseFactory.Success(new { Token = token }, "Reset token generated successfully"));
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var email = request.Email?.Trim().ToLower();
            var user = await _userRepository.GetUserByEmailIdAsync(email);
            if (user == null)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("Invalid email or token"));
            }

            var key = $"password-reset:{email}";
            var storedToken = await _redisDb.StringGetAsync(key);

            if (!storedToken.HasValue || storedToken.ToString() != request.Token)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("Invalid or expired token"));
            }

            user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
            user.LastModified = DateTime.UtcNow;
            await _userRepository.UpdateUserAsync(user);
            await _redisDb.KeyDeleteAsync(key);

            return Ok(ApiResponseFactory.Success<object>(null, "Password reset successfully"));
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            if (file == null || file.Length == 0)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("No file uploaded"));
            }

            if (file.Length > 2 * 1024 * 1024)
            {
                return BadRequest(ApiResponseFactory.Failure<object>("File size exceeds 2MB limit"));
            }

            var allowedTypes = new[] { "image/png", "image/jpeg" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                return BadRequest(ApiResponseFactory.Failure<object>("Only PNG and JPG files are allowed"));
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(ApiResponseFactory.Failure<object>("User not found"));
            }

            user.AvatarBlob = memoryStream.ToArray();
            user.AvatarContentType = file.ContentType;
            user.LastModified = DateTime.UtcNow;
            await _userRepository.UpdateUserAsync(user);

            return Ok(ApiResponseFactory.Success<object>(null, "Avatar uploaded successfully"));
        }

        [HttpGet("avatar")]
        public async Task<IActionResult> GetAvatar()
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null || user.AvatarBlob == null || user.AvatarBlob.Length == 0)
            {
                return NotFound(ApiResponseFactory.Failure<object>("Avatar not found"));
            }

            return File(user.AvatarBlob, user.AvatarContentType ?? "image/png");
        }
    }
}
