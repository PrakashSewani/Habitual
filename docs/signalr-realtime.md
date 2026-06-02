# SignalR Real-Time Communication

## Overview

Habitual uses SignalR for real-time updates between the backend and connected clients. This enables instant synchronization of habit changes across multiple devices without requiring manual refresh.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Backend (.NET)                         │
│  ┌─────────────────┐    ┌─────────────────────────────┐  │
│  │   HabitHub      │    │   HabitRealtimeService      │  │
│  │   (SignalR)     │    │   (IHabitRealtimeService)   │  │
│  │                 │    │                             │  │
│  │  OnConnected    │    │  BroadcastHabitLogUpdated   │  │
│  │  (auth check)   │    │  BroadcastHabitUpdated      │  │
│  └────────┬────────┘    └─────────────┬───────────────┘  │
│           │                            │                   │
│           │  HubContext<IHabitHub>    │                   │
│           │◄───────────────────────────┘                   │
│           │                                                │
└───────────┼────────────────────────────────────────────────┘
            │
   ┌────────┴────────┐
   │   WebSocket      │
   │   /hubs/habits   │
   └────────┬────────┘
            │
┌───────────┼────────────────────────────────────────────────┐
│           │                    Clients                        │
│  ┌────────┴────────┐    ┌─────────────────────────────┐  │
│  │   Web App       │    │   Mobile App (future)        │  │
│  │   (useSignalR)   │    │                              │  │
│  │                 │    │                              │  │
│  │  HabitLogUpdated│    │  HabitLogUpdated             │  │
│  │  HabitUpdated   │    │  HabitUpdated                │  │
│  └─────────────────┘    └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Hub Configuration

### Endpoint
```
ws://localhost:5224/hubs/habits?access_token={jwt_token}
```

### Authentication
SignalR connections authenticate via the `access_token` query parameter. The JWT bearer token is extracted and validated using the same middleware as HTTP requests.

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

### User Identification
Custom `CustomUserIdProvider` extracts the user ID from the JWT `sub` claim, ensuring events are broadcast only to the authenticated user.

### CORS
SignalR endpoints require the `Frontend` CORS policy:

```csharp
app.MapHub<HabitHub>("/hubs/habits")
    .RequireCors("Frontend");
```

## Events

### HabitLogUpdated
Broadcast when a habit log is toggled (completed or uncompleted).

**Payload:**
```json
{
  "habitId": "550e8400-e29b-41d4-a716-446655440000",
  "date": "2024-06-01",
  "completed": true
}
```

**Usage:**
- Web dashboard updates the checkmark state
- Analytics recalculates completion rates
- Mobile app (future) syncs completion status

### HabitUpdated
Broadcast when a habit is created, updated, or deleted.

**Payload:**
```json
{
  "habitId": "550e8400-e29b-41d4-a716-446655440000",
  "action": "created",
  "habit": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
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
    "habitLogs": []
  }
}
```

**Actions:**
- `created` - New habit added
- `updated` - Habit modified (name, schedule, active status)
- `deleted` - Habit removed

**Usage:**
- Web dashboard adds/removes/updates habit list items
- Habits page refreshes without manual reload
- Mobile app (future) syncs habit list

## Service Implementation

### HabitRealtimeService
Scoped service that wraps the SignalR hub context:

```csharp
public class HabitRealtimeService(IHubContext<HabitHub> hubContext) : IHabitRealtimeService
{
    public async Task BroadcastHabitLogUpdatedAsync(Guid userId, HabitLogUpdatedEvent payload)
    {
        await _hubContext.Clients
            .User(userId.ToString())
            .SendAsync("HabitLogUpdated", payload);
    }

    public async Task BroadcastHabitUpdatedAsync(Guid userId, HabitUpdatedEvent payload)
    {
        await _hubContext.Clients
            .User(userId.ToString())
            .SendAsync("HabitUpdated", payload);
    }
}
```

### Integration with CQRS Handlers
MediatR handlers inject `IHabitRealtimeService` and broadcast events after successful operations:

```csharp
// After creating/updating/deleting a habit
await _realtimeService.BroadcastHabitUpdatedAsync(userId, new HabitUpdatedEvent(...));

// After toggling a habit log
await _realtimeService.BroadcastHabitLogUpdatedAsync(userId, new HabitLogUpdatedEvent(...));
```

## Web Frontend Integration

### useSignalR Hook

```typescript
const useSignalR = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const conn = new HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    const start = async () => {
      try {
        await conn.start();
        setConnection(conn);
        setConnected(true);
      } catch (err) {
        console.error("SignalR connection failed:", err);
        setConnected(false);
      }
    };

    start();

    conn.onreconnecting(() => setConnected(false));
    conn.onreconnected(() => setConnected(true));
    conn.onclose(() => setConnected(false));

    return () => {
      conn.stop();
    };
  }, []);

  // Event subscriptions
  const onHabitLogUpdated = useCallback((callback) => {
    connection?.on("HabitLogUpdated", callback);
    return () => connection?.off("HabitLogUpdated", callback);
  }, [connection]);

  const onHabitUpdated = useCallback((callback) => {
    connection?.on("HabitUpdated", callback);
    return () => connection?.off("HabitUpdated", callback);
  }, [connection]);

  return { connected, onHabitLogUpdated, onHabitUpdated };
};
```

### Usage in Dashboard

```typescript
const { onHabitLogUpdated, onHabitUpdated } = useSignalR();

useEffect(() => {
  const unsubscribe = onHabitLogUpdated((payload) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== payload.habitId) return h;
      // Update habit logs
      const logs = [...h.habitLogs];
      // Add or remove log based on completed
      return { ...h, habitLogs: logs };
    }));
  });
  return unsubscribe;
}, [onHabitLogUpdated, setHabits]);

useEffect(() => {
  const unsubscribe = onHabitUpdated((payload) => {
    setHabits(prev => {
      if (payload.action === "created") {
        return [payload.habit, ...prev];
      }
      if (payload.action === "updated") {
        return prev.map(h => h.id === payload.habitId ? payload.habit : h);
      }
      if (payload.action === "deleted") {
        return prev.filter(h => h.id !== payload.habitId);
      }
      return prev;
    });
  });
  return unsubscribe;
}, [onHabitUpdated, setHabits]);
```

## Connection Lifecycle

1. **Authentication**: Client connects with JWT token
2. **Handshake**: Server validates token and assigns user ID
3. **Active**: Connection is open, events can flow
4. **Reconnect**: Automatic reconnect with exponential backoff (default SignalR behavior)
5. **Disconnect**: Connection closed, cleanup performed

## Error Handling

- **Connection failure**: Logged to console, `connected` state set to false
- **Authentication failure**: Connection rejected, no events received
- **Reconnection**: UI shows disconnected state until reconnected
- **Message errors**: Logged, do not break connection

## Future Enhancements

- **Group notifications**: Allow family/team sharing of habit progress
- **Push notifications**: Server-sent events for mobile push
- **Typing indicators**: Real-time collaboration on shared habits
- **Presence**: Show which devices are connected

---

## Related Documentation

- [architecture.md](architecture.md) - System architecture
- [api-reference.md](api-reference.md) - API endpoints
- [user-auth.md](user-auth.md) - Authentication details
