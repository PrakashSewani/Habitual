using Application.Interfaces;
using Application.Models.Habits.Create;
using Application.Models.Habits.Get;
using Application.Models.Habits.SignalR;
using Application.Repositories.Habits;
using AutoMapper;
using Domain.Entities.Habits;
using MediatR;

namespace Application.Features.Habits.Command.Create
{
    /// <summary>
    /// CreateHabitRequestHandler is responsible for handling the CreateHabitRequest command, which creates a new habit for a specific user. It interacts with the IHabitRepository to add the new habit to the database and uses AutoMapper to map between the CreateHabit model and the Habit entity, as well as to map the resulting Habit entity to a CreateHabitResponse. When executed, this handler will create a new habit in the system for the specified user and return the details of the created habit in the response.
    /// </summary>
    /// <param name="habitRepository">The repository used to manage habits.</param>
    /// <param name="mapper">The AutoMapper instance used for mapping between models and entities.</param>
    /// <param name="habitRealtimeService">The service used to broadcast habit updates in real-time.</param>
    public class CreateHabitRequestHandler(IHabitRepository habitRepository, IMapper mapper, IHabitRealtimeService habitRealtimeService) : IRequestHandler<CreateHabitRequest, CreateHabitResponse>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHabitRealtimeService _habitRealtimeService = habitRealtimeService;

        async Task<CreateHabitResponse> IRequestHandler<CreateHabitRequest, CreateHabitResponse>.Handle(CreateHabitRequest request, CancellationToken cancellationToken)
        {
            var habit = _mapper.Map<Habit>(request.CreateHabit);

            habit.UserId = request.UserId;
            habit.CreatedFrom = request.Source;

            var addHabit = await _habitRepository.AddHabitAsync(habit);

            var habitResponse = _mapper.Map<GetHabitForUserResponse>(addHabit);

            await _habitRealtimeService.BroadcastHabitUpdatedAsync(request.UserId, new HabitUpdatedEvent
            {
                HabitId = addHabit.Id,
                Action = "created",
                Habit = habitResponse
            });

            return _mapper.Map<CreateHabitResponse>(addHabit);
        }
    }
}
