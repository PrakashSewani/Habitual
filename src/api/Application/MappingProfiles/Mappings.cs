using Application.Models.Users.Create;
using AutoMapper;
using Domain;

namespace Application.MappingProfiles
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<User, CreateUserDTO>();
        }
    }
}
