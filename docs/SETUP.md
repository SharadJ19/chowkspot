# 💻 ChowkSpot — Local Development Setup Guide

[← Back to Main README](../README.md)

This guide walks through setting up both the **Express backend** and **React frontend** in your local development environment.

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v20.x` or higher (`v22+` recommended)
- **npm** or **pnpm**
- **PostgreSQL**: `v14+` running locally or an active cloud instance (e.g., [Neon DB](https://neon.tech))
- **Git**

## 🗄️ 1. Database Setup

1. Open your PostgreSQL terminal (`psql`) or client and create a dedicated database:

```sql
CREATE DATABASE chowkspot_db;
```

2. Enable the Trigram extension inside your database for fuzzy search:

```sql
\c chowkspot_db
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

## ⚙️ 2. Backend Setup

1. Navigate to the backend directory:

```bash
cd chowkspot-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create your `.env` file from the template:

```bash
cp .env.example .env
```

4. Populate the `.env` variables:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://postgres:password@localhost:5432/chowkspot_db
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_16_char_app_password
JWT_ACCESS_SECRET=your_super_secret_access_key_min_16_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_16_chars
```

5. Push the Drizzle ORM schema migrations to your database:

```bash
npm run db:migrate
```

6. Seed the database with demo accounts, workers, categories, and reviews:

```bash
npm run db:seed
```

7. Start the backend development server:

```bash
npm run dev
```

The backend API will run on `http://localhost:5000` with the health endpoint active at `http://localhost:5000/health`.

## 🎨 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd chowkspot-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create your `.env` file from the template:

```bash
cp .env.example .env
```

4. Populate the `.env` configuration:

```env
VITE_APP_NAME=ChowkSpot
VITE_APP_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=demo
VITE_CLOUDINARY_UPLOAD_PRESET=chowkspot_unsigned
```

5. Start the Vite development server:

```bash
npm run dev
```

The frontend application will be live at `http://localhost:5173`.

## 🧪 4. Running Test Suites

### Backend Unit & Integration Tests (Vitest)

```bash
cd chowkspot-backend
npm run test
```

### Frontend Type-Checking & Linting

```bash
cd chowkspot-frontend
npm run typecheck
npm run lint
```

### End-to-End Tests (Playwright)

```bash
cd chowkspot-frontend
npm run test:e2e
```

## 🔑 5. Pre-Seeded Test Credentials

Use these pre-verified accounts to log in directly:

| Role         | Email                         | Password       | Access / Capabilities                                                  |
| ------------ | ----------------------------- | -------------- | ---------------------------------------------------------------------- |
| **Admin**    | `sharad@admin.com`            | `Password123!` | Access `/admin` Command Center, view platform metrics, delete users    |
| **Worker**   | `smarth.sharda@chowkspot.com` | `Password123!` | Accept/reject job requests, toggle availability, manage service cities |
| **Customer** | `user@test.com`               | `Password123!` | Discover workers, create bookings, test direct UPI payment QR flows    |
