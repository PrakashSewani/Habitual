using Application.Features.Habits.Command.Create;
using Application.Features.Habits.Command.Delete;
using Application.Features.Habits.Command.Update;
using Application.Features.Habits.Query.Get;
using Application.Models.Habits.Create;
using Application.Models.Habits.Update;
using Domain.Common.Enums;
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

            var sourceClaim = User.FindFirst("source");
            var source = sourceClaim != null && int.TryParse(sourceClaim.Value, out var sourceInt)
                ? (Source)sourceInt
                : Source.Web;

            var resp = await _mediator.Send(new CreateHabitRequest(userId, habit, source));
            return Ok(ApiResponseFactory.Success(resp, "Habit created successfully"));
        }

        [HttpGet("get")]
        public async Task<IActionResult> FetchUserHabit([FromQuery] DateOnly? from, [FromQuery] DateOnly? to, [FromQuery] string? search)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new GetHabitForUserRequest(userId, from, to, search));
            return Ok(ApiResponseFactory.Success(resp, "Habits fetched successfully"));
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateHabit(UpdateHabit updateHabit)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new UpdateHabitRequest(userId, updateHabit));
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
