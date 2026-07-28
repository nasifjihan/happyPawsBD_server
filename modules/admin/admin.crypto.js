import crypto from "node:crypto";

const keyLength = 64;

export const createPasswordHash = (password) => {
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.scryptSync(password, salt, keyLength);

  return {
    passwordSalt: salt.toString("base64"),
    passwordHash: derivedKey.toString("base64"),
  };
};

export const verifyPassword = ({ password, passwordSalt, passwordHash }) => {
  const salt = Buffer.from(passwordSalt, "base64");
  const expectedHash = Buffer.from(passwordHash, "base64");
  const derivedKey = crypto.scryptSync(password, salt, expectedHash.length);

  if (derivedKey.length !== expectedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, expectedHash);
};
