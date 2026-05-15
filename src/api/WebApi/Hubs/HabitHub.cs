using Microsoft.AspNetCore.SignalR;

namespace WebApi.Hubs
{
    public class HabitHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            foreach (var claim in Context.User.Claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }

            await base.OnConnectedAsync();
        }
    }
}
