import { AppShell } from "../../src/components/AppShell.jsx";
import { requireUser } from "../../src/lib/session.js";
import { logout } from "./actions.js";

export default async function AppLayout({ children }) {
  const user = await requireUser();

  return (
    <AppShell logout={logout} user={user}>
      {children}
    </AppShell>
  );
}
