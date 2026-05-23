using Application.Models.Habits.Get;
using Application.Repositories.Habits;
using AutoMapper;
using MediatR;

namespace Application.Features.Habits.Query.Get
{
    /// <summary>
    /// Retrieves habits for a user with optional
    /// date range and search filtering.
    /// </summary>
    /// <param name="habitRepository">
    /// Repository used for habit operations.
    /// </param>
    /// <param name="mapper">
    /// AutoMapper instance.
    /// </param>
    public class GetHabitForUserRequestHandler(IHabitRepository habitRepository, IMapper mapper) : IRequestHandler<GetHabitForUserRequest, List<GetHabitForUserResponse>>
    {
        private readonly IHabitRepository _habitRepository = habitRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<GetHabitForUserResponse>> Handle(GetHabitForUserRequest request, CancellationToken cancellationToken)
        {
            var habitsInDb = await _habitRepository.GetHabitsByUserIdAsync(request.UserId, request.From, request.To);

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var search = request.Search.Trim().ToLower();

                habitsInDb = habitsInDb.Where(x => x.Name.ToLower().Contains(search) || (x.Description != null && x.Description.ToLower().Contains(search))).ToList();
            }

            habitsInDb = habitsInDb.OrderByDescending(x => x.CreatedAt).ToList();

            var response = _mapper.Map<List<GetHabitForUserResponse>>(habitsInDb);

            return response;
        }
    }
}