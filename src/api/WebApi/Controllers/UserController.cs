using Application.Features.Users.Command.Auth;
using Application.Features.Users.Command.Create;
using Application.Features.Users.Command.Delete;
using Application.Features.Users.Command.Logout;
using Application.Features.Users.Command.Refresh;
using Application.Features.Users.Command.Update;
using Application.Features.Users.Query.Get;
using Application.Models.Users.Auth;
using Application.Models.Users.Create;
using Application.Models.Users.Update;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.Common.Responses;

namespace Webapi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserController(IMediator mediator) : Controller
    {
        private readonly IMediator _mediator = mediator;

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
            var resp = await _mediator.Send(new AuthUserRequest(authUser.Email, authUser.password));
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

        [HttpDelete("logout")]
        public async Task<IActionResult> LogoutUser(string refreshToken)
        {
            var resp = await _mediator.Send(new LogoutUserRequest(refreshToken));
            return Ok(ApiResponseFactory.Success(resp, "User logged out successfully"));
        }
    }
}
