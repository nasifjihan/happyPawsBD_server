const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = String(forwarded).split(",")[0].trim();
    if (first) {
      return first;
    }
  }

  return req.ip || req.connection?.remoteAddress || "unknown";
};

export const createRateLimiter = ({ windowMs, max, keyGenerator } = {}) => {
  const maxRequests = Number.isFinite(max) ? max : 30;
  const windowDuration = Number.isFinite(windowMs) ? windowMs : 10 * 60 * 1000;
  const buckets = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = keyGenerator ? keyGenerator(req) : getClientIp(req);
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowDuration });
      next();
      return;
    }

    bucket.count += 1;

    if (bucket.count > maxRequests) {
      res.status(429).json({
        message: "Too many requests. Please try again later.",
      });
      return;
    }

    next();
  };
};

