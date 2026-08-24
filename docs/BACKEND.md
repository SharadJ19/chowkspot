# ⚙️ ChowkSpot — Backend Architecture Documentation

[← Back to Main README](../README.md)

## 📌 Architecture Overview

The **ChowkSpot** backend is built as a **Layered Modular Architecture** using **Node.js**, **Express 5**, and **TypeScript**. Business logic is grouped into domain modules (`auth`, `users`, `workers`, `bookings`, `reviews`, `admin`), with clear boundaries between controllers, services, database schemas, and middleware pipelines.

```plaintext
chowkspot-backend/
├── src/
│   ├── app.ts                  # Express app setup, rate limiters & security middleware
│   ├── server.ts               # HTTP server & Socket.io engine initialization
│   ├── config/
│   │   ├── env.ts              # Zod type-safe environment variable parser
│   │   ├── database.ts         # Drizzle ORM client & postgres connection
│   │   ├── cors.ts             # Origin & credentials configuration
│   │   └── constants.ts        # App roles, rate-limits, booking statuses & HTTP codes
│   ├── db/
│   │   ├── index.ts            # Database instance & schema exports
│   │   ├── schema/             # Modular Drizzle table definitions
│   │   ├── migrations/         # Auto-generated Drizzle SQL migrations
│   │   └── seeds/              # Deterministic database seeding scripts
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # JWT Bearer token verification & RBAC authorization
│   │   ├── validate.ts         # Zod request body validation middleware
│   │   ├── rateLimiter.ts      # Global and auth-specific rate limiting
│   │   ├── sanitize.ts         # XSS sanitization via sanitize-html
│   │   └── errorHandler.ts     # Global error catching & response formatting
│   ├── modules/                # Domain-Bounded Feature Modules
│   │   ├── auth/               # Registration, login, token refresh, verification
│   │   ├── users/              # User profile querying, updates & account deletion
│   │   ├── workers/            # Worker directory, profile management, fuzzy search
│   │   ├── bookings/           # State machine lifecycle & pessimistic row updates
│   │   ├── reviews/            # Verified customer review submission & recalculation
│   │   └── admin/              # Moderation, directory search & platform metrics
│   ├── sockets/
│   │   ├── socket.engine.ts    # Socket.io auth handshake & private room routing
│   │   └── socket.handlers.ts  # Real-time event listeners & dispatchers
│   └── utils/
│       ├── jwt.ts              # Access (15m) & Refresh (7d) signing utilities
│       ├── password.ts         # Argon2 secure password hashing
│       ├── mailer.ts           # Nodemailer transport for transactional emails
│       ├── logger.ts           # Pino JSON / pretty logger
│       └── ApiError.ts         # Standard operational error class
```

## 🔐 Dual-Token Authentication Subsystem

1. **Access Tokens**: Short-lived (15 minutes), signed with `JWT_ACCESS_SECRET`. Transmitted in HTTP request headers via `Authorization: Bearer <token>`.
2. **Refresh Tokens**: Long-lived (7 days), signed with `JWT_REFRESH_SECRET`. Stored strictly in an `httpOnly`, `SameSite=Strict` (or `SameSite=None` in cross-site production), `Secure` cookie named `jid`.
3. **Session Revocation**: Refresh tokens are hashed using Argon2 and saved in PostgreSQL (`users.refresh_token_hash`). Logout, password reset, or token rotation immediately invalidates prior sessions.

## 🛡️ Input Validation & Security Layers

- **Zod 4 Pipelines**: Every mutation endpoint validates incoming data with `validateRequest(schema)` before passing control to the service layer.
- **XSS Sanitization**: Recursive string sanitization strips HTML and script payloads across `req.body` using `sanitize-html`.
- **Payload Limits**: Strict `10kb` body parsing limits prevent memory exhaustion and buffer overflow vectors.
- **Tiered Rate Limiting**:
  - Global API Limiter: 100 requests / 15 minutes.
  - Auth Limiter: 10 attempts / 15 minutes on `/api/auth/login` and `/api/auth/register`.

## 📡 Real-Time Socket.io Engine

```
[ Client Connects ]
        │
        │ (Handshake with Bearer Token)
        ▼
[ Socket Engine Middleware ]
        │
        │ (Joins Room: "user:")
        │
        ▼
[ Booking Status Updated ]
        │
        ▼
[ sendRealtimeNotification() ]
        │
        └──► Dispatches Event to Target Room
```

When a booking changes state, `sendRealtimeNotification()` routes updates (`NEW_BOOKING_REQUEST`, `BOOKING_STATUS_UPDATED`) specifically to `user:<targetUserId>`, avoiding public channel broadcasts.
