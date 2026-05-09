using Application.Models.Habits.Create;
using Application.Models.Habits.Get;
using Application.Models.Habits.Update;
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
            ConfigureUserMappings();
            ConfigureHabitMappings();
        }

        private void ConfigureUserMappings()
        {
            // Domain -> Response
            CreateMap<User, CreateUserResponse>();
            CreateMap<User, UpdateUserResponse>();
            CreateMap<User, AuthUserDTO>();

            // Request -> Domain
            CreateMap<UpdateUser, User>(MemberList.None);
        }

        private void ConfigureHabitMappings()
        {
            // =========================
            // CREATE
            // =========================

            CreateMap<CreateHabit, Habit>(MemberList.None);

            CreateMap<CreateHabitSchedule, HabitSchedule>(MemberList.None);

            CreateMap<Habit, CreateHabitResponse>();

            CreateMap<HabitSchedule, CreateHabitSchedule>();

            // =========================
            // UPDATE
            // =========================

            CreateMap<UpdateHabit, Habit>(MemberList.None);

            CreateMap<UpdateHabitSchedule, HabitSchedule>(MemberList.None);


            // =========================
            // GET
            // =========================

            CreateMap<Habit, GetHabitForUserResponse>();

            CreateMap<HabitLog, GetHabitLogEntryForUserResponse>();

            CreateMap<HabitSchedule, HabitScheduleResponse>();
        }
    }
}