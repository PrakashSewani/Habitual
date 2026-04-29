using Application.Models.Habits.Update;
using Application.Repositories.Habits;
using AutoMapper;
using MediatR;

namespace Application.Features.Habits.Command.Update
{
    public class UpdateHabitRequestHandler(IHabitRepository habitRepository, IMapper mapper) : IRequestHandler<UpdateHabitRequest, UpdateHabitResponse>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        Task<UpdateHabitResponse> IRequestHandler<UpdateHabitRequest, UpdateHabitResponse>.Handle(UpdateHabitRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
