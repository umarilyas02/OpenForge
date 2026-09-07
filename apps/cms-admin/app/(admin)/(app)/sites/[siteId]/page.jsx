import { redirect } from "next/navigation";

export default async function SiteRootPage({ params }) {
  const { siteId } = await params;
  redirect(`/sites/${siteId}/dashboard`);
}
