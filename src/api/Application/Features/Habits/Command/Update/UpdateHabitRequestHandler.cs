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
            var habitToUpdate = _mapper.Map<Habit>(request.UpdateHabit);
            habitToUpdate.UserId = request.UserId;
            var resp = await _habitRepository.UpdateHabitAsync(habitToUpdate);
            return _mapper.Map<GetHabitForUserResponse>(resp);
        }
    }
}
