import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { and, desc, eq } from "drizzle-orm";
import { runWithTenant } from "@/lib/tenant-db";
import { requireTenantAndRole } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireTenantAndRole();
    const patientId = (new URL(req.url)).searchParams.get("patientId");
    return await runWithTenant(tenantId, async () => {
      const rows = await db
        .select({ id: schema.appointments.id, patientId: schema.appointments.patientId, providerId: schema.appointments.providerId, startAt: schema.appointments.startAt, endAt: schema.appointments.endAt, status: schema.appointments.status })
        .from(schema.appointments)
        .where(patientId ? and(eq(schema.appointments.patientId, patientId as any)) : (eq(schema.appointments.tenantId, tenantId)))
        .orderBy(desc(schema.appointments.startAt))
        .limit(100);
      return NextResponse.json(rows);
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await requireTenantAndRole();
    const body = await req.json();
    const values = {
      tenantId,
      patientId: body.patientId,
      providerId: body.providerId,
      resourceId: body.resourceId || null,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
      status: body.status || "scheduled",
      reason: body.reason || null,
      notes: body.notes || null,
    } as any;
    return await runWithTenant(tenantId, async () => {
      const [row] = await db.insert(schema.appointments).values(values).returning({ id: schema.appointments.id });
      return NextResponse.json({ id: row.id }, { status: 201 });
    });
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized or invalid" }, { status: 400 });
  }
}

