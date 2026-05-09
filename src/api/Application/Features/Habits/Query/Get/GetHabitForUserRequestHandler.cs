using Application.Models.Habits.Get;
using Application.Repositories.Habits;
using AutoMapper;
using MediatR;

namespace Application.Features.Habits.Query.Get
{
    /// <summary>
    /// GetHabitForUserRequestHandler is responsible for handling the GetHabitForUserRequest query, which retrieves a list of habits for a specific user. It interacts with the IHabitRepository to fetch the habits associated with the user's unique identifier and uses AutoMapper to map the retrieved habit entities to a list of GetHabitForUserResponse objects. When executed, this handler will return the details of each habit associated with the specified user in the response.
    /// </summary>
    /// <param name="habitRepository">The repository used to manage habits.</param>
    /// <param name="mapper">The AutoMapper instance used for mapping between models and entities.</param>
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
