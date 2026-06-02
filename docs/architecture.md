# System Architecture

## Overview

Habitual is a modern habit tracking platform built with Clean Architecture principles. The system consists of a .NET backend, a Next.js web frontend, and a React Native mobile app. Data is persisted in PostgreSQL with Redis for session management.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│  ┌─────────────┐    ┌─────────────┐                                    │
│  │   Web App   │    │ Mobile App  │                                    │
│  │  (Next.js)  │    │ (Expo/RN)   │                                    │
│  └──────┬──────┘    └──────┬──────┘                                    │
└─────────┼──────────────────┼──────────────────────────────────────────┘
          │                  │
          │  HTTP / SignalR  │
          │                  │
┌─────────┼──────────────────┼──────────────────────────────────────────┐
│         │   API Layer (.NET)  │                                       │
│  ┌──────┴──────────────────┴──────┐                                  │
│  │        WebApi (Controllers)      │                                  │
│  │  • UserController                │                                  │
│  │  • HabitController               │                                  │
│  │  • HabitLogController            │                                  │
│  │  • HabitHub (SignalR)            │                                  │
│  └──────────────┬────────────────────┘                                  │
│                 │                                                       │
│  ┌──────────────┴────────────────────┐                                  │
│  │      Application Layer            │                                  │
│  │  • CQRS Handlers (MediatR)        │                                  │
│  │  • Validation Pipeline            │                                  │
│  │  • DTOs / Models                  │                                  │
│  │  • Repository Interfaces          │                                  │
│  │  • AutoMapper Profiles            │                                  │
│  └──────────────┬────────────────────┘                                  │
│                 │                                                       │
│  ┌──────────────┴────────────────────┐                                  │
│  │        Domain Layer               │                                  │
│  │  • Entities (User, Habit, etc.)   │                                  │
│  │  • Enums (ScheduleType, Source)   │                                  │
│  └──────────────┬────────────────────┘                                  │
│                 │                                                       │
│  ┌──────────────┴────────────────────┐                                  │
│  │     Infrastructure Layer          │                                  │
│  │  • DbContext (EF Core + PGSQL)    │                                  │
│  │  • Repositories (EF Implementation) │                                  │
│  │  • Password Hashing (BCrypt)      │                                  │
│  │  • JWT Token Service                │                                  │
│  │  • Redis Refresh Token Store        │                                  │
│  └──────────────┬────────────────────┘                                  │
└─────────────────┼─────────────────────────────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
    ┌────┴────┐      ┌─────┴─────┐
    │PostgreSQL│      │  Redis    │
    │ (Data)   │      │ (Sessions)│
    └─────────┘      └───────────┘
```

## Clean Architecture

The backend follows Clean Architecture with four distinct layers:

### 1. API Layer (`WebApi/`)
- **Controllers**: Handle HTTP requests and responses
- **Hubs**: SignalR real-time connections
- **Extensions**: Middleware, authentication, CORS, OpenAPI
- **Common**: Shared response formats, SignalR utilities

### 2. Application Layer (`Application/`)
- **Features**: CQRS command and query handlers organized by domain
- **Models**: DTOs for requests and responses
- **Repositories**: Interface definitions (abstractions)
- **Interfaces**: Service contracts (IPasswordHasher, ITokenService, etc.)
- **MappingProfiles**: AutoMapper configuration
- **Pipeline Behaviour**: MediatR validation pipeline

### 3. Domain Layer (`Domain/`)
- **Entities**: Core business objects (User, Habit, HabitLog, HabitSchedule, HabitLogArchive)
- **Enums**: Type-safe enumerations (ScheduleType, Source, WeekDay)
- No dependencies on external frameworks

### 4. Infrastructure Layer (`Infrastructure/`)
- **Context**: EF Core DbContext with PostgreSQL
- **Repositories**: EF Core implementations of repository interfaces
- **Security**: BCrypt password hashing
- **Authentication**: JWT token generation and Redis refresh token storage
- **Migrations**: EF Core database migrations

## CQRS with MediatR

All business operations flow through MediatR:

```
HTTP Request
    → Controller
    → MediatR.Send(request)
    → ValidatorPipelineBehaviour (validation)
    → Handler (business logic)
    → Repository (data access)
    → Response
```

### Validation Pipeline
Every request implementing `IValidate` is automatically validated by FluentValidation before reaching the handler. Validation failures return 400 Bad Request with structured error messages.

### Exception Handling
Global exception handler middleware maps exceptions to HTTP status codes:
- `ValidationException` → 400 Bad Request
- `UnauthorizedAccessException` → 401 Unauthorized
- `KeyNotFoundException` → 404 Not Found
- All others → 500 Internal Server Error

## Unified API Response Format

All API responses follow a consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "errors": []
}
```

## Authentication Flow

```
1. Login → JWT Access Token (1h) + Refresh Token (stored in Redis)
2. API Request → Bearer token in Authorization header
3. SignalR Connection → access_token query parameter
4. Token Expired → POST /api/user/refresh with refresh token
5. Logout → Delete refresh token from Redis
```

## Data Storage Strategy

### Hot and Cold Storage

The system uses a single PostgreSQL database with logical separation:

- **Hot Storage**: `HabitLogs` table for active/current data
- **Cold Storage**: `HabitLogArchives` table for historical data

A future background job will move old records from hot to cold storage.

### Database Schema

See [database-schema.md](database-schema.md) for full entity relationships.

## Real-Time Communication

SignalR provides real-time updates for:
- Habit log toggles (completion status changes)
- Habit CRUD operations (create, update, delete)

Events are broadcast to the authenticated user only via `CustomUserIdProvider`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | .NET 10, ASP.NET Core |
| Database | PostgreSQL (EF Core) |
| Cache | Redis (refresh tokens) |
| Auth | JWT (System.IdentityModel.Tokens.Jwt) |
| Validation | FluentValidation |
| Mapping | AutoMapper |
| Real-time | SignalR |
| Web | Next.js 16, React 19, Chakra UI v3 |
| Mobile | React Native (Expo) |
| API Docs | OpenAPI / Swagger |

## Scalability Path

### Phase 1 (Current)
- Single API instance
- Single PostgreSQL database
- Hot + Archive tables

### Phase 2
- Table partitioning by date
- API horizontal scaling

### Phase 3
- Separate read replica for analytics
- Archive data in separate database

### Phase 4
- Data warehouse for analytics
- Event-driven architecture

## Design Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Inversion**: Application layer depends on abstractions, not implementations
3. **CQRS**: Commands and queries are separated for clarity and scalability
4. **Validation Pipeline**: Cross-cutting validation handled via MediatR pipeline
5. **Consistent Responses**: All API responses follow the same envelope format
6. **Type Safety**: Enums and strongly-typed DTOs throughout

---

## Files

- [api-reference.md](api-reference.md) - Complete API endpoint documentation
- [database-schema.md](database-schema.md) - Entity relationships and schema
- [user-auth.md](user-auth.md) - Authentication and authorization details
- [signalr-realtime.md](signalr-realtime.md) - Real-time communication
- [web-frontend.md](web-frontend.md) - Web application architecture
- [project-structure.md](project-structure.md) - Full project directory layout
