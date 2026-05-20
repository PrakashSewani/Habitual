using Application.Models.Users.Get;
using Application.Repositories.Users;
using AutoMapper;
using MediatR;

namespace Application.Features.Users.Query.Get
{
    public class GetUserRequestHandler(IMapper mapper, IUserRepository userRepository) : IRequestHandler<GetUserRequest, GetUserResponse>
    {
        private readonly IMapper _mapper = mapper;
        private readonly IUserRepository _userRepository = userRepository;

        public async Task<GetUserResponse> Handle(GetUserRequest request, CancellationToken cancellationToken)
        {
            var userInDb = await _userRepository.GetUserByIdAsync(request.UserId) ?? throw new Exception("User not found");

            var response = _mapper.Map<GetUserResponse>(userInDb);

            return response;
        }
    }
}
