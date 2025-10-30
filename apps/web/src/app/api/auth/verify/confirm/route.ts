import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@odontox/db";
import { sql, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = (searchParams.get("email") || "").toLowerCase();
  if (!token || !email) return NextResponse.redirect("/login");

  // fetch and validate token
  const res = await db.execute(sql`select token, expires from verification_tokens where identifier=${email} and token=${token}`);
  const row = (res as any).rows?.[0];
  if (!row) return NextResponse.redirect("/login");
  if (new Date(row.expires) < new Date()) return NextResponse.redirect("/login");

  await db.update(schema.users).set({ emailVerified: new Date() as any }).where(eq(schema.users.email, email));
  await db.execute(sql`delete from verification_tokens where identifier=${email}`);
  return NextResponse.redirect("/login");
}

