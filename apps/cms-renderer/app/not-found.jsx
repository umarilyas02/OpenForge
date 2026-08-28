import { defaultTheme } from "@openforge/theme-default";

export default function GlobalNotFound() {
  const NotFoundTemplate = defaultTheme.getTemplate("notFound");
  return <NotFoundTemplate />;
}
