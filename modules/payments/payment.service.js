import Stripe from "stripe";
import { env } from "../../config/env.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async ({
  items,
  clientUrl,
  customerEmail,
  orderId,
}) =>
  stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: items.map((item) => ({
      price_data: {
        currency: "bdt",
        product_data: { name: item.name || `Product ${item.id}` },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity),
    })),
    metadata: {
      orderId,
    },
    mode: "payment",
    success_url: `${clientUrl}/cart?payment=success`,
    cancel_url: `${clientUrl}/cart?payment=cancelled`,
  });

export const constructWebhookEvent = (payload, signature) => {
  if (!env.stripeWebhookSecret) {
    const error = new Error(
      "Stripe webhook secret is missing. Set STRIPE_WEBHOOK_SECRET to verify webhook events."
    );
    error.statusCode = 500;
    throw error;
  }

  if (!signature) {
    const error = new Error("Missing Stripe signature header.");
    error.statusCode = 400;
    throw error;
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.stripeWebhookSecret
  );
};
