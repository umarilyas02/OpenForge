function NotFoundTemplate() {
  return (
    <main className="of-theme-restaurant-not-found">
      <h1>This page isn’t on the menu</h1>
      <p>
        We couldn’t find the page you asked for. It may have come off when the
        season changed.
      </p>
      <nav
        aria-label="Where to go next"
        className="of-theme-restaurant-not-found-links"
      >
        <a href="/">Back to the front page</a>
        <a href="/menu">See the current menu</a>
        <a href="/reservations">Book a table</a>
      </nav>
    </main>
  );
}

export default NotFoundTemplate;
