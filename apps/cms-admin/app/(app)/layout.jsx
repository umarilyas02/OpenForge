import { requireUser } from "../../src/lib/session.js";

export default async function AppLayout({ children }) {
  await requireUser();

  return children;
}
