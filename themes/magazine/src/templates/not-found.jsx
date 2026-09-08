function NotFoundTemplate() {
  return (
    <main className="of-theme-magazine-not-found">
      <p className="of-theme-magazine-kicker">Error 404</p>
      <h1>Page not found</h1>
      <p>
        This story was pulled, moved, or never made it past the copy desk. The
        rest of the issue is still here.
      </p>
      <p>
        <a className="of-theme-magazine-not-found-link" href="/">
          Back to the front page
        </a>
      </p>
    </main>
  );
}

export default NotFoundTemplate;
