import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").toLowerCase();
    const name = String(body?.name || "");
    const password = String(body?.password || "");
    const tenantSlug = String(body?.tenantSlug || "demo-clinic");
    const role = (body?.role as any) || "ORG_ADMIN";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (existing[0]) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const tenant = await db
      .select({ id: schema.tenants.id })
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, tenantSlug))
      .limit(1);
    if (!tenant[0]) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    const passwordHash = await argon2.hash(password);
    const [user] = await db.insert(schema.users).values({ email, name, passwordHash }).returning({ id: schema.users.id });
    await db.insert(schema.orgMembers).values({ tenantId: tenant[0].id, userId: user.id, role });

    return NextResponse.json({ id: user.id, email }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

