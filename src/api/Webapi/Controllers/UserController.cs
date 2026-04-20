using Application.Features.Users.Command.Create;
using Application.Features.Users.Command.Delete;
using Application.Features.Users.Command.Update;
using Application.Models.Users.Create;
using Application.Models.Users.Update;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

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
            return Ok(resp);
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetUser()
        {
            throw new NotImplementedException();
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser()
        {
            throw new NotImplementedException();
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser(UpdateUser user)
        {
            var resp = await _mediator.Send(new UpdateUserRequest(user));
            return Ok(resp);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteUser(Guid Id)
        {
            var resp = await _mediator.Send(new DeleteUserRequest(Id));
            return Ok(resp);
        }
    }
}
