# Web Frontend Architecture

## Overview

The Habitual web application is a Next.js 16 app built with React 19, Chakra UI v3, and TypeScript. It provides the primary interface for habit tracking, analytics, and account management.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 App                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Pages Router (src/pages/)              │  │
│  │  • /          → Landing page                        │  │
│  │  • /login     → Authentication                     │  │
│  │  • /register  → Registration                     │  │
│  │  • /dashboard → Habit tracking & weekly view       │  │
│  │  • /habits    → Habit management                  │  │
│  │  • /analytics → Deep analytics & heatmaps         │  │
│  │  • /profile   → User profile & password            │  │
│  └─────────────────────────────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │              Components (src/components/)           │  │
│  │  • Navbar (UserNavbar, MarketingNavbar, LoginNavbar) │  │
│  │  • CreateHabitDialog                                 │  │
│  │  • EditHabitDialog                                   │  │
│  │  • MiniCalendar                                      │  │
│  │  • Footer                                            │  │
│  │  • ColorModeToggle                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │              Hooks (src/hooks/)                       │  │
│  │  • useAuthenticateUser  → Auth & user state          │  │
│  │  • useAxiosRequest      → Axios with interceptors    │  │
│  │  • useHabits            → Habit data fetching        │  │
│  │  • useSignalR           → Real-time connection        │  │
│  │  • useDebounce          → Search debounce             │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │              Libraries (src/lib/)                     │  │
│  │  • analytics.ts  → Streaks, trends, heatmaps       │  │
│  │  • schedule.ts   → Schedule logic & labels           │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │              Types (src/types/)                       │  │
│  │  • user.ts  → User type definition                   │  │
│  │  • habit.ts → Habit, HabitLog, HabitSchedule       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │              API (src/api/)                           │  │
│  │  • axios.ts  → Axios instance with base URL          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (Pages Router) |
| React | React 19 |
| UI Library | Chakra UI v3 |
| Styling | Tailwind CSS v4 |
| Icons | react-icons (Lucide) |
| HTTP | axios |
| Real-time | @microsoft/signalr |
| Themes | next-themes |
| Fonts | Inter (Google Fonts) |
| Notifications | react-toastify |

## Page Structure

### Landing Page (`/`)
- Marketing surface with hero, features, CTA
- Uses `MarketingNavbar`

### Authentication (`/login`, `/register`)
- Email/password login and registration
- Token storage in sessionStorage
- Auto-redirect authenticated users

### Dashboard (`/dashboard`)
- **Left Sidebar**: Weekly calendar strip with day selection
- **Main Content**: 
  - Greeting with user name
  - Selected date display
  - Progress ring (completion rate)
  - Habit list with toggle buttons
  - Weekly insights (best performer, needs attention)
  - Monthly grid view
  - Consistency score
  - Deep analytics link

### Habits (`/habits`)
- Habit list with search
- Active/paused status toggle
- Edit and delete actions
- Create new habit dialog

### Analytics (`/analytics`)
- Global stats pills (total habits, logs, streaks)
- Weekly activity bar chart
- Activity heatmap (90 days)
- Habit rankings by streak
- Mini calendar

### Profile (`/profile`)
- Profile information editing (name, email, phone, DOB)
- Password change (current + new password)
- Account deletion with confirmation
- Member since card

## Key Components

### UserNavbar
Sticky top navigation with:
- Logo and brand name
- Navigation links (Dashboard, Habits, Deep Analytics with PRO badge)
- Time display
- Theme toggle (light/dark)
- User dropdown (Update Profile, Upgrade to Pro, Logout)

### CreateHabitDialog / EditHabitDialog
Modal dialogs for habit CRUD:
- Name and description inputs
- Schedule type selector (Daily, Weekdays, Weekends, Custom, Interval)
- Custom day picker (checkboxes)
- Interval input (days)
- Active status toggle

## Custom Hooks

### useAuthenticateUser
- Fetches user on mount via `GET /api/user/me`
- Handles unauthenticated redirects
- Provides `logout` function
- Dependency: `axiosRequest`, `pathname`, `router`

### useAxiosRequest
- Configured axios instance with interceptors
- **Request interceptor**: Adds Bearer token from sessionStorage
- **Response interceptor**: 
  - Handles backend errors (success=false)
  - Auto-toasts success messages for non-GET requests
  - Handles 401: attempts token refresh, redirects to login on failure
- **Cleanup**: Ejects interceptors on unmount

### useHabits
- Fetches habits via `GET /api/Habit/get`
- Optional search parameter
- Provides `habits`, `loading`, `error`, `refetch`

### useSignalR
- Connects to `/hubs/habits` with JWT token
- Provides `connected` status
- Event subscription: `onHabitLogUpdated`, `onHabitUpdated`
- Auto-reconnect with `withAutomaticReconnect`

## Design System

### Colors
| Role | Light | Dark |
|------|-------|------|
| Primary | #6366F1 | #818CF8 |
| Success | #10B981 | #34D399 |
| Accent | #F59E0B | #FBBF24 |
| Background | #FAFAFF | #0B0F1A |
| Surface | #FFFFFF | #111827 |
| Text Primary | #0F172A | #F8FAFC |
| Text Secondary | #64748B | #94A3B8 |
| Border | rgba(148,163,184,0.20) | rgba(148,163,184,0.14) |

### Typography
- **Font**: Inter (variable weight)
- **Display**: 3rem / 800 weight / -0.04em
- **H1**: 2.25rem / 700 weight / -0.03em
- **H2**: 1.5rem / 600 weight / -0.02em
- **Body**: 1rem / 400 weight
- **Caption**: 0.875rem / 500 weight
- **Micro**: 0.75rem / 600 weight (uppercase labels)

### Layout
- Max content width: 1200px
- Sticky navbar with backdrop blur
- Two-column layout on desktop (dashboard, profile)
- Single column on mobile
- Responsive spacing via Chakra breakpoints

### Component Patterns
- **Inputs**: `borderRadius="2xl"`, focus ring with primary color
- **Buttons**: `borderRadius="full"`, pill shape
- **Cards**: `borderRadius="2xl"`, 1px border, subtle shadow
- **Status**: Color-coded badges (success green, warning amber)
- **Danger Zone**: Red border, red background tint

## Authentication Flow

```
1. Page loads → useAuthenticateUser checks session
2. No token → redirect to /login
3. Token exists → fetch user profile
4. All API requests → useAxiosRequest attaches Bearer token
5. 401 response → interceptor attempts refresh
6. Refresh fails → redirect to /login, clear session
7. Logout → call backend, clear sessionStorage, redirect
```

## State Management

No global state library (Redux/Zustand). State is managed via:
- **React useState**: Local component state
- **Custom hooks**: Shared data (useHabits, useAuthenticateUser)
- **SignalR**: Real-time updates pushed from backend
- **Axios interceptors**: Centralized error handling and token refresh

## Performance

- **Code splitting**: Next.js automatic page splitting
- **Lazy loading**: Below-fold components (analytics, mini calendar)
- **Image optimization**: Next.js Image component
- **CSS**: Tailwind with PurgeCSS (only used styles)
- **Reduced motion**: Respects `prefers-reduced-motion`

---

## Related Documentation

- [architecture.md](architecture.md) - System architecture
- [api-reference.md](api-reference.md) - API endpoints
- [signalr-realtime.md](signalr-realtime.md) - Real-time updates
