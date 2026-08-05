# 🎨 ChowkSpot — Frontend Architecture Documentation

[← Back to Main README](../README.md)

## 📌 Architecture Overview

The **ChowkSpot** frontend is built using **React 19**, **TypeScript**, and **Vite**. It employs a **Feature-Based Modular Architecture** paired with strict **CSS Modules** and **CSS Custom Properties (Design Tokens)**—avoiding utility framework runtime bloat while enforcing complete visual isolation.

## 📂 Directory Structure

```text
src/
├── assets/             # Static vectors, category webp covers, worker avatars
├── config/             # Environment schemas (Zod validated) & app constants
├── context/            # React Contexts (AuthContext, SocketContext)
├── hooks/              # Global custom hooks (useAuth, useSocket, useDebounce)
├── lib/                # Client initializers (fetchClient, queryClient, socket)
├── components/         # Feature-agnostic atomic UI primitives & layouts
│   ├── ui/             # Button, Input, Badge, Modal, RatingStars, Avatar
│   ├── layout/         # Navbar, Footer, MainLayout
│   └── guards/         # ProtectedRoute, RoleGuard
├── modules/            # Domain Feature Modules
│   ├── auth/           # Login / Register forms & schemas
│   ├── workers/        # WorkerCard, WorkerFilters, Search queries
│   ├── bookings/       # BookingCard, Status Badges, Action Modals
│   ├── reviews/        # ReviewList, Submission Forms
│   └── payments/       # Direct UPI QR Modal & Deep-Link URI builders
├── pages/              # Top-level route pages (HomePage, SearchPage, BookingsPage)
├── routes/             # React Router v7 string paths & route trees
└── styles/             # Design Tokens (colors, typography, spacing, radius)

```

## 🎛️ Design Token System & CSS Modules

Instead of Tailwind, the application utilizes a pure **CSS Custom Property Design System**:

```css
/* src/styles/tokens/colors.css */
:root {
  --color-primary-500: #10b981;
  --color-primary-600: #059669;
  --color-slate-900: #0f172a;

  --color-status-pending-bg: #fef9c3;
  --color-status-pending-text: #854d0e;
  --color-status-completed-bg: #dcfce7;
  --color-status-completed-text: #166534;
}
```

Components consume these variables inside scoped `.module.css` files, eliminating global style leakage:

```css
/* WorkerCard.module.css */
.card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: var(--transition-fast);
}

.card:hover {
  border-color: var(--color-primary-300);
  transform: translateY(-2px);
}
```

## ⚡ Server State & WebSocket Integration

### 1. TanStack Query v5

- **Stale-While-Revalidate**: Query cache is configured with a 5-minute `staleTime` and 15-minute `gcTime`.
- **Automatic Cache Invalidation**: Booking status updates or review submissions trigger target query key invalidations (`['my_bookings']`, `['workers_search']`), rendering updates without full page reloads.

### 2. Socket.io Client Context

- Connected upon user authentication using access tokens in the handshake payload.
- Listens globally for real-time events (`NEW_BOOKING_REQUEST`, `BOOKING_STATUS_UPDATED`), providing immediate visual cues to users and workers.

## 🖼️ Direct Cloudinary Upload Utility

To maintain a **stateless Node.js backend**, binary image files (avatars/kyc) never pass through Express memory:

1. User selects an image in the browser.
2. `uploadToCloudinary()` posts directly to the Cloudinary REST API via an unsigned upload preset.
3. The resulting HTTPS URL string is saved to the PostgreSQL database via Express REST calls.

## 📲 Peer-to-Peer UPI Payment Link Engine

Payment URIs are generated dynamically on the client side using the worker's saved `paymentIdentifier` (e.g., `worker@upi`):

```ts
export const buildUpiUri = ({ upiId, payeeName, amount }: UpiParams): string => {
  const encodedName = encodeURIComponent(payeeName);
  let uri = `upi://pay?pa=${upiId}&pn=${encodedName}&cu=INR`;
  if (amount) uri += `&am=${amount.toFixed(2)}`;
  return uri;
};
```

Clicking "Pay via UPI" directly launches installed native UPI apps (GPay, PhonePe, Paytm) on mobile devices or presents a scannable QR modal on desktop.
