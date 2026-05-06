using Application.Models.Habits.Get;
using Application.Repositories.Habits;
using AutoMapper;
using MediatR;

namespace Application.Features.Habits.Query.Get
{
    public class GetHabitForUserRequestHandler(IHabitRepository habitRepository, IMapper mapper) : IRequestHandler<GetHabitForUserRequest, List<GetHabitForUserResponse>>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        async Task<List<GetHabitForUserResponse>> IRequestHandler<GetHabitForUserRequest, List<GetHabitForUserResponse>>.Handle(GetHabitForUserRequest request, CancellationToken cancellationToken)
        {
            var habitsInDb = await _habitRepository.GetHabitsByUserIdAsync(request.UserId);
            var resp = _mapper.Map<List<GetHabitForUserResponse>>(habitsInDb);
            return resp;
        }
    }
}
