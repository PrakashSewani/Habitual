using Application.Interfaces;
using Application.Models.Habits.Get;
using Application.Models.Habits.SignalR;
using Application.Repositories.Habits;
using AutoMapper;
using MediatR;

namespace Application.Features.Habits.Command.Update
{
    /// <summary>
    /// UpdateHabitRequestHandler is responsible for handling the UpdateHabitRequest command, which updates an existing habit for a specific user. It interacts with the IHabitRepository to perform the necessary operations to update the habit in the database and uses AutoMapper to map between the UpdateHabit model and the Habit entity, as well as to map the resulting Habit entity to a GetHabitForUserResponse. When executed, this handler will update the specified habit in the system for the given user and return the updated habit details in the response.
    /// </summary>
    /// <param name="habitRepository">The repository used to manage habits.</param>
    /// <param name="mapper">The AutoMapper instance used for mapping between models and entities.</param>
    /// <param name="habitRealtimeService">The service used to broadcast habit updates in real-time.</param>
    public class UpdateHabitRequestHandler(IHabitRepository habitRepository, IMapper mapper, IHabitRealtimeService habitRealtimeService) : IRequestHandler<UpdateHabitRequest, GetHabitForUserResponse>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHabitRealtimeService _habitRealtimeService = habitRealtimeService;

        async Task<GetHabitForUserResponse> IRequestHandler<UpdateHabitRequest, GetHabitForUserResponse>.Handle(UpdateHabitRequest request, CancellationToken cancellationToken)
        {
            var habitToUpdate = _mapper.Map<Domain.Entities.Habits.Habit>(request.UpdateHabit);
            habitToUpdate.UserId = request.UserId;
            var resp = await _habitRepository.UpdateHabitAsync(habitToUpdate);

            var habitResponse = _mapper.Map<GetHabitForUserResponse>(resp);

            await _habitRealtimeService.BroadcastHabitUpdatedAsync(request.UserId, new HabitUpdatedEvent
            {
                HabitId = resp.Id,
                Action = "updated",
                Habit = habitResponse
            });

            return habitResponse;
        }
    }
}
