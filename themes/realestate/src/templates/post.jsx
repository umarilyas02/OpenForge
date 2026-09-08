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
    <article className="of-theme-realestate-post">
      <h1 className="of-theme-realestate-post-title">{page.title}</h1>
      {publishedLabel ? (
        <time
          className="of-theme-realestate-post-date"
          dateTime={page.publishedAt}
        >
          {publishedLabel}
        </time>
      ) : null}
      <div className="of-theme-realestate-post-body">{children}</div>
    </article>
  );
}

export default PostTemplate;
