# ⚙️ ChowkSpot — Backend Architecture Documentation

[← Back to Main README](../README.md)

## 📌 Architecture Overview

The **ChowkSpot** backend is engineered as a production-grade **Layered Modular Monolith** using **Node.js**, **Express**, and **TypeScript**. It follows strict separation of concerns across Controllers, Services, Drizzle Schemas, and Middleware pipelines.

## 📂 Directory Structure

```text
src/
├── app.ts                  # Express app setup, rate limiters & security middleware
├── server.ts               # HTTP server & Socket.io engine initialization
├── config/
│   ├── env.ts              # Zod type-safe environment variable parser
│   ├── database.ts         # Drizzle ORM client & connection pool
│   └── constants.ts        # Global status codes, roles & rate-limit thresholds
├── db/
│   ├── schema/             # Drizzle table schemas (users, workers, bookings, reviews)
│   └── seeds/              # Seed scripts for cities, categories, workers, and reviews
├── middlewares/
│   ├── auth.middleware.ts  # JWT Bearer token authentication & RBAC guards
│   ├── validate.ts         # Zod request body validation middleware
│   ├── rateLimiter.ts      # Express rate limiters (Global + Strict Auth)
│   ├── sanitize.ts         # XSS input sanitization middleware
│   └── errorHandler.ts     # Global error catching & standardized response wrapper
├── modules/                # Domain Logic Modules
│   ├── auth/               # Controller, Service, Router, Schemas
│   ├── users/              # Profile fetching & updates
│   ├── workers/            # Worker profile setup & trigram search
│   ├── bookings/           # State machine lifecycle management
│   └── reviews/            # Verified review creation & score recalculation
├── sockets/
│   ├── socket.engine.ts    # Socket.io auth handshake & private room channels
│   └── socket.handlers.ts  # Client ping & room event listeners
└── utils/
    ├── jwt.ts              # Access (15m) & Refresh (7d) token signers
    ├── password.ts         # Argon2 secure password hashing
    └── ApiError.ts         # Operational error class

```

## 🔐 Authentication & Dual-Token Security

1. **Access Tokens**: Short-lived (15 minutes), signed with `JWT_ACCESS_SECRET`. Transmitted in the HTTP `Authorization: Bearer <TOKEN>` header.
2. **Refresh Tokens**: Long-lived (7 days), signed with `JWT_REFRESH_SECRET`. Stored strictly in an `httpOnly`, `SameSite=Strict`, `Secure` cookie.
3. **Revocation List**: Hashed refresh tokens are stored in the PostgreSQL `users.refresh_token_hash` column using Argon2. Logging out or refreshing tokens rotates the hash, revoking old sessions immediately.

## 🛡️ Input Validation & Security Layers

- **Zod Schemas**: Every incoming request payload is validated via `validateRequest(schema)` middleware before hitting controller logic.
- **XSS Sanitization**: Custom middleware recursively strips HTML tags and malicious script vectors from request bodies using `sanitize-html`.
- **Rate Limiting**:
- Global API Limiter: 100 requests / 15 minutes.
- Auth Route Limiter: 10 attempts / 15 minutes (mitigates brute-force attacks).

- **Payload Limits**: Strict 10KB payload body limits to prevent memory exhaustion DoS attacks.

## 📡 Real-Time Socket.io Engine

```
[ Client Connects ] ──(Handshake with Access Token)──► [ Socket Engine Middleware ]
                                                                │
                                                    (Joins Room: "user:<userId>")
                                                                │
[ Booking Status Updated ] ──► [ sendRealtimeNotification() ] ──┴─► Emits Event to Target Room

```

When a customer or worker updates a booking state, `sendRealtimeNotification()` routes target events (`NEW_BOOKING_REQUEST`, `BOOKING_STATUS_UPDATED`) to the specific isolated user room without broadcasting globally.
