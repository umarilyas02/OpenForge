"use client";

/**
 * Activating a theme replaces the site's actual pages/nav/footer with that
 * theme's real example content (see theme-site-generator.js) -- destructive,
 * so this confirms before the form ever submits.
 *
 * @param {{ installTheme: Function, siteId: string, themeId: string, themeName: string }} props
 */
export function ActivateThemeForm({ installTheme, siteId, themeId, themeName }) {
  return (
    <form
      action={installTheme.bind(null, siteId, themeId)}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Activate "${themeName}"? This replaces this site's current pages, navigation, and footer with ${themeName}'s starter content, and resets its saved history to a single "Activate ${themeName} theme" commit.`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <button className="btn btn-ghost" type="submit">
        Activate
      </button>
    </form>
  );
}
