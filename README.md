# 🦷 OdontoX - Multi-Tenant Dental Practice Management System

A modern, full-stack dental practice management system built with Next.js 16, TypeScript, and Drizzle ORM.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up database
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` and login with:
- **Super Admin:** superadmin@demo.com / super123
- **Org Admin:** orgadmin@demo.com / admin123
- **Dentist:** dentist@demo.com / dentist123
- **Reception:** reception@demo.com / reception123
- **Patient:** patient@demo.com / patient123

## 📋 Features

### Role-Based Dashboards
- ✅ **Super Admin** - Tenant & subscription management
- ✅ **Org Admin** - Staff & organization management
- ✅ **Dentist** - Schedule & patient records
- ✅ **Reception** - Appointment scheduling & patient registration
- ✅ **Patient** - Appointment viewing & billing

### Implemented Pages
- `/dashboard` - Role-based dashboard
- `/admin/tenants` - Tenant management
- `/admin/plans` - Subscription plans
- `/org/staff` - Staff management
- `/patients` - Patient registry
- `/appointments` - Appointment scheduling
- `/schedule` - Provider schedule
- `/my-appointments` - Patient appointments
- `/my-billing` - Patient invoices

## 🏗️ Project Structure

```
Odonto-X/
├── apps/
│   └── web/                 # Next.js 16 application
│       ├── src/
│       │   ├── app/        # Next.js App Router
│       │   │   ├── (admin)/    # Super Admin routes
│       │   │   ├── (clinical)/ # Clinical routes
│       │   │   ├── (org)/      # Org Admin routes
│       │   │   ├── (patient)/  # Patient routes
│       │   │   └── api/        # API routes
│       │   ├── components/  # React components
│       │   ├── lib/         # Utilities & helpers
│       │   └── hooks/       # Custom React hooks
│       └── package.json
├── packages/
│   └── db/                  # Database package
│       ├── src/
│       │   └── schema/      # Drizzle ORM schemas
│       └── package.json
└── package.json            # Monorepo root
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Neon)
- **ORM:** Drizzle ORM
- **Auth:** NextAuth.js v5
- **UI:** shadcn/ui + Tailwind CSS
- **Icons:** Tabler Icons + Lucide React

## 📦 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint check

# Database
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database
```

## 🔐 Authentication & Authorization

- NextAuth.js v5 with credentials provider
- JWT-based sessions
- Role-based access control (RBAC)
- Multi-tenant support

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[GET_DATABASE.md](./GET_DATABASE.md)** - Database setup guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation overview
- **[plan.md](./plan.md)** - Complete development plan

## 🧪 Testing

All dashboards are functional with:
- ✅ Real API integration
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Form validation

## 🔧 Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- npm or yarn

### Environment Variables
Create `.env.local`:
```env
DATABASE_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

## 📝 License

Private - All Rights Reserved

## 🤝 Contributing

This is a private project. For internal contributors, see [COMMIT_GUIDE.md](./COMMIT_GUIDE.md) for workflow guidelines.

---

**Built with ❤️ for modern dental practices**

