# 🚀 ChowkSpot — Product Roadmap & Expansion Plans

[← Back to Main README](../README.md)

This document tracks active development tasks, planned architectural expansions, and upcoming features as **ChowkSpot** evolves.

## 📌 Development Status Checklist

### Phase 1: Core Foundation & Auth

- [x] Dual-Token Authentication Subsystem (Bearer Access Token + httpOnly Refresh Cookie)
- [x] Argon2 Password Hashing & Refresh Token Revocation
- [x] Role-Based Access Control (USER, WORKER, ADMIN)
- [x] Zod Input Schema Pipeline & XSS Sanitization

### Phase 2: Worker Marketplace & Discovery

- [x] Multi-city regional worker indexing (80+ Tricity & Himachal Pradesh locations)
- [x] Flat category structure across 80+ skilled service domains
- [x] GIN Trigram fuzzy category search (`pg_trgm`)
- [x] Live Worker Availability Toggle (`isAvailable`)

### Phase 3: Booking State Machine & Real-Time

- [x] Deterministic Booking State Machine (Pending → Accepted → In-Progress → Completed)
- [x] Pessimistic Row Locking (`FOR UPDATE`) during state mutations
- [x] Socket.io Private Channel Event Notifications
- [x] Direct Peer-to-Peer UPI Deep-Linking Engine (`upi://pay`)
- [x] Verified Customer Review Engine with atomic rating score recalculation

## 🔮 Planned Architectural Expansions

```
                            [ PLANNED ROADMAP ]
                                     │
 ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
 ▼                   ▼                               ▼                   ▼

┌─────────┐     ┌──────────────────┐           ┌──────────────────┐    ┌───────────┐
│ PostGIS │     │ In-App Messaging │           │ WebRTC Calling   │    │ Worker    │
│ Mapping │     │ (Socket.io Chat) │           │ (In-App Voice)   │    │ KYC Engine│
└─────────┘     └──────────────────┘           └──────────────────┘    └───────────┘

```

### 1. 🗺️ PostGIS Geospatial Distance Matching

- **Goal**: Replace array-based city searching with exact lat/long radius matching using the PostgreSQL `PostGIS` extension.
- **Impact**: Allows customers to view nearby active workers within a 5km–10km radius on an interactive map.

### 2. 💬 In-App Direct Chat & Attachment Sharing

- **Goal**: Add real-time text chat using Socket.io room channels (`booking:<id>`).
- **Impact**: Allows users to share photos of work sites or leaking pipes before booking acceptance without revealing personal phone numbers immediately.

### 3. 📞 In-App WebRTC Voice Audio Calling

- **Goal**: Embed WebRTC peer-to-peer audio calling between consumers and workers.
- **Impact**: Eliminates telephone call charges and preserves contact privacy during initial task consultations.

### 4. 🪪 Worker Identity KYC & Verification Badges

- **Goal**: Add a `worker_kyc_docs` schema table supporting document submission (Govt ID / Aadhaar verification).
- **Impact**: Displays "Verified Pro" trust badges on worker cards to elevate consumer confidence.

### 5. 🔔 Web Push Notifications (PWA Integration)

- **Goal**: Integrate Web Push API (Service Workers) for native mobile background alerts.
- **Impact**: Ensures workers receive instant audio alerts for incoming job requests even when the browser tab is closed.

## 🐛 Bug Fixes & Refinements Backlog

- [ ] Add unit test coverage for booking state machine edge cases using Vitest.
- [ ] Implement virtualized list scrolling (`react-window`) for marketplace search results with 500+ workers.
- [ ] Add automated rate-limit retry handling on frontend `fetchClient`.
