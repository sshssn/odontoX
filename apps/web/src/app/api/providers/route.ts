import { NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { eq } from "drizzle-orm";
import { runWithTenant } from "@/lib/tenant-db";
import { requireTenantAndRole } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const { tenantId } = await requireTenantAndRole();
    return await runWithTenant(tenantId, async () => {
      const res = await db
        .select({ id: schema.providers.id, firstName: schema.providers.firstName, lastName: schema.providers.lastName })
        .from(schema.providers)
        .where(eq(schema.providers.tenantId, tenantId));
      return NextResponse.json(res);
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

