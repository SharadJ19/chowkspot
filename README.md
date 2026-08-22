<div align="center">

<img src="docs/assets/readme-banner.png" alt="ChowkSpot Social Preview" width="45%" />

### Direct, Zero-Commission Local Service Marketplace

[![Project Status: Active Development](https://img.shields.io/badge/Status-Active_Development-059669?style=for-the-badge&logo=git&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#)

_An open, peer-to-peer platform connecting residents directly with local skilled professionals—eliminating middleman platform fees, delays, and discovery friction._

<br/>

[![🚀 Explore Live App](https://img.shields.io/badge/🚀_LAUNCH_CHOWKSPOT-LIVE_APP-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://chowkspot.vercel.app/)

<br/>

[The Backstory](#-the-personal-story) • [Core Problem](#-the-problem) • [The Solution](#-the-solution) • [Demo Accounts](#-demo-accounts-pre-verified--ready-to-test) • [Tech Stack](#-tech-stack) • [Deep-Dive Documentation](#-deep-dive-documentation)

</div>

## 💡 The Personal Story

> _"It was Diwali week last year. My parents were trying to get our home ready—the living room needed fresh paint, a leaking tap in the kitchen was getting worse, and we couldn't even find a reliable milkman or a carpenter to fix a jammed door."_

I watched my mom and dad spend days calling relatives, asking neighbors, and pacing down to the local marketplace (_chowk_) to find available workers. The commercial apps either charged heavy commissions, required subscription fees that independent local tradesmen couldn't afford, or simply didn't serve our town effectively.

The skilled workers were out there, and families needed them—but there was no direct, friction-free way to connect. That’s when the idea for **ChowkSpot** was born: a digital _chowk_ where residents and local pros meet directly with **0% platform cuts and zero middleman interference**.

## 🛑 The Problem

1. **Discovery Friction**: New residents or families during peak seasonal rushes struggle to find trusted local tradespeople without word-of-mouth contacts.
2. **Heavy Middleman Commissions**: Existing aggregate apps charge up to 20–30% commissions, forcing independent tradesmen off the platforms or inflating prices for customers.
3. **Opaque Scheduling & Pricing**: Lack of direct real-time communication leads to endless phone tag, missed time slots, and unnegotiated rates.

## ✨ The Solution

**ChowkSpot** operates as a free, open, public utility:

- 🤝 **Direct P2P Settlement**: 100% direct payments via deep-linked UPI URIs or cash. Zero escrow holds, zero platform cuts.
- ⚡ **Real-Time Booking State Machine**: Transactional scheduling workflow (Pending → Accepted → In-Progress → Completed) with real-time Socket.io updates and counter-offer time negotiations.
- 🔍 **Fuzzy Local Discovery**: High-performance PostgreSQL trigram search (`pg_trgm`) matching worker categories and multi-city service belts, even with typos.
- 🛡️ **Verified Review Loop**: Ratings can only be posted for verified, completed booking records, triggering atomic score updates.

## 🔑 Demo Accounts (Pre-Verified & Ready to Test)

To explore and evaluate all core marketplace features instantly without being blocked by email verification, you can log in using any of these pre-verified accounts manually configured in the database:

- **👑 Administrator Account**
  - **Email**: `sharad@admin.com`
  - **Password**: `Password123!`
  - **Role**: `ADMIN` (Full access to Platform Command Center, user directory moderation, and platform metrics)

- **🛠️ Skilled Worker Account**
  - **Email**: `smarth.sharda@chowkspot.com`
  - **Password**: `Password123!`
  - **Role**: `WORKER` (Electrician profile, active in Tricity/Parwanoo, receives real-time job requests and handles booking state changes)

- **👤 Customer Account**
  - **Email**: `user@test.com`
  - **Password**: `Password123!`
  - **Role**: `USER` (Customer profile capable of discovering workers, submitting booking requests, making direct UPI payments, and leaving verified reviews)

## 🛠️ Tech Stack Matrix

| Area            | Technology                   | Highlights                                                    |
| :-------------- | :--------------------------- | :------------------------------------------------------------ |
| **Frontend**    | React 19, TypeScript, Vite   | CSS Modules, Custom Design Tokens, TanStack Query v5          |
| **Backend**     | Node.js, Express, TypeScript | Modular Monolith Architecture, Zod Validation, Argon2         |
| **Database**    | PostgreSQL, Drizzle ORM      | Pessimistic Locking (`FOR UPDATE`), GIN Trigram Indexing      |
| **Real-Time**   | Socket.io                    | JWT-Authenticated WebSockets, Isolated Channels (`user:<id>`) |
| **Media & Pay** | Cloudinary, Deep-Linked UPI  | Stateless direct browser uploads, `upi://pay` URI engine      |

## 📚 Deep-Dive Documentation

For technical recruiters, engineering managers, and contributors reviewing the architecture:

- 🎨 [**Frontend Architecture Guide (`docs/FRONTEND.md`)**](./docs/FRONTEND.md)
  - _CSS Modules Design System, TanStack Query strategy, Form handling, and Component Structure._
- ⚙️ [**Backend Architecture Guide (`docs/BACKEND.md`)**](./docs/BACKEND.md)
  - _Modular Monolith boundaries, Controllers, Services, Zod validation, and Argon2 Auth pipelines._
- 🗄️ [**Database & Concurrency Guide (`docs/DATABASE.md`)**](./docs/DATABASE.md)
  - _Drizzle Schemas, Trigram Search Indexing, Deterministic State Machine, and `FOR UPDATE` locking._
- 🚀 [**Roadmap & Future Expansion (`docs/ROADMAP.md`)**](./docs/ROADMAP.md)
  - _Active development tasks, planned WebRTC calling, In-App Chat, PostGIS maps, and KYC pipelines._

## 🚦 Project Status

> ⚠️ **Notice**: **ChowkSpot** is currently under **Active Development**.
> Core authentication, worker discovery, state machine booking lifecycles, and real-time Socket.io triggers are fully implemented. New features, tests, and UI enhancements are continuously being deployed.

```text
chowkspot/
├── src/                    # Express Backend Engine
│   ├── modules/            # Domain-Bounded Controllers & Services
│   ├── db/                 # Drizzle Schemas & Migration Engine
│   └── sockets/            # Socket.io Event Handlers
└── frontend/               # React 19 SPA
    ├── src/modules/        # Feature Domain Modules
    └── src/styles/         # CSS Tokens & Global Resets
```

<div align="center">
  <sub>Built with ❤️ to empower independent local tradesmen and simplify everyday life.</sub>
</div>
