# 🎨 ChowkSpot — Frontend Architecture Documentation

[← Back to Main README](../README.md)

## 📌 Architecture Overview

The **ChowkSpot** frontend is built with **React 19**, **TypeScript**, and **Vite 8**. It uses a **Feature-Based Modular Architecture** paired with scoped **CSS Modules** and a custom **CSS Design Token System**, avoiding the runtime overhead of CSS utility libraries while maintaining consistent styling.

```plaintext
chowkspot-frontend/
├── src/
│   ├── assets/                 # Category imagery, worker portraits & SVG icons
│   ├── components/             # Reusable UI elements & layouts
│   │   ├── guards/             # RouteGuard (Role-based & auth gating)
│   │   ├── layout/             # Navbar, Footer, Sidebar, MainLayout
│   │   └── ui/                 # Button, Input, Modal, Avatar, RatingStars, Autocomplete
│   ├── config/                 # Environment schemas & static constants
│   ├── context/                # AuthProvider, SocketProvider & contexts
│   ├── hooks/                  # useAuth, useSocket, useDebounce, useSearchFilters
│   ├── lib/                    # fetchClient, queryClient, socket initializers
│   ├── modules/                # Feature-Domain Modules
│   │   ├── admin/              # Command center metrics & user management tables
│   │   ├── auth/               # Multi-step onboarding, login & password recovery
│   │   ├── bookings/           # Master-detail booking console & status steppers
│   │   ├── home/               # Hero showcase, category cards, how-it-works
│   │   ├── payments/           # Direct UPI QR modal & deep-link generator
│   │   ├── reviews/            # Inline review composers & customer ratings
│   │   ├── users/              # Account settings & profile updating
│   │   └── workers/            # Marketplace search filters & worker cards
│   ├── pages/                  # Page routes with skeleton loaders
│   ├── routes/                 # React Router routing tree & lazy imports
│   └── styles/                 # Global tokens (colors, spacing, shadows, radius)
```

## 🎛️ Design Token System & CSS Modules

Component styling is managed through CSS custom properties defined in `src/styles/tokens/`:

```css
/* src/styles/tokens/colors.css */
:root {
  --color-primary-500: #10b981;
  --color-primary-600: #059669;
  --color-primary-700: #047857;

  --color-slate-900: #0f172a;
  --color-slate-950: #020617;

  --color-status-pending-bg: #fef9c3;
  --color-status-pending-text: #854d0e;
  --color-status-completed-bg: #dcfce7;
  --color-status-completed-text: #166534;
}
```

Components import scoped `.module.css` sheets that reference these design tokens:

```css
/* WorkerCard.module.css */
.card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  transition: var(--transition-normal);
}

.card:hover {
  border-color: var(--color-primary-300);
  transform: translateY(-3px);
}
```

## ⚡ Server State & Real-Time Sync

1. **TanStack Query v5**: Configured with a 5-minute `staleTime` and 15-minute garbage collection window. Actions automatically invalidate target query keys (`my_bookings`, `workers_search`, `admin_stats`) for immediate UI updates.
2. **Socket.io Client Provider**: Authenticates automatically on login and listens for `NEW_BOOKING_REQUEST` and `BOOKING_STATUS_UPDATED` events, refreshing the query cache and triggering toast notifications.

## 🖼️ Client-Side Cloudinary Uploads

To keep the Express backend stateless, image uploads bypass server memory entirely:

1. The client selects an image in `AvatarUploader`.
2. `uploadToCloudinary()` sends the binary file directly to the Cloudinary REST API using an unsigned preset.
3. The returned HTTPS URL is saved to PostgreSQL via standard JSON API requests.

## 📲 Direct Peer-to-Peer UPI Payment Engine

Client devices generate standardized UPI deep-link strings using the worker's configured `paymentIdentifier`:

```ts
export const buildUpiUri = ({
  upiId,
  payeeName,
  amount,
  transactionNote,
}: UpiParams): string => {
  let cleanUpi = upiId.trim();
  if (/^\d{10}$/.test(cleanUpi)) {
    cleanUpi = `${cleanUpi}@paytm`;
  }

  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(transactionNote || 'Payment via ChowkSpot');

  let uri = `upi://pay?pa=${cleanUpi}&pn=${encodedName}&tn=${encodedNote}&cu=INR`;
  if (amount !== undefined) {
    uri += `&am=${Number(amount).toFixed(2)}`;
  }
  return uri;
};
```

Selecting "Pay via UPI" opens installed native UPI apps (GPay, PhonePe, Paytm) on mobile devices or displays a QR code on desktop browsers.
