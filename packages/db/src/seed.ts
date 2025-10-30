import "dotenv/config";
import { db } from "./index.js";
import { plans, tenants, users, orgMembers } from "./schema/tenancy.js";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

async function main() {
  console.log("🌱 Starting seed...");

  // Seed plans (id auto-generated)
  await db.insert(plans).values([
    { key: "FREE", name: "Free", active: true },
    { key: "PRO", name: "Pro", active: true },
    { key: "ENTERPRISE", name: "Enterprise", active: true },
  ]).onConflictDoNothing();
  console.log("✅ Plans seeded");

  // Seed example tenant
  const [demoTenant] = await db.insert(tenants).values([
    { slug: "demo-clinic", name: "Demo Dental Clinic" },
  ]).onConflictDoNothing().returning();

  if (!demoTenant) {
    console.log("ℹ️  Demo tenant already exists");
    const existingTenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, "demo-clinic"))
      .limit(1);
    
    if (existingTenant[0]) {
      await seedUsersForTenant(existingTenant[0]);
    }
  } else {
    console.log("✅ Demo tenant created");
    await seedUsersForTenant(demoTenant);
  }

  console.log("🎉 Seed completed!");
}

async function seedUsersForTenant(tenant: any) {
  console.log(`\n👥 Seeding users for tenant: ${tenant.name}`);

  // Define all role users with credentials
  const roleUsers = [
    {
      email: "superadmin@demo.com",
      name: "Super Admin",
      password: "super123",
      role: "SUPER_ADMIN" as const,
    },
    {
      email: "orgadmin@demo.com",
      name: "Clinic Admin",
      password: "admin123",
      role: "ORG_ADMIN" as const,
    },
    {
      email: "dentist@demo.com",
      name: "Dr. Sarah Johnson",
      password: "dentist123",
      role: "DENTIST" as const,
    },
    {
      email: "reception@demo.com",
      name: "Jane Reception",
      password: "reception123",
      role: "RECEPTION" as const,
    },
    {
      email: "billing@demo.com",
      name: "Mike Billing",
      password: "billing123",
      role: "BILLING" as const,
    },
    {
      email: "patient@demo.com",
      name: "John Patient",
      password: "patient123",
      role: "PATIENT" as const,
    },
  ];

  for (const roleUser of roleUsers) {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, roleUser.email))
      .limit(1);

    if (existingUser.length === 0) {
      // Create user
      const passwordHash = await argon2.hash(roleUser.password);
      const [newUser] = await db
        .insert(users)
        .values({
          email: roleUser.email,
          name: roleUser.name,
          passwordHash,
          emailVerified: new Date(),
        })
        .returning();

      if (newUser) {
        // Create org membership
        await db.insert(orgMembers).values({
          tenantId: tenant.id,
          userId: newUser.id,
          role: roleUser.role,
        });
        console.log(`✅ Created ${roleUser.role}: ${roleUser.email} / ${roleUser.password}`);
      }
    } else {
      console.log(`ℹ️  User already exists: ${roleUser.email}`);
    }
  }

  console.log("\n📋 Login Credentials Summary:");
  console.log("═══════════════════════════════════════════════════");
  roleUsers.forEach((user) => {
    console.log(`${user.role.padEnd(15)} | ${user.email.padEnd(25)} | ${user.password}`);
  });
  console.log("═══════════════════════════════════════════════════");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

