# Happy Paws BD Backend

This backend is an Express + MongoDB API for the Happy Paws BD frontend.

## Scripts

- `npm run dev` starts the server with `nodemon`
- `npm run start` starts the server in production mode
- `npm run lint` runs ESLint
- `npm run test` runs the built-in Node.js test suite
- `npm run check` runs lint and tests together

## Environment

Copy `.env.example` to `.env` and fill in the required values.

Minimum required values:

- `MONGODB_URI` or `DB_USERNAME` and `DB_PASSWORD`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Email values are optional if you do not need confirmation emails:

- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

## Stripe webhook

Configure Stripe to send events to:

`/api/v1/payments/webhook`

Recommended events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

## Structure

- `app.js` configures middleware and routes
- `server.js` handles bootstrapping and shutdown
- `modules/` contains domain-based controllers, services, routes, and validators
- `server/routes/legacy.js` keeps the old frontend-compatible routes active
- `server/routes/api-v1.js` exposes the cleaner versioned API surface
