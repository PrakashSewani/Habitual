using Application.Repositories.Habits;

namespace WebApi.Services
{
    public class ArchivalBackgroundService : IHostedService, IDisposable
    {
        private readonly IServiceProvider _serviceProvider;
        private Timer _timer;

        public ArchivalBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;
            var nextRun = DateTime.UtcNow.Date.AddHours(2);
            if (nextRun <= now)
            {
                nextRun = nextRun.AddDays(1);
            }

            var delay = nextRun - now;

            _timer = new Timer(async _ => await DoWorkAsync(), null, delay, TimeSpan.FromDays(1));

            return Task.CompletedTask;
        }

        private async Task DoWorkAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var habitLogRepository = scope.ServiceProvider.GetRequiredService<IHabitLogRepository>();
            await habitLogRepository.ArchiveOldLogsAsync();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
