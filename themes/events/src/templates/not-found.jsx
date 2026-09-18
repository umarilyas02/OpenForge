function NotFoundTemplate() {
  return (
    <main className="of-theme-events-not-found">
      <h1>Session not found</h1>
      <p>
        This link no longer points to a session on the agenda. Head back to
        the homepage, or open the schedule to find what you were looking for.
      </p>
      <p>
        <a className="of-theme-events-not-found-link" href="/">
          Back to home
        </a>
      </p>
    </main>
  );
}

export default NotFoundTemplate;
