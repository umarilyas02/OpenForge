function formatPublishedDate(publishedAt) {
  if (!publishedAt) return null;
  return new Date(publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostTemplate({ page, children }) {
  const publishedLabel = formatPublishedDate(page.publishedAt);

  return (
    <article className="of-theme-education-post">
      <header className="of-theme-education-post-header">
        <h1 className="of-theme-education-post-title">{page.title}</h1>
        {publishedLabel ? (
          <time
            className="of-theme-education-post-date"
            dateTime={page.publishedAt}
          >
            {publishedLabel}
          </time>
        ) : null}
      </header>
      <div className="of-theme-education-post-body">{children}</div>
    </article>
  );
}

export default PostTemplate;
