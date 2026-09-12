import { getDb } from "../../../src/lib/db.js";
import { hasAnyUsers } from "../../../src/lib/account-setup.js";
import { LoginForm } from "./LoginForm.jsx";
import { SetupForm } from "./SetupForm.jsx";

/**
 * `/login` is dual-purpose: on a fresh install (zero rows in `users`) it
 * renders the one-time `SetupForm` instead of the sign-in form. Once an
 * account exists, this always renders `LoginForm` — there is no UI path
 * back to account creation, by design (single-user product; a second
 * account can only ever be provisioned via `tooling/scripts/create-user.js`).
 */
export default async function LoginPage() {
  const needsSetup = !(await hasAnyUsers(getDb()));
  return needsSetup ? <SetupForm /> : <LoginForm />;
}
