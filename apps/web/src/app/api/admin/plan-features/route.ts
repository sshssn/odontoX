import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { and, eq } from "drizzle-orm";
import { requireTenantAndRole } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { role } = await requireTenantAndRole();
    if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const planId = (new URL(req.url)).searchParams.get("planId");
    const rows = planId
      ? await db.select().from(schema.planFeatures).where(eq(schema.planFeatures.planId, planId as any))
      : await db.select().from(schema.planFeatures).limit(500);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { role } = await requireTenantAndRole();
    if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const body = await req.json();
    const [row] = await db.insert(schema.planFeatures).values({
      planId: body.planId,
      key: body.key,
      enabled: body.enabled ?? true,
      hardLimit: body.hardLimit ?? null,
      softLimit: body.softLimit ?? null,
      metadata: body.metadata ?? {}
    }).returning({ id: schema.planFeatures.id });
    return NextResponse.json({ id: row.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}

