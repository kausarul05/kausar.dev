/**
 * Writes ADMIN_PASSWORD_HASH into .env.local.
 *
 *   npm run set-password -- "your password"
 *
 * The password itself is never stored — only a scrypt hash with a random salt.
 */
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const password = process.argv.slice(2).join(" ").trim();

if (!password) {
  console.error('Usage: npm run set-password -- "your password"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Use at least 8 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;

const envPath = resolve(process.cwd(), ".env.local");
let env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";

if (/^ADMIN_PASSWORD_HASH=.*$/m.test(env)) {
  env = env.replace(/^ADMIN_PASSWORD_HASH=.*$/m, `ADMIN_PASSWORD_HASH=${hash}`);
} else {
  env += `${env.endsWith("\n") || env === "" ? "" : "\n"}ADMIN_PASSWORD_HASH=${hash}\n`;
}

// Make sure a session secret exists too, so the first run isn't a dead end.
if (!/^AUTH_SECRET=.+$/m.test(env)) {
  const secret = randomBytes(48).toString("base64url");
  env = /^AUTH_SECRET=.*$/m.test(env)
    ? env.replace(/^AUTH_SECRET=.*$/m, `AUTH_SECRET=${secret}`)
    : `AUTH_SECRET=${secret}\n${env}`;
  console.log("Generated a new AUTH_SECRET.");
}

writeFileSync(envPath, env);
console.log("Admin password saved to .env.local.");
console.log("Restart the dev server for it to take effect.");
