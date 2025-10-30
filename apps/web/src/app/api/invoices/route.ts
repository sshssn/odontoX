import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { desc, eq } from "drizzle-orm";
import { runWithTenant } from "@/lib/tenant-db";
import { requireTenantAndRole } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireTenantAndRole();
    return await runWithTenant(tenantId, async () => {
      const rows = await db
        .select({ id: schema.invoices.id, patientId: schema.invoices.patientId, status: schema.invoices.status, total: schema.invoices.total, issuedAt: schema.invoices.issuedAt })
        .from(schema.invoices)
        .where(eq(schema.invoices.tenantId, tenantId))
        .orderBy(desc(schema.invoices.issuedAt))
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
      status: body.status || "draft",
      issuedAt: body.issuedAt ? new Date(body.issuedAt) : null,
      dueAt: body.dueAt ? new Date(body.dueAt) : null,
      currency: body.currency || "USD",
      subtotal: body.subtotal || 0,
      taxTotal: body.taxTotal || 0,
      total: body.total || 0,
      balanceDue: body.balanceDue || body.total || 0,
    } as any;
    return await runWithTenant(tenantId, async () => {
      const [row] = await db.insert(schema.invoices).values(values).returning({ id: schema.invoices.id });
      return NextResponse.json({ id: row.id }, { status: 201 });
    });
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized or invalid" }, { status: 400 });
  }
}

