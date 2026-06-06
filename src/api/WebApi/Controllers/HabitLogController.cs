using Application.Features.HabitLogs.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.Common.Responses;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/[controller]")]
    public class HabitLogController(IMediator mediator) : Controller
    {
        private readonly IMediator _mediator = mediator;

        [HttpPut]
        public async Task<IActionResult> ToggleHabitLog(Guid habitId, DateOnly date)
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                   ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            var userId = Guid.Parse(userIdClaim.Value);

            var resp = await _mediator.Send(new UpdateHabitLogRequest(userId, habitId, date));

            return Ok(ApiResponseFactory.Success(resp, "Habit log updated successfully"));
        }
    }
}
