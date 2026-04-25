using Application.Models.Users.Auth;
using Application.Models.Users.Create;
using Application.Models.Users.Update;
using AutoMapper;
using Domain;

namespace Application.MappingProfiles
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<User, CreateUserResponse>();
            CreateMap<User, UpdateUserResponse>();
            CreateMap<UpdateUser, User>();
            CreateMap<User, AuthUserDTO>();
        }
    }
}
