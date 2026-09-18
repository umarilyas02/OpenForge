function NotFoundTemplate() {
  return (
    <main className="of-theme-music-not-found">
      <h1>This track skipped</h1>
      <p>
        This link no longer points anywhere. Head back to the homepage, or
        check the tour dates to see where we are playing next.
      </p>
      <p>
        <a className="of-theme-music-not-found-link" href="/">
          Back to home
        </a>
      </p>
    </main>
  );
}

export default NotFoundTemplate;
