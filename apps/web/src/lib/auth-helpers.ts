import { auth } from "@/lib/auth";

export async function requireTenantAndRole() {
  const session = await auth();
  const tenantId = (session as any)?.tenantId as string | undefined;
  const role = (session as any)?.role as string | undefined;
  if (!tenantId || !role) throw new Error("UNAUTHORIZED");
  return { tenantId, role } as const;
}

