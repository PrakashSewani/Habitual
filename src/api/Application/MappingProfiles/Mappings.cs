using Application.Models.Habits.Create;
using Application.Models.Habits.Get;
using Application.Models.Users.Auth;
using Application.Models.Users.Create;
using Application.Models.Users.Update;
using AutoMapper;
using Domain.Entities.Habits;
using Domain.Entities.Users;

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

            CreateMap<CreateHabit, Habit>();
            CreateMap<CreateHabitSchedule, HabitSchedule>();
            CreateMap<HabitSchedule, CreateHabitSchedule>();
            CreateMap<Habit, CreateHabitResponse>();
            CreateMap<Habit, GetHabitForUserResponse>();
        }
    }
}
