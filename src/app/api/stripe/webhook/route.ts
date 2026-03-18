import { NextResponse } from "next/server";

// ═══════════════════════════════════════════
// Stripe Webhook Handler
// Handles subscription lifecycle events
// ═══════════════════════════════════════════
//
// Environment variables needed:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
    console.error("Missing Stripe env vars");
    return NextResponse.json({ error: "Config error" }, { status: 500 });
  }

  // Verify webhook signature (simplified — use stripe SDK in production)
  // For now, we process the event directly
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type;
  const data = event.data?.object;

  console.log(`🔔 Stripe webhook: ${eventType}`);

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // New subscription created
        const customerId = data.customer;
        const subscriptionId = data.subscription;
        const tenantId = data.metadata?.tenant_id;

        if (tenantId && SUPABASE_URL && SUPABASE_KEY) {
          await fetch(`${SUPABASE_URL}/rest/v1/tenants?id=eq.${tenantId}`, {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: "active",
              plan: data.metadata?.plan || "solo",
            }),
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const status = data.status; // active, past_due, canceled, unpaid
        const customerId = data.customer;

        if (SUPABASE_URL && SUPABASE_KEY) {
          await fetch(`${SUPABASE_URL}/rest/v1/tenants?stripe_customer_id=eq.${customerId}`, {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              subscription_status: status,
            }),
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const customerId = data.customer;

        if (SUPABASE_URL && SUPABASE_KEY) {
          await fetch(`${SUPABASE_URL}/rest/v1/tenants?stripe_customer_id=eq.${customerId}`, {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              subscription_status: "canceled",
              plan: "trial",
            }),
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const customerId = data.customer;
        console.warn(`⚠️ Payment failed for customer: ${customerId}`);

        if (SUPABASE_URL && SUPABASE_KEY) {
          await fetch(`${SUPABASE_URL}/rest/v1/tenants?stripe_customer_id=eq.${customerId}`, {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              subscription_status: "past_due",
            }),
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
