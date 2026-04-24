using Application.Features.Users.Command.Auth;
using Application.Features.Users.Command.Create;
using Application.Features.Users.Command.Delete;
using Application.Features.Users.Command.Logout;
using Application.Features.Users.Command.Refresh;
using Application.Features.Users.Command.Update;
using Application.Models.Users.Create;
using Application.Models.Users.Update;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common.Responses;

namespace Webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IMediator mediator) : Controller
    {
        private readonly IMediator _mediator = mediator;

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(CreateUser User)
        {
            var resp = await _mediator.Send(new CreateUserRequest(User));
            return Ok(ApiResponseFactory.Success(resp, "User created successfully"));
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser(string username, string password)
        {
            var resp = await _mediator.Send(new AuthUserRequest(username, password));
            return Ok(ApiResponseFactory.Success(resp, "User logged in successfully"));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            var resp = await _mediator.Send(new RefreshUserRequest(refreshToken));
            return Ok(ApiResponseFactory.Success(resp, "Token refreshed successfully"));
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser(UpdateUser user)
        {
            var resp = await _mediator.Send(new UpdateUserRequest(user));
            return Ok(ApiResponseFactory.Success(resp, "User updated successfully"));
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser(Guid Id)
        {
            var resp = await _mediator.Send(new DeleteUserRequest(Id));
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
