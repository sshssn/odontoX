import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { and, eq, ilike, sql } from "drizzle-orm";
import { runWithTenant } from "@/lib/tenant-db";
import { requireTenantAndRole } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireTenantAndRole();
    const q = (new URL(req.url)).searchParams.get("q") || "";
    return await runWithTenant(tenantId, async () => {
      const res = await db
        .select({
          id: schema.patients.id,
          firstName: schema.patients.firstName,
          lastName: schema.patients.lastName,
          email: schema.patients.email,
          phone: schema.patients.phone,
        })
        .from(schema.patients)
        .where(q ? and(ilike(schema.patients.firstName, `%${q}%`)) : sql`true`)
        .limit(50);
      return NextResponse.json(res);
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
      firstName: String(body.firstName || ""),
      lastName: String(body.lastName || ""),
      email: body.email ? String(body.email) : null,
      phone: body.phone ? String(body.phone) : null,
    } as any;
    return await runWithTenant(tenantId, async () => {
      const [row] = await db.insert(schema.patients).values(values).returning({ id: schema.patients.id });
      return NextResponse.json({ id: row.id }, { status: 201 });
    });
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

