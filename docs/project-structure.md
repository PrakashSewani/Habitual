# Project Structure

## Root Layout

```
Habitual/
├── README.md              # Project overview
├── docs/                  # Documentation
│   ├── architecture.md    # System architecture
│   ├── user-auth.md       # Authentication
│   ├── api-reference.md   # API endpoints
│   ├── database-schema.md # Entity schema
│   ├── web-frontend.md    # Web app architecture
│   ├── signalr-realtime.md # Real-time communication
│   └── project-structure.md # This file
├── src/
│   ├── api/               # .NET backend
│   ├── mobile/            # React Native mobile app
│   └── web/               # Next.js web app
└── .gitignore
```

## Backend (`src/api/`)

```
api/
├── WebApi/                    # API Layer
│   ├── Controllers/
│   │   ├── UserController.cs
│   │   ├── HabitController.cs
│   │   └── HabitLogController.cs
│   ├── Hubs/
│   │   └── HabitHub.cs
│   ├── Services/
│   │   └── HabitRealtimeService.cs
│   ├── Extensions/
│   │   ├── AuthenticationExtensions.cs
│   │   ├── CorsExtensions.cs
│   │   ├── MiddlewareExtensions.cs
│   │   ├── OpenApiExtensions.cs
│   │   └── SignalRExtensions.cs
│   ├── Common/
│   │   ├── Responses/
│   │   │   ├── ApiResponse.cs
│   │   │   └── ApiResponseFactory.cs
│   │   └── SignalR/
│   │       └── CustomUserIdProvider.cs
│   └── Program.cs
│
├── Application/               # Application Layer
│   ├── Features/
│   │   ├── Users/
│   │   │   ├── Command/
│   │   │   │   ├── Auth/
│   │   │   │   │   ├── AuthUserRequest.cs
│   │   │   │   │   ├── AuthUserRequestHandler.cs
│   │   │   │   │   └── AuthUserValidators.cs
│   │   │   │   ├── Create/
│   │   │   │   │   ├── CreateUserRequest.cs
│   │   │   │   │   ├── CreateUserRequestHandler.cs
│   │   │   │   │   └── CreateUserValidators.cs
│   │   │   │   ├── Delete/
│   │   │   │   │   ├── DeleteUserRequest.cs
│   │   │   │   │   ├── DeleteUserRequestHandler.cs
│   │   │   │   │   └── DeleteUserValidators.cs
│   │   │   │   ├── Logout/
│   │   │   │   │   ├── LogoutUserRequest.cs
│   │   │   │   │   ├── LogoutUserRequestHandler.cs
│   │   │   │   │   └── LogoutUserValidators.cs
│   │   │   │   ├── Refresh/
│   │   │   │   │   ├── RefreshUserRequest.cs
│   │   │   │   │   ├── RefreshUserRequestHandler.cs
│   │   │   │   │   └── RefreshUserValidations.cs
│   │   │   │   ├── Update/
│   │   │   │   │   ├── UpdateUserRequest.cs
│   │   │   │   │   ├── UpdateUserRequestHandler.cs
│   │   │   │   │   └── UpdateUserValidators.cs
│   │   │   │   └── UpdatePassword/
│   │   │   │       ├── UpdatePasswordRequest.cs
│   │   │   │       ├── UpdatePasswordRequestHandler.cs
│   │   │   │       └── UpdatePasswordValidators.cs
│   │   │   └── Query/
│   │   │       └── Get/
│   │   │           ├── GetUserRequest.cs
│   │   │           └── GetUserRequestHandler.cs
│   │   └── Habits/
│   │       ├── Command/
│   │       │   ├── Create/
│   │       │   ├── Delete/
│   │       │   └── Update/
│   │       └── Query/
│   │           └── Get/
│   │               ├── GetHabitForUserRequest.cs
│   │               ├── GetHabitForUserRequestHandler.cs
│   │               └── GetHabitForUserValidations.cs
│   ├── Models/
│   │   ├── Users/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthUser.cs
│   │   │   │   └── AuthResponse.cs
│   │   │   ├── Create/
│   │   │   │   ├── CreateUser.cs
│   │   │   │   └── CreateUserResponse.cs
│   │   │   ├── Get/
│   │   │   │   └── GetUserResponse.cs
│   │   │   ├── Update/
│   │   │   │   ├── UpdateUser.cs
│   │   │   │   └── UpdateUserResponse.cs
│   │   │   └── UpdatePassword/
│   │   │       ├── UpdatePassword.cs
│   │   │       └── UpdatePasswordResponse.cs
│   │   └── Habits/
│   │       ├── Create/
│   │       ├── Get/
│   │       ├── Update/
│   │       └── SignalR/
│   │           ├── HabitLogUpdatedEvent.cs
│   │           └── HabitUpdatedEvent.cs
│   ├── Repositories/
│   │   ├── Users/
│   │   │   └── IUserRepository.cs
│   │   └── Habits/
│   │       ├── IHabitRepository.cs
│   │       └── IHabitLogRepository.cs
│   ├── Interfaces/
│   │   ├── IPasswordHasher.cs
│   │   └── IHabitRealtimeService.cs
│   ├── Abstractions/
│   │   └── Authentication/
│   │       ├── ITokenService.cs
│   │       └── IRefreshTokenStore.cs
│   ├── MappingProfiles/
│   │   └── Mappings.cs
│   ├── Pipeline Behaviour/
│   │   ├── Contract/
│   │   │   └── IValidate.cs
│   │   └── ValidatorPipelineBehaviour.cs
│   └── DependencyInjection.cs
│
├── Domain/                    # Domain Layer
│   ├── Entities/
│   │   ├── Users/
│   │   │   └── User.cs
│   │   └── Habits/
│   │       ├── Habit.cs
│   │       ├── HabitLog.cs
│   │       ├── HabitLogArchive.cs
│   │       └── HabitSchedule.cs
│   └── Common/
│       └── Enums/
│           ├── ScheduleType.cs
│           ├── Source.cs
│           └── WeekDay.cs
│
└── Infrastructure/            # Infrastructure Layer
    ├── Context/
    │   └── AppDbContext.cs
    ├── Configurations/
    │   ├── UserConfiguration.cs
    │   ├── HabitConfiguration.cs
    │   ├── HabitLogConfiguration.cs
    │   └── HabitLogArchiveConfiguration.cs
    ├── Repositories/
    │   ├── Users/
    │   │   └── UserRepository.cs
    │   └── Habits/
    │       ├── HabitRepository.cs
    │       └── HabitLogRepository.cs
    ├── Security/
    │   └── PasswordHasher.cs
    ├── Authentication/
    │   ├── TokenService.cs
    │   └── RedisRefreshTokenStore.cs
    ├── Migrations/
    │   └── (EF Core migrations)
    └── DependencyInjection.cs
```

## Web Frontend (`src/web/`)

```
web/
├── public/
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx          # Landing page
│   │   ├── login/
│   │   │   └── index.tsx
│   │   ├── register/
│   │   │   └── index.tsx
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── habits/
│   │   │   └── index.tsx
│   │   ├── analytics/
│   │   │   └── index.tsx
│   │   └── profile/
│   │       └── index.tsx
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── UserNavbar.tsx
│   │   │   ├── MarketingNavbar.tsx
│   │   │   └── LoginNavbar.tsx
│   │   ├── CreateHabitDialog.tsx
│   │   ├── EditHabitDialog.tsx
│   │   ├── MiniCalendar.tsx
│   │   ├── Footer.tsx
│   │   ├── ColorModeToggle.tsx
│   │   └── ClientOnly.tsx
│   ├── hooks/
│   │   ├── useAuthenticateUser.ts
│   │   ├── useAxiosRequest.ts
│   │   ├── useHabits.ts
│   │   ├── useSignalR.ts
│   │   └── useDebounce.ts
│   ├── lib/
│   │   ├── analytics.ts
│   │   └── schedule.ts
│   ├── types/
│   │   ├── user.ts
│   │   └── habit.ts
│   ├── api/
│   │   └── axios.ts
│   ├── config/
│   │   └── api.ts
│   └── styles/
│       └── globals.css
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── tsconfig.json
```

## Mobile App (`src/mobile/`)

```
mobile/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── explore.tsx
│   └── modal.tsx
├── components/
│   ├── ui/
│   │   ├── icon-symbol.tsx
│   │   ├── icon-symbol.ios.tsx
│   │   └── collapsible.tsx
│   ├── themed-view.tsx
│   ├── themed-text.tsx
│   ├── parallax-scroll-view.tsx
│   ├── hello-wave.tsx
│   ├── haptic-tab.tsx
│   └── external-link.tsx
├── hooks/
│   ├── use-theme-color.ts
│   ├── use-color-scheme.ts
│   └── use-color-scheme.web.ts
├── constants/
│   └── theme.ts
├── assets/
│   └── images/
└── package.json
```

## Key Files

### Configuration
| File | Purpose |
|------|---------|
| `api/WebApi/Program.cs` | Backend entry point, middleware pipeline |
| `api/WebApi/appsettings.json` | Backend configuration (JWT secret, DB connection, Redis) |
| `web/next.config.ts` | Next.js configuration |
| `web/src/config/api.ts` | API base URLs |
| `mobile/app.json` | Expo configuration |

### Entry Points
| File | Purpose |
|------|---------|
| `api/WebApi/Program.cs` | ASP.NET Core app startup |
| `web/src/pages/_app.tsx` | Next.js app wrapper (providers, layout) |
| `mobile/app/_layout.tsx` | Expo root layout |

### Dependency Injection
| File | Purpose |
|------|---------|
| `api/Application/DependencyInjection.cs` | MediatR, AutoMapper, FluentValidation |
| `api/Infrastructure/DependencyInjection.cs` | DbContext, Repositories, Services |
| `api/WebApi/Extensions/*.cs` | Middleware, Auth, CORS, SignalR, OpenAPI |

---

## Related Documentation

- [architecture.md](architecture.md) - System architecture overview
- [web-frontend.md](web-frontend.md) - Web application details
- [api-reference.md](api-reference.md) - API endpoints
