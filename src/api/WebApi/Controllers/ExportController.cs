using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using WebApi.Common.Responses;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/export")]
    public class ExportController(IAnalyticsService analyticsService) : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService = analyticsService;

        private Guid GetUserId()
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            return Guid.Parse(userIdClaim.Value);
        }

        [HttpGet("habits")]
        public async Task<IActionResult> ExportHabits([FromQuery] string format = "json")
        {
            var userId = GetUserId();

            if (format.Equals("csv", StringComparison.OrdinalIgnoreCase))
            {
                var csv = await _analyticsService.ExportHabitsCsvAsync(userId);
                return File(Encoding.UTF8.GetBytes(csv), "text/csv", "habits.csv");
            }

            var json = await _analyticsService.ExportHabitsJsonAsync(userId);
            return Ok(ApiResponseFactory.Success(json, "Habits exported successfully"));
        }
    }
}
