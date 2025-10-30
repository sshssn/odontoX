import { NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { requireTenantAndRole } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const { role } = await requireTenantAndRole();
    if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const plans = await db.select().from(schema.plans);
    return NextResponse.json(plans);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}

