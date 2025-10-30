# 🚀 Quick Database Setup

## You need a DATABASE_URL to continue!

### Option 1: Neon (Recommended - Free & Fast) ⚡

1. **Go to:** https://neon.tech
2. **Sign up** (free, no credit card needed)
3. **Create a project** (click "Create Project")
4. **Copy the connection string** - it looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Option 2: Local Postgres (If you have it installed)

```bash
postgresql://postgres:password@localhost:5432/odontox
```

---

## ⚙️ Setup Steps

### 1. Create `.env` file in the ROOT directory:

```bash
# .env
DATABASE_URL="postgresql://your-connection-string-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-change-this-in-production-please"
```

### 2. Run migrations:

```bash
npm run db:push
```

### 3. Seed demo users:

```bash
npm run db:seed
```

---

## 🎯 Quick Copy-Paste Template

Create `.env` file with this (replace DATABASE_URL):

```env
DATABASE_URL="postgresql://YOUR_CONNECTION_STRING_HERE"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars-long-please-change-me"
```

---

## 🆘 Still Having Issues?

**Error: "DATABASE_URL is not set"**
- Make sure `.env` file is in the ROOT directory (not in apps/web)
- Make sure there are no spaces around the `=` sign
- Make sure the URL is in quotes

**Need a quick Neon setup?**
1. Visit: https://console.neon.tech/signup
2. Sign up with GitHub (fastest)
3. Create a project
4. Copy connection string
5. Paste into `.env` file

---

## 📝 After Setup

Once you have the DATABASE_URL set:

```bash
# Push schema to database
npm run db:push

# Seed demo users
npm run db:seed

# Start the app
npm run dev
```

Login at http://localhost:3000 with:
- **admin@demo.com** / **admin123**
- **dentist@demo.com** / **dentist123**
- **reception@demo.com** / **reception123**

---

🦷 **OdontoX** - You're almost there!


