import Stripe from "stripe";
import { db, schema } from "@odontox/db";
import { eq } from "drizzle-orm";

export async function syncPlansFromStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return;
  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const products = await stripe.products.list({ active: true, limit: 100 });
  for (const p of products.data) {
    const key = (p.metadata?.key as string) || p.name.toUpperCase().replace(/\s+/g, "_");
    const name = p.name;
    const exists = await db.select({ id: schema.plans.id }).from(schema.plans).where(eq(schema.plans.key, key)).limit(1);
    if (!exists[0]) {
      await db.insert(schema.plans).values({ key, name, active: true });
    }
  }
}

