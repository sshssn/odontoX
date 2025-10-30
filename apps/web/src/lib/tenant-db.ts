import { db } from "@odontox/db";
import { sql } from "drizzle-orm";

export async function runWithTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
  // Set app.tenant_id for RLS; scoped to the same connection execution context
  await db.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
  return await fn();
}

