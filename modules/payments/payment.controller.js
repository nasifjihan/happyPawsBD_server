import {
  calculateOrderTotal,
  createOrderRecord,
  findOrderByStripeCheckoutSessionId,
  updateOrderRecord,
} from "../orders/order.service.js";
import { resolveClientOrigin } from "../../utils/origin.js";
import {
  constructWebhookEvent,
  createCheckoutSession,
} from "./payment.service.js";
import { validatePaymentPayload } from "./payment.validation.js";

export const createPayment = async (req, res, next) => {
  const clientUrl = resolveClientOrigin(req.headers.origin);
  let pendingOrder = null;

  try {
    const paymentPayload = validatePaymentPayload(req.body);
    const orderPayload = {
      deliveryInfo: paymentPayload.deliveryInfo,
      orderSummary: {
        items: paymentPayload.items,
        total: calculateOrderTotal(paymentPayload.items),
      },
      paymentMethod: paymentPayload.paymentMethod,
      orderStatus: "pending_payment",
      paymentStatus: "unpaid",
    };

    pendingOrder = await createOrderRecord(orderPayload);

    const session = await createCheckoutSession({
      items: paymentPayload.items,
      clientUrl,
      customerEmail: paymentPayload.deliveryInfo.email,
      orderId: String(pendingOrder._id),
    });

    await updateOrderRecord(pendingOrder._id, {
      stripeCheckoutSessionId: session.id,
      orderStatus: "checkout_started",
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    if (pendingOrder?._id) {
      try {
        await updateOrderRecord(pendingOrder._id, {
          orderStatus: "payment_setup_failed",
          paymentStatus: "failed",
        });
      } catch (updateError) {
        console.error(
          "Failed to update pending order after payment setup error:",
          updateError.message
        );
      }
    }

    next(error);
  }
};

const syncOrderWithStripeSession = async (session) => {
  const orderId = session.metadata?.orderId;
  const order =
    (orderId ? await findOrderByStripeCheckoutSessionId(session.id) : null) ||
    (session.id ? await findOrderByStripeCheckoutSessionId(session.id) : null);

  if (!order && !orderId) {
    return null;
  }

  const targetOrderId = order?._id || orderId;

  if (!targetOrderId) {
    return null;
  }

  if (session.payment_status === "paid") {
    return updateOrderRecord(targetOrderId, {
      orderStatus: "paid",
      paymentStatus: "paid",
      stripeCheckoutSessionId: session.id,
    });
  }

  return updateOrderRecord(targetOrderId, {
    orderStatus: "checkout_started",
    paymentStatus: "unpaid",
    stripeCheckoutSessionId: session.id,
  });
};

export const handleStripeWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = constructWebhookEvent(req.body, signature);

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await syncOrderWithStripeSession(event.data.object);
        break;
      case "checkout.session.async_payment_failed": {
        const failedSession = event.data.object;
        const failedOrder = await findOrderByStripeCheckoutSessionId(
          failedSession.id
        );

        if (failedOrder) {
          await updateOrderRecord(failedOrder._id, {
            orderStatus: "payment_failed",
            paymentStatus: "failed",
          });
        }
        break;
      }
      case "checkout.session.expired": {
        const expiredSession = event.data.object;
        const expiredOrder = await findOrderByStripeCheckoutSessionId(
          expiredSession.id
        );

        if (expiredOrder) {
          await updateOrderRecord(expiredOrder._id, {
            orderStatus: "cancelled",
            paymentStatus: "cancelled",
          });
        }
        break;
      }
      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 400;
    }

    next(error);
  }
};
