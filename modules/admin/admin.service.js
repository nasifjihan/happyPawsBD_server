import { AdminCredentials } from "../../model/Schema.js";
import { env } from "../../config/env.js";
import { createPasswordHash, verifyPassword } from "./admin.crypto.js";

export const ensureSeedAdminCredential = async () => {
  const hasCredentials = (await AdminCredentials.estimatedDocumentCount()) > 0;

  if (hasCredentials) {
    return;
  }

  if (!env.adminSeedUsername || !env.adminSeedPassword) {
    return;
  }

  const { passwordSalt, passwordHash } = createPasswordHash(env.adminSeedPassword);

  await AdminCredentials.create({
    username: env.adminSeedUsername,
    passwordSalt,
    passwordHash,
    isActive: true,
  });
};

export const findAdminCredential = async (username) =>
  AdminCredentials.findOne({ username, isActive: true });

export const validateAdminLogin = async ({ username, password }) => {
  const credential = await findAdminCredential(username);

  if (!credential) {
    return null;
  }

  const isValid = verifyPassword({
    password,
    passwordSalt: credential.passwordSalt,
    passwordHash: credential.passwordHash,
  });

  return isValid ? credential : null;
};

export const updateAdminCredential = async ({ currentUsername, username, password }) => {
  const updates = {};

  if (username) {
    updates.username = username;
  }

  if (password) {
    Object.assign(updates, createPasswordHash(password));
  }

  if (!Object.keys(updates).length) {
    return AdminCredentials.findOne({ username: currentUsername });
  }

  return AdminCredentials.findOneAndUpdate({ username: currentUsername }, updates, {
    new: true,
  });
};
