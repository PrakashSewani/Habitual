using Application.Interfaces;
using Application.Models.Analytics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.Common.Responses;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/analytics")]
    public class AnalyticsController(IAnalyticsService analyticsService) : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService = analyticsService;

        private Guid GetUserId()
        {
            var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
                ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
            return Guid.Parse(userIdClaim.Value);
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = GetUserId();
            var result = await _analyticsService.GetDashboardStatsAsync(userId);
            return Ok(ApiResponseFactory.Success(result, "Dashboard stats fetched successfully"));
        }

        [HttpGet("heatmap")]
        public async Task<IActionResult> GetHeatmap()
        {
            var userId = GetUserId();
            var result = await _analyticsService.GetHeatmapDataAsync(userId);
            return Ok(ApiResponseFactory.Success(result, "Heatmap data fetched successfully"));
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard([FromQuery] int year, [FromQuery] int month, [FromQuery] string sortBy = "completionRate")
        {
            var userId = GetUserId();
            var result = await _analyticsService.GetLeaderboardAsync(userId, year, month, sortBy);
            return Ok(ApiResponseFactory.Success(result, "Leaderboard fetched successfully"));
        }

        [HttpGet("day-of-week")]
        public async Task<IActionResult> GetDayOfWeekStats()
        {
            var userId = GetUserId();
            var result = await _analyticsService.GetDayOfWeekStatsAsync(userId);
            return Ok(ApiResponseFactory.Success(result, "Day of week stats fetched successfully"));
        }

        [HttpGet("badges")]
        public async Task<IActionResult> GetBadges()
        {
            var userId = GetUserId();
            var result = await _analyticsService.GetBadgesAsync(userId);
            return Ok(ApiResponseFactory.Success(result, "Badges fetched successfully"));
        }

        [HttpGet("day-detail")]
        public async Task<IActionResult> GetDayDetail([FromQuery] DateOnly date)
        {
            var userId = GetUserId();
            var result = await _analyticsService.GetDayDetailAsync(userId, date);
            return Ok(ApiResponseFactory.Success(result, "Day detail fetched successfully"));
        }

        [HttpGet("month-comparison")]
        public async Task<IActionResult> GetMonthComparison()
        {
            var userId = GetUserId();
            var result = await _analyticsService.GetMonthComparisonAsync(userId);
            return Ok(ApiResponseFactory.Success(result, "Month comparison fetched successfully"));
        }
    }
}
