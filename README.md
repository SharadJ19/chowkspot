<div align="center">

<img src="docs/assets/readme-banner.png" alt="ChowkSpot Social Preview" width="45%" />

### Direct, Zero-Commission Local Service Marketplace

[![Project Status: Active Development](https://img.shields.io/badge/Status-Active_Development-059669?style=for-the-badge&logo=git&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5.2-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Views](https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2FSharadJ19%2Fchowkspot.json&style=for-the-badge&label=VIEWS&color=3178C6)](https://hits.dwyl.com/SharadJ19/chowkspot)

_An open, peer-to-peer platform connecting residents directly with local skilled professionals—eliminating middleman platform fees, delays, and discovery friction._

<br/>

[![🚀 Explore Live App](https://img.shields.io/badge/🚀_LAUNCH_CHOWKSPOT-LIVE_APP-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://chowkspot.vercel.app/)

<br/>

[The Backstory](#-the-personal-story) • [Core Problem](#-the-problem) • [The Solution](#-the-solution) • [Demo Accounts](#-demo-accounts-pre-verified--ready-to-test) • [Tech Stack](#-tech-stack-matrix) • [Deep-Dive Documentation](#-deep-dive-documentation)

</div>

## 💡 The Personal Story

> _"It was Diwali week last year. My parents were trying to get our home ready—the living room needed fresh paint, a leaking tap in the kitchen was getting worse, and we couldn't even find a reliable milkman or a carpenter to fix a jammed door."_

I watched my mom and dad spend days calling relatives, asking neighbors, and pacing down to the local marketplace (_chowk_) to find available workers. Commercial platforms either charged 20–30% commissions, required recurring subscriptions that independent tradespeople could not afford, or simply did not cover our town.

The skilled workers were available, and families needed them—but there was no direct, friction-free way to connect. **ChowkSpot** was created to act as a digital _chowk_ where residents and local pros connect with **0% platform cuts and zero middleman interference**.

## 🛑 The Problem

1. **Discovery Friction**: New residents and families during seasonal peaks struggle to find trustworthy tradespeople without word-of-mouth networks.
2. **Aggregator Commission Inflation**: Intermediary apps take substantial cuts, squeezing worker earnings and increasing client bills.
3. **Opaque Scheduling & Pricing**: Phone tag and informal agreements lead to missed appointments, unnegotiated rates, and broken accountability loops.

## ✨ The Solution

**ChowkSpot** operates as an open, public utility:

- 🤝 **Direct P2P Settlement**: Zero platform fees. Customers pay workers directly via deep-linked `upi://pay` URIs, dynamically rendered QR codes, or cash.
- ⚡ **Transactional Booking State Machine**: Deterministic scheduling flow (`PENDING` → `ACCEPTED` / `REJECTED` / `COUNTER_PROPOSED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED`) protected by PostgreSQL `FOR UPDATE` row locks and WebSocket updates.
- 🔍 **Fuzzy Regional Search**: Trigram indexing (`pg_trgm`) and array containment matching across 85+ regional hubs in North India, accommodating typos and local queries.
- 🛡️ **Verified Review Loop**: Ratings (1–5) and feedback can only be published against confirmed `COMPLETED` booking records, atomically recalculating worker averages.

## 🔑 Demo Accounts (Pre-Verified & Ready to Test)

The database seed provides pre-verified accounts across all three user roles:

- **👑 Administrator Account**
  - **Email**: `sharad@admin.com`
  - **Password**: `Password123!`
  - **Role**: `ADMIN` (Access to Platform Command Center, user directory moderation, and platform metrics)

- **🛠️ Skilled Worker Account**
  - **Email**: `smarth.sharda@chowkspot.com`
  - **Password**: `Password123!`
  - **Role**: `WORKER` (Electrician profile with active regional hubs, real-time incoming job alerts, and state management)

- **👤 Customer Account**
  - **Email**: `user@test.com`
  - **Password**: `Password123!`
  - **Role**: `USER` (Customer profile to discover workers, submit booking requests, initiate UPI settlements, and leave verified reviews)

## 🛠️ Tech Stack Matrix

| Layer             | Technology                     | Highlights                                                           |
| :---------------- | :----------------------------- | :------------------------------------------------------------------- |
| **Frontend**      | React 19, TypeScript, Vite 8   | CSS Modules, Custom Design Tokens, TanStack Query v5, Sonner         |
| **Backend**       | Node.js, Express 5, TypeScript | Modular Architecture, Zod 4 Validation, Argon2 Password Hashing      |
| **Database**      | PostgreSQL, Drizzle ORM        | Pessimistic Locking (`FOR UPDATE`), GIN Trigram Indexing (`pg_trgm`) |
| **Real-Time**     | Socket.io 4                    | JWT-Authenticated Handshakes, Isolated Channels (`user:<userId>`)    |
| **Storage & Pay** | Cloudinary, Deep-Linked UPI    | Stateless direct browser media uploads, `upi://pay` URI engine       |

## 📚 Deep-Dive Documentation

- 🎨 [**Frontend Architecture Guide (`docs/FRONTEND.md`)**](./docs/FRONTEND.md)
- ⚙️ [**Backend Architecture Guide (`docs/BACKEND.md`)**](./docs/BACKEND.md)
- 🗄️ [**Database & Concurrency Guide (`docs/DATABASE.md`)**](./docs/DATABASE.md)
- 🚀 [**Roadmap & Expansions (`docs/ROADMAP.md`)**](./docs/ROADMAP.md)
- 💻 [**Local Setup Guide (`docs/SETUP.md`)**](./docs/SETUP.md)

<div align="center">
  <sub>Built with ❤️ to empower independent local tradesmen and simplify everyday life.</sub>
</div>
