import crypto from "node:crypto";

const base64UrlEncode = (value) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const base64UrlDecode = (value) =>
  Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
    "utf-8"
  );

const signPayload = ({ payload, secret }) =>
  base64UrlEncode(
    crypto.createHmac("sha256", secret).update(payload).digest("base64")
  );

export const createAdminToken = ({ secret, username, ttlSeconds = 60 * 60 * 8 }) => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const tokenPayload = JSON.stringify({
    sub: username,
    exp: nowSeconds + ttlSeconds,
    iat: nowSeconds,
  });

  const encodedPayload = base64UrlEncode(tokenPayload);
  const signature = signPayload({ payload: encodedPayload, secret });
  return `${encodedPayload}.${signature}`;
};

export const verifyAdminToken = ({ secret, token }) => {
  const [encodedPayload, signature] = String(token || "").split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload({ payload: encodedPayload, secret });

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  let payload;

  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!payload?.sub || !payload?.exp || payload.exp <= nowSeconds) {
    return null;
  }

  return payload;
};
