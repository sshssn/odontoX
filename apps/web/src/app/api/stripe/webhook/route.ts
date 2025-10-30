import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, schema } from "@odontox/db";
import { eq } from "drizzle-orm";

export const runtime = "nodejs"; // required for raw body

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ ok: true });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // TODO: handle customer.subscription.updated/created/deleted and sync to subscriptions table
  try {
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription;
      const stripeSubscriptionId = sub.id;
      const stripeCustomerId = String(sub.customer);
      const status = sub.status;
      // Update existing subscription row if present
      const existing = await db
        .select({ id: schema.subscriptions.id })
        .from(schema.subscriptions)
        .where(eq(schema.subscriptions.stripeSubscriptionId, stripeSubscriptionId))
        .limit(1);
      if (existing[0]) {
        await db
          .update(schema.subscriptions)
          .set({ status, stripeCustomerId })
          .where(eq(schema.subscriptions.id, existing[0].id));
      }
      // If not present, creation will be handled upon checkout success server-side where tenant is known.
    }
  } catch {}

  return NextResponse.json({ received: true });
}

