using Application.Models.Habits.Get;
using Application.Repositories.Habits;
using AutoMapper;
using Domain.Entities.Habits;
using MediatR;

namespace Application.Features.Habits.Command.Update
{
    public class UpdateHabitRequestHandler(IHabitRepository habitRepository, IMapper mapper) : IRequestHandler<UpdateHabitRequest, GetHabitForUserResponse>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        async Task<GetHabitForUserResponse> IRequestHandler<UpdateHabitRequest, GetHabitForUserResponse>.Handle(UpdateHabitRequest request, CancellationToken cancellationToken)
        {
            var resp = await _habitRepository.UpdateHabitAsync(_mapper.Map<Habit>(request.UpdateHabit));
            return _mapper.Map<GetHabitForUserResponse>(resp);
        }
    }
}
