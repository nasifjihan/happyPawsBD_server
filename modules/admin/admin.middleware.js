import { env } from "../../config/env.js";
import { verifyAdminToken } from "./admin.token.js";

export const requireAdmin = (req, res, next) => {
  if (!env.adminTokenSecret) {
    res.status(500).json({
      message: "Admin token secret is missing. Set ADMIN_TOKEN_SECRET.",
    });
    return;
  }

  const headerToken =
    req.headers["x-admin-token"] ||
    req.headers["x-admin-auth"] ||
    req.headers.authorization;

  const token = String(headerToken || "").startsWith("Bearer ")
    ? String(headerToken).slice("Bearer ".length)
    : headerToken;

  const payload = verifyAdminToken({ secret: env.adminTokenSecret, token });

  if (!payload) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.admin = { username: payload.sub };
  next();
};
