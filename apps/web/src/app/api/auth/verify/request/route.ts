import { NextRequest, NextResponse } from "next/server";
import { db } from "@odontox/db";
import { sql } from "drizzle-orm";
import crypto from "node:crypto";
import { sendEmailVerification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
  await db.execute(sql`insert into verification_tokens (identifier, token, expires) values (${email.toLowerCase()}, ${token}, ${expires}) on conflict do nothing`);
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${base}/api/auth/verify/confirm?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  await sendEmailVerification(email, url);
  return NextResponse.json({ ok: true });
}

