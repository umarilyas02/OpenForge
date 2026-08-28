import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { invariant } from "./errors.js";

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const MIN_PASSWORD_LENGTH = 8;

/**
 * @param {string} password
 */
export function hashPassword(password) {
  invariant(
    typeof password === "string" && password.length >= MIN_PASSWORD_LENGTH,
    "OF_AUTH_PASSWORD_TOO_SHORT",
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  );

  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return `scrypt:${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

/**
 * @param {string} password
 * @param {string} storedHash
 */
export function verifyPassword(password, storedHash) {
  const [algorithm, saltHex, keyHex] = storedHash.split(":");
  invariant(
    algorithm === "scrypt" && saltHex && keyHex,
    "OF_AUTH_HASH_UNSUPPORTED",
    "Unsupported or malformed password hash.",
  );

  const salt = Buffer.from(saltHex, "hex");
  const expectedKey = Buffer.from(keyHex, "hex");
  const actualKey = scryptSync(
    password,
    salt,
    expectedKey.length,
    SCRYPT_PARAMS,
  );

  return (
    actualKey.length === expectedKey.length &&
    timingSafeEqual(actualKey, expectedKey)
  );
}
