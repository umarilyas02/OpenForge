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
    <article className="of-theme-nonprofit-post">
      <h1 className="of-theme-nonprofit-post-title">{page.title}</h1>
      <p className="of-theme-nonprofit-post-meta">
        {publishedLabel ? (
          <time
            className="of-theme-nonprofit-post-date"
            dateTime={page.publishedAt}
          >
            {publishedLabel}
          </time>
        ) : null}
        {page.author ? (
          <span className="of-theme-nonprofit-post-author">{page.author}</span>
        ) : null}
      </p>
      <div className="of-theme-nonprofit-post-body">{children}</div>
    </article>
  );
}

export default PostTemplate;
