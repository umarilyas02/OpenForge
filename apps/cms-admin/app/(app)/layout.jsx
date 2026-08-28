import Link from "next/link";

import { requireUser } from "../../src/lib/session.js";
import { logout } from "./actions.js";

export default async function AppLayout({ children }) {
  const user = await requireUser();

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav-brand">OpenForge CMS</div>
        <Link className="app-nav-link" href="/sites">
          Sites
        </Link>
        <div style={{ marginTop: "auto" }}>
          <p className="muted" style={{ fontSize: 12, padding: "0 10px" }}>
            {user.email}
          </p>
          <form action={logout}>
            <button type="submit" className="app-nav-link app-nav-logout">
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="app-main">
        <div className="page">{children}</div>
      </main>
    </div>
  );
}
