import { redirect } from "next/navigation";

import { getCurrentUser } from "../src/lib/session.js";

export default async function RootPage() {
  const user = await getCurrentUser();
  redirect(user ? "/sites" : "/login");
}
