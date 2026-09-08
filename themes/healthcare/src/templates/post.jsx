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
    <article className="of-theme-healthcare-post">
      <h1 className="of-theme-healthcare-post-title">{page.title}</h1>
      {publishedLabel ? (
        <p className="of-theme-healthcare-post-meta">
          <time
            className="of-theme-healthcare-post-date"
            dateTime={page.publishedAt}
          >
            {publishedLabel}
          </time>
          {page.author ? (
            <span className="of-theme-healthcare-post-author">
              {" "}
              &middot; Reviewed by {page.author}
            </span>
          ) : null}
        </p>
      ) : null}
      <div className="of-theme-healthcare-post-body">{children}</div>
    </article>
  );
}

export default PostTemplate;
