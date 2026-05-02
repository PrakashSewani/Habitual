using Application.Models.Habits.Create;
using Application.Repositories.Habits;
using AutoMapper;
using Domain.Entities.Habits;
using MediatR;

namespace Application.Features.Habits.Command.Create
{
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
