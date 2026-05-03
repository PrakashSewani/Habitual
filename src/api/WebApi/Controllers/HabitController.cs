using Application.Features.Habits.Command.Create;
using Application.Features.Habits.Command.Delete;
using Application.Features.Habits.Command.Update;
using Application.Features.Habits.Query.Get;
using Application.Models.Habits.Create;
using Application.Models.Habits.Update;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.Common.Responses;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class HabitController(IMediator mediator) : Controller
    {
        private readonly IMediator _mediator = mediator;

        [HttpPost("create")]
        public async Task<IActionResult> CreateHabit(CreateHabit habit)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                  ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new CreateHabitRequest(userId, habit));
            return Ok(ApiResponseFactory.Success(resp, "Habit created successfully"));
        }

        [HttpGet("get")]
        public async Task<IActionResult> FetchUserHabit()
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new GetHabitForUserRequest(userId));
            return Ok(ApiResponseFactory.Success(resp, "Habits fetched successfully"));
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateHabit(UpdateHabit updateHabit)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            updateHabit.UserId = userId;

            var resp = await _mediator.Send(new UpdateHabitRequest(updateHabit));
            return Ok(ApiResponseFactory.Success(resp, "Habit updated successfully"));
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteHabit(Guid habitId)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                  ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);
            var resp = await _mediator.Send(new DeleteHabitRequest(userId, habitId));
            return Ok(ApiResponseFactory.Success(resp, "Habit deleted successfully"));
        }
    }
}
