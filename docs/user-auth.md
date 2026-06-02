# Authentication and Authorization

## Overview

Habitual uses JWT-based authentication with refresh token rotation. Access tokens are short-lived (1 hour) and refresh tokens are stored in Redis with sliding expiration. Passwords are hashed using BCrypt.

## Authentication Flow

### Login

```
POST /api/user/login
Body: { email, password, source }

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "dGhpcy...",
    "userId": "..."
  },
  "message": "User logged in successfully"
}
```

1. User submits email and password
2. System verifies password against BCrypt hash
3. Generates JWT access token (1 hour expiry)
4. Generates random refresh token
5. Stores refresh token in Redis with user association
6. Returns both tokens to client

### Token Refresh

```
POST /api/user/refresh?refreshToken=...

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "bmV3dG...",
    "userId": "..."
  },
  "message": "Token refreshed successfully"
}
```

1. Client sends refresh token
2. System validates token exists in Redis
3. Generates new access token and refresh token
4. Replaces old refresh token in Redis
5. Returns new token pair

### Logout

```
DELETE /api/user/logout?refreshToken=...

Response:
{
  "success": true,
  "data": true,
  "message": "User logged out successfully"
}
```

1. Client sends refresh token
2. System removes token from Redis
3. Client clears local session storage

### Web Frontend Token Handling

The web app uses axios interceptors to:
1. Attach Bearer token to every request
2. Detect 401 responses
3. Automatically refresh token using stored refresh token
4. Retry the original request with new access token
5. Redirect to login if refresh fails

## JWT Token Structure

### Claims

| Claim | Value | Description |
|-------|-------|-------------|
| `sub` | User ID (GUID) | Subject identifier |
| `email` | User email | User email address |
| `source` | 1 (Web) or 2 (Mobile) | Client source platform |

### Configuration

```csharp
TokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuer = false,
    ValidateAudience = false,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
};
```

- **Expiry**: 1 hour
- **Algorithm**: HMAC SHA256
- **Secret**: Configured via `Jwt:Secret` environment variable

## Refresh Token Storage

Refresh tokens are stored in Redis with the following key structure:

```
refresh_token:{token_value} → { userId: "...", createdAt: "..." }
```

### Properties
- **Storage**: Redis (via `IConnectionMultiplexer`)
- **Format**: Base64-encoded random GUID
- **Lifetime**: Configured via Redis TTL
- **Rotation**: New token issued on every refresh, old token invalidated

## Password Security

### Hashing
- **Algorithm**: BCrypt (via `BCrypt.Net`)
- **Work Factor**: Default (10)
- **Storage**: `PasswordHash` field on User entity

### Verification
```csharp
bool isValid = _passwordHasher.VerifyPassword(inputPassword, storedHash);
```

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Authorization

### Controllers
All controllers use `[Authorize]` attribute. Anonymous endpoints are explicitly marked:
- `POST /api/user/create` - Registration
- `POST /api/user/login` - Login
- `POST /api/user/refresh` - Token refresh

### User ID Extraction
Every authenticated endpoint extracts the user ID from JWT claims:

```csharp
var userIdClaim = (User.FindFirst(ClaimTypes.NameIdentifier)
    ?? User.FindFirst("sub")) ?? throw new UnauthorizedAccessException("Invalid token");
var userId = Guid.Parse(userIdClaim.Value);
```

### SignalR Authentication
SignalR connections authenticate via query parameter:

```csharp
OnMessageReceived = context =>
{
    var accessToken = context.Request.Query["access_token"];
    var path = context.HttpContext.Request.Path;

    if (!string.IsNullOrWhiteSpace(accessToken) &&
        path.StartsWithSegments("/hubs/habits"))
    {
        context.Token = accessToken;
    }
    return Task.CompletedTask;
};
```

## User Management Endpoints

### Create User
```
POST /api/user/create
Body: { name, email, password, phoneNumber, dateOfBirth }
```

### Get Current User
```
GET /api/user/me
Returns: { id, name, email, phoneNumber, dateOfBirth, createdAt }
```

### Update User
```
PUT /api/user/update
Body: { name?, email?, phoneNumber?, dateOfBirth? }
```
Partial update - only provided fields are modified.

### Update Password
```
PUT /api/user/password
Body: { currentPassword, newPassword }
```
Verifies current password before applying new password.

### Delete User
```
DELETE /api/user/delete
```
Permanently removes user and all associated data.

## Web Frontend Authentication

### Hooks
- `useAuthenticateUser` - Fetches current user on mount, handles redirects
- `useAxiosRequest` - Configured axios instance with interceptors for auth

### Session Storage
```
sessionStorage:
  ├── token          → JWT access token
  └── refreshToken   → Refresh token
```

### Logout Flow
1. Call backend logout endpoint
2. Clear local session storage
3. Redirect to login page
4. Backend failure is ignored - local logout always succeeds

## Security Considerations

1. **CORS**: Configured for frontend origins only
2. **HTTPS**: Enforced in production
3. **Token Expiry**: Short-lived access tokens (1 hour)
4. **Token Rotation**: Refresh tokens rotated on every use
5. **Password Requirements**: Strong password policy enforced
6. **Account Deletion**: Requires explicit confirmation

---

## Related Documentation

- [architecture.md](architecture.md) - System architecture overview
- [api-reference.md](api-reference.md) - Complete API endpoint documentation
- [signalr-realtime.md](signalr-realtime.md) - Real-time authentication
