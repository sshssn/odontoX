# OdontoX Setup Guide

## 🚀 Quick Start

### 1. Database Setup (Neon)

Create a `.env` file in the root directory:

```bash
# .env
DATABASE_URL="postgresql://user:password@your-neon-host/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

**Get your Neon Database URL:**
- Sign up at https://neon.tech
- Create a new project
- Copy the connection string
- Add it to your `.env` file

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET` in your `.env` file.

### 3. Install Dependencies

```bash
npm install
```

### 4. Build Database Package

```bash
npm run db:build
```

### 5. Push Database Schema

```bash
npm run db:push
```

### 6. Seed Database with Users

```bash
npm run db:seed
```

This will create users for all roles with credentials displayed in the output.

### 7. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 👥 Seeded User Credentials

After running `npm run db:seed`, you'll have these users:

| Role           | Email                    | Password      | Dashboard Access           |
|----------------|--------------------------|---------------|----------------------------|
| SUPER_ADMIN    | superadmin@demo.com      | super123      | All dashboards             |
| ORG_ADMIN      | admin@demo.com           | admin123      | Admin, Org, Provider, etc  |
| DENTIST        | dentist@demo.com         | dentist123    | Provider Dashboard         |
| RECEPTION      | reception@demo.com       | reception123  | Scheduling Dashboard       |
| BILLING        | billing@demo.com         | billing123    | Billing Dashboard          |
| PATIENT        | patient@demo.com         | patient123    | Patient Portal             |

---

## 📋 Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate new migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with demo data

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checks
```

---

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** shadcn/ui v4 (New York style)
- **Auth:** NextAuth.js v5
- **Database:** Neon Postgres
- **ORM:** Drizzle ORM
- **Language:** TypeScript
- **Styling:** Tailwind CSS

---

## 📁 Project Structure

```
Odonto-X/
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── (auth)/     # Auth pages (login)
│       │   │   ├── (dash)/     # Dashboard pages by role
│       │   │   └── api/        # API routes
│       │   ├── components/     # React components
│       │   │   └── ui/         # shadcn/ui components
│       │   ├── lib/            # Utilities & auth
│       │   └── middleware.ts   # Next.js middleware (auth)
│       └── package.json
├── packages/
│   └── db/                     # Database package
│       ├── src/
│       │   ├── schema/         # Drizzle schemas
│       │   └── seed.ts         # Seed script
│       └── drizzle.config.ts
└── package.json                # Root package.json
```

---

## 🔒 Authentication & Authorization

### Middleware (Next.js 16)

The app uses Next.js 16 middleware pattern for authentication:

- **Public routes:** `/login`, `/api/auth/*`
- **Protected routes:** Everything else requires authentication
- **Role-based access:** Users are redirected to their appropriate dashboard

### Role Permissions

```typescript
SUPER_ADMIN  → All dashboards
ORG_ADMIN    → Admin, Org, Provider, Billing, Scheduling
DENTIST      → Provider Dashboard only
RECEPTION    → Scheduling Dashboard only
BILLING      → Billing Dashboard only
PATIENT      → Patient Portal only
```

---

## 🎨 UI Components

### Installed shadcn/ui Components

All components are installed in `apps/web/src/components/ui/`:

**Core:** Button, Card, Input, Label, Form, Dialog, Drawer, Sheet, Tabs, Table, Badge, Avatar, Separator, Skeleton

**Navigation:** Sidebar, Breadcrumb, Dropdown Menu, Navigation Menu, Command, Menubar

**Forms:** Calendar, Select, Checkbox, Radio Group, Switch, Textarea, Input OTP

**Feedback:** Alert, Alert Dialog, Toast (Sonner), Tooltip, Hover Card, Popover, Progress

**Layout:** Aspect Ratio, Scroll Area, Resizable, Collapsible, Accordion

**Data:** Chart, Data Table, Pagination, Toggle, Toggle Group

### Installed Blocks

**Login:** login-01, login-02, login-03
**Sidebar:** sidebar-01, sidebar-07, sidebar-10  
**Dashboard:** dashboard-01
**Calendar:** calendar-10, calendar-12, calendar-20, calendar-27

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
npm run db:studio
```

If it fails, check:
1. Is your DATABASE_URL correct?
2. Is the Neon database running?
3. Does the user have proper permissions?

### Auth Issues

If you see authentication errors:
1. Make sure `NEXTAUTH_SECRET` is set
2. Check that `NEXTAUTH_URL` matches your dev URL
3. Clear cookies and try again

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild database package
npm run db:build
```

---

## 📝 Environment Variables

Create a `.env` file in the root directory with these variables:

```bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Optional
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
RESEND_API_KEY=""
EMAIL_FROM="noreply@yourdomain.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Don't forget to set:
- `DATABASE_URL` (your Neon production database)
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET` (different from dev)
- Other API keys as needed

---

## 📚 Next Steps

1. ✅ Install dependencies
2. ✅ Set up database (Neon)
3. ✅ Configure environment variables
4. ✅ Run migrations and seed
5. ✅ Start dev server
6. 🎯 Start building features!

### Suggested First Features

- Customize login page with clinic branding
- Add appointment creation forms
- Build patient list table
- Create provider schedule view
- Implement billing workflows

---

## 💡 Tips

- Use `npm run db:studio` to visually browse your database
- Check middleware logs for auth issues
- Use shadcn/ui CLI to add more components: `npx shadcn@latest add <component>`
- Run `npm run typecheck` before committing

---

## 📞 Support

- **shadcn/ui Docs:** https://ui.shadcn.com
- **Next.js Docs:** https://nextjs.org/docs
- **NextAuth.js Docs:** https://authjs.dev
- **Drizzle ORM Docs:** https://orm.drizzle.team
- **Neon Docs:** https://neon.tech/docs

---

Happy coding! 🦷✨




