import { AppShell } from "../../../../src/components/AppShell.jsx";
import { NewSiteForm } from "../../../../src/components/NewSiteForm.jsx";
import { requireUser } from "../../../../src/lib/session.js";
import { logout } from "../../actions.js";
import { createSite } from "../actions.js";

const NAV_GROUPS = [
  {
    key: "sites",
    label: "Sites",
    description: "Every site you run through this install.",
    defaultOpen: true,
    items: [
      {
        href: "/sites",
        label: "All sites",
        icon: (
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        ),
      },
      {
        href: "/sites/new",
        label: "New site",
        icon: (
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.4"
            />
          </svg>
        ),
      },
    ],
  },
];

export default async function NewSitePage() {
  const user = await requireUser();

  return (
    <AppShell logout={logout} navGroups={NAV_GROUPS} user={user}>
      <NewSiteForm createSite={createSite} />
    </AppShell>
  );
}
