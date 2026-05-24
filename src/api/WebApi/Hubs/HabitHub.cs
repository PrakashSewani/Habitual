using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Hubs
{
    [Authorize]
    public class HabitHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var user = Context.User;
            if (user?.Identity?.IsAuthenticated == true)
            {
                foreach (var claim in user.Claims)
                {
                    Console.WriteLine($"{claim.Type}: {claim.Value}");
                }
            }
            else
            {
                Console.WriteLine("HabitHub: Anonymous connection attempt");
            }

            await base.OnConnectedAsync();
        }
    }
}
