# API Reference

## Base URL

```
Development: http://localhost:5224/api
Production: (configured via environment)
```

All endpoints are prefixed with `/api` unless otherwise specified.

## Authentication

Most endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer {access_token}
```

SignalR connections use the `access_token` query parameter.

## Response Format

All responses follow a unified envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation message",
  "errors": []
}
```

Error responses:
```json
{
  "success": false,
  "data": null,
  "message": "An error occurred",
  "errors": ["Error message 1", "Error message 2"]
}
```

## User Endpoints

### Create User
```
POST /user/create
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "User created successfully"
}
```

### Login
```
POST /user/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "source": 1
}
```

**Response:**
```json
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

### Get Current User
```
GET /user/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "User retrieved successfully"
}
```

### Update User
```
PUT /user/update
Authorization: Bearer {token}
```

**Body:** (all fields optional - partial update)
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phoneNumber": "+0987654321",
  "dateOfBirth": "1990-01-01"
}
```

### Update Password
```
PUT /user/password
Authorization: Bearer {token}
```

**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastModified": "2024-06-01T00:00:00Z"
  },
  "message": "Password updated successfully"
}
```

### Delete User
```
DELETE /user/delete
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": true,
  "message": "User deleted successfully"
}
```

### Refresh Token
```
POST /user/refresh?refreshToken={refresh_token}
```

**Response:**
```json
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

### Logout
```
DELETE /user/logout?refreshToken={refresh_token}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": true,
  "message": "User logged out successfully"
}
```

## Habit Endpoints

### Create Habit
```
POST /Habit/create
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Morning Run",
  "description": "Run 5km every morning",
  "schedule": {
    "type": 0,
    "interval": null,
    "daysOfWeek": []
  }
}
```

Schedule types:
- `0` - Daily
- `1` - Weekly (requires `daysOfWeek`)
- `2` - Interval (requires `interval` in days)

### Get Habits
```
GET /Habit/get?from={date}&to={date}&search={query}
Authorization: Bearer {token}
```

**Query Parameters:**
- `from` - Optional, DateOnly format (yyyy-MM-dd)
- `to` - Optional, DateOnly format (yyyy-MM-dd)
- `search` - Optional, text search filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Morning Run",
      "description": "Run 5km every morning",
      "isActive": true,
      "createdFrom": 1,
      "createdAt": "2024-01-01T00:00:00Z",
      "schedule": {
        "type": 0,
        "intervalDays": 0,
        "daysOfWeek": []
      },
      "habitLogs": [
        {
          "id": "...",
          "date": "2024-06-01"
        }
      ]
    }
  ],
  "message": "Habits fetched successfully"
}
```

### Update Habit
```
POST /Habit/update
Authorization: Bearer {token}
```

**Body:**
```json
{
  "id": "...",
  "name": "Morning Run",
  "description": "Run 5km every morning",
  "isActive": true,
  "schedule": {
    "type": 0,
    "interval": null,
    "daysOfWeek": []
  }
}
```

### Delete Habit
```
DELETE /Habit/delete?habitId={id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": true,
  "message": "Habit deleted successfully"
}
```

## Habit Log Endpoints

### Toggle Habit Log
```
PUT /HabitLog?habitId={id}&date={yyyy-MM-dd}
Authorization: Bearer {token}
```

Toggles the completion status for a habit on a specific date. Creates a log if it does not exist, deletes it if it does.

**Response:**
```json
{
  "success": true,
  "data": true,
  "message": "Habit log updated successfully"
}
```

## SignalR Hub

### Connection
```
ws://localhost:5224/hubs/habits?access_token={token}
```

### Events

#### Client Receives

**HabitLogUpdated**
```json
{
  "habitId": "...",
  "date": "2024-06-01",
  "completed": true
}
```

**HabitUpdated**
```json
{
  "habitId": "...",
  "action": "created",
  "habit": { ... }
}
```

Actions: `created`, `updated`, `deleted`

## Error Codes

| Status | Scenario |
|--------|----------|
| 400 | Validation failure |
| 401 | Invalid or expired token |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Related Documentation

- [user-auth.md](user-auth.md) - Authentication details
- [signalr-realtime.md](signalr-realtime.md) - Real-time communication
- [architecture.md](architecture.md) - System architecture
