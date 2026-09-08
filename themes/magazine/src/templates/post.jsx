function formatPublishedDate(publishedAt) {
  if (!publishedAt) return null;
  return new Date(publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostTemplate({ page, children }) {
  const publishedLabel = formatPublishedDate(page?.publishedAt);
  const section = page?.section ?? null;
  const author = page?.author ?? null;
  const standfirst = page?.description ?? null;

  return (
    <article className="of-theme-magazine-post">
      <header className="of-theme-magazine-post-header">
        {section ? (
          <p className="of-theme-magazine-post-section">{section}</p>
        ) : null}
        <h1 className="of-theme-magazine-post-title">{page.title}</h1>
        {standfirst ? (
          <p className="of-theme-magazine-post-standfirst">{standfirst}</p>
        ) : null}
        {author || publishedLabel ? (
          <p className="of-theme-magazine-post-byline">
            {author ? (
              <span className="of-theme-magazine-post-author">By {author}</span>
            ) : null}
            {author && publishedLabel ? (
              <span aria-hidden="true"> · </span>
            ) : null}
            {publishedLabel ? (
              <time
                className="of-theme-magazine-post-date"
                dateTime={page.publishedAt}
              >
                {publishedLabel}
              </time>
            ) : null}
          </p>
        ) : null}
      </header>
      <div className="of-theme-magazine-post-body">{children}</div>
    </article>
  );
}

export default PostTemplate;
