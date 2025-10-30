import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { eq } from "drizzle-orm";
import { requireTenantAndRole } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const { role } = await requireTenantAndRole();
    if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const tenants = await db.select().from(schema.tenants).limit(200);
    return NextResponse.json(tenants);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { role } = await requireTenantAndRole();
    if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const { slug, name } = await req.json();
    const [row] = await db.insert(schema.tenants).values({ slug, name }).returning({ id: schema.tenants.id });
    return NextResponse.json({ id: row.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}

