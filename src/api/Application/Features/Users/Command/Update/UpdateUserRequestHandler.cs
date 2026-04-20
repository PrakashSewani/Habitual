using Application.Models.Users.Update;
using Application.Repository;
using AutoMapper;
using Domain;
using MediatR;

namespace Application.Features.Users.Command.Update
{
    public class UpdateUserRequestHandler(IUserRepository userRepository, IMapper mapper) : IRequestHandler<UpdateUserRequest, UpdateUserDTO>
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;

        async Task<UpdateUserDTO> IRequestHandler<UpdateUserRequest, UpdateUserDTO>.Handle(UpdateUserRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var resp = _mapper.Map<UpdateUserDTO>(await _userRepository.UpdateUserAsync(_mapper.Map<User>(request.UserRequest)));
                return resp;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
