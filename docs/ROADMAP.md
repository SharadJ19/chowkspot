# 🚀 ChowkSpot — Product Roadmap & Expansion Plans

[← Back to Main README](../README.md)

This document tracks active development tasks, completed milestones, and upcoming feature work for the **ChowkSpot** platform.

## 📌 Development Status Checklist

### Phase 1: Core Foundation & Auth

- [x] Dual-Token Authentication Subsystem (Bearer Access Token + httpOnly Refresh Cookie)
- [x] Argon2 Password Hashing & Refresh Token Revocation
- [x] Role-Based Access Control (`USER`, `WORKER`, `ADMIN`)
- [x] Zod Input Schema Pipeline & XSS Sanitization
- [x] Email Verification & Password Reset Flows via Nodemailer

### Phase 2: Worker Marketplace & Discovery

- [x] Multi-city regional indexing (85+ North India & Tricity locations)
- [x] Broad category coverage across 80+ skilled service domains
- [x] GIN Trigram fuzzy category search (`pg_trgm`)
- [x] Live Worker Availability Toggle (`isAvailable`)
- [x] Search filter debouncing, range sliders & mobile drawers

### Phase 3: Booking State Machine & Real-Time

- [x] Deterministic Booking State Machine (`PENDING` → `ACCEPTED` / `REJECTED` / `COUNTER_PROPOSED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED`)
- [x] Pessimistic Row Locking (`FOR UPDATE`) during state mutations
- [x] Socket.io Private Channel Event Notifications (`user:<userId>`)
- [x] Direct Peer-to-Peer UPI Deep-Linking Engine (`upi://pay`) & Dynamic QR Generation
- [x] Verified Customer Review Engine with atomic score recalculation
- [x] Platform Command Center & Admin Directory Moderation

## 🔮 Planned Architectural Expansions

```

                           [ PLANNED ROADMAP ]
                                    │
                                    │
                                    │
┌───────────────────┬───────────────┴───────────────┬───────────────────┐
▼                   ▼                               ▼                   ▼
┌─────────┐     ┌──────────────────┐           ┌──────────────────┐    ┌───────────┐
│ PostGIS │     │ In-App Messaging │           │ WebRTC Calling   │    │ Worker    │
│ Mapping │     │ (Socket.io Chat) │           │ (In-App Voice)   │    │ KYC Engine│
└─────────┘     └──────────────────┘           └──────────────────┘    └───────────┘

```

### 1. 🗺️ PostGIS Geospatial Radius Matching

- **Goal**: Augment array-based city matching with precise coordinate radius calculations using the PostgreSQL `PostGIS` extension.
- **Impact**: Enables interactive map views showing available workers within a 5–10 km radius.

### 2. 💬 In-App Direct Chat & Media Attachments

- **Goal**: Implement real-time text chat over Socket.io channels scoped to `booking:<id>`.
- **Impact**: Allows customers and workers to share diagnostic site photos without exposing phone numbers upfront.

### 3. 📞 In-App WebRTC Audio Calling

- **Goal**: Integrate WebRTC peer-to-peer audio calling between consumers and workers.
- **Impact**: Provides free, private voice consultations directly inside the browser.

### 4. 🪪 Worker Identity KYC & Verification Badges

- **Goal**: Add administrative document review flows for official identification verification.
- **Impact**: Surfaces "Verified Pro" trust badges on worker profile cards.

### 5. 🔔 Web Push Notifications (Service Workers)

- **Goal**: Integrate the Web Push API for background device notifications.
- **Impact**: Delivers instant alerts for incoming booking requests when the browser tab is closed.
