const DEFAULT_CLIENT_URL = "http://localhost:5173";
const DEFAULT_PRODUCTION_CLIENT_URL = "https://happypawsbd.onrender.com";

export const getConfiguredOrigins = () => [
  process.env.CLIENT_URL || DEFAULT_CLIENT_URL,
  process.env.PRODUCTION_CLIENT_URL || DEFAULT_PRODUCTION_CLIENT_URL,
  ...(process.env.ADDITIONAL_ALLOWED_ORIGINS
    ? process.env.ADDITIONAL_ALLOWED_ORIGINS.split(",").map((origin) =>
        origin.trim()
      )
    : []),
];

export const isLocalDevOrigin = (origin) => {
  try {
    const { hostname, protocol } = new URL(origin);
    return (
      (protocol === "http:" || protocol === "https:") &&
      (hostname === "localhost" || hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
};

export const isAllowedOrigin = (origin) =>
  getConfiguredOrigins().includes(origin) || isLocalDevOrigin(origin);

export const resolveClientOrigin = (origin) =>
  origin && isAllowedOrigin(origin)
    ? origin
    : process.env.CLIENT_URL || DEFAULT_CLIENT_URL;
