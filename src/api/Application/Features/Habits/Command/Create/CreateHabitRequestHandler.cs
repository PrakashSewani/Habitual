using Application.Models.Habits.Create;
using Application.Repositories.Habits;
using AutoMapper;
using MediatR;

namespace Application.Features.Habits.Command.Create
{
    public class CreateHabitRequestHandler(IHabitRepository habitRepository, IMapper mapper) : IRequestHandler<CreateHabitRequest, CreateHabitResponse>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        Task<CreateHabitResponse> IRequestHandler<CreateHabitRequest, CreateHabitResponse>.Handle(CreateHabitRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
