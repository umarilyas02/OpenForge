function NotFoundTemplate() {
  return (
    <main className="of-theme-nonprofit-not-found">
      <h1>Page not found</h1>
      <p>
        This page has moved or never existed. The rest of the site is still
        here — start from the home page, or head straight to the ways you can
        help.
      </p>
      <ul className="of-theme-nonprofit-not-found-links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/get-involved">Get involved</a>
        </li>
        <li>
          <a href="/contact">Contact us</a>
        </li>
      </ul>
    </main>
  );
}

export default NotFoundTemplate;
