import "dotenv/config";

const DEFAULT_PORT = 5000;
const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_MONGODB_CLUSTER_URI =
  "cluster0.adcng.mongodb.net/happyPawsBD?retryWrites=true&w=majority";

const toNumber = (value, fallbackValue) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
};

const buildMongoUri = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
    return `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${DEFAULT_MONGODB_CLUSTER_URI}`;
  }

  return null;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, DEFAULT_PORT),
  host: process.env.HOST || DEFAULT_HOST,
  mongoUri: buildMongoUri(),
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
};

export const ensureStartupConfig = () => {
  if (!env.mongoUri) {
    throw new Error(
      "Missing database configuration. Set MONGODB_URI or DB_USERNAME and DB_PASSWORD before starting the server."
    );
  }
};
