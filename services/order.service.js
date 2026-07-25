import Stripe from "stripe";
import { Orders } from "../model/Schema.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrderRecord = async (payload) => {
  const order = new Orders(payload);
  return order.save();
};

export const createCheckoutSession = async ({ items, clientUrl }) =>
  stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "bdt",
        product_data: { name: item.id },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity),
    })),
    mode: "payment",
    success_url: `${clientUrl}/cart?payment=success`,
    cancel_url: `${clientUrl}/cart?payment=cancelled`,
  });
