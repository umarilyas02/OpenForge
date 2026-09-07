import { redirect } from "next/navigation";

export default async function AppearanceRootPage({ params }) {
  const { siteId } = await params;
  redirect(`/sites/${siteId}/appearance/design-tokens`);
}
