using Application.Models.Habits.Create;
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
    public class CreateHabitRequestHandler(IHabitRepository habitRepository, IMapper mapper) : IRequestHandler<CreateHabitRequest, CreateHabitResponse>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        async Task<CreateHabitResponse> IRequestHandler<CreateHabitRequest, CreateHabitResponse>.Handle(CreateHabitRequest request, CancellationToken cancellationToken)
        {
            var habit = _mapper.Map<Habit>(request.CreateHabit);

            habit.UserId = request.UserId;

            var addHabit = await _habitRepository.AddHabitAsync(habit);

            return _mapper.Map<CreateHabitResponse>(addHabit);
        }
    }
}
