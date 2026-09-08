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
    <article className="of-theme-restaurant-post">
      <h1 className="of-theme-restaurant-post-title">{page.title}</h1>
      {publishedLabel ? (
        <time
          className="of-theme-restaurant-post-date"
          dateTime={page.publishedAt}
        >
          {publishedLabel}
        </time>
      ) : null}
      <div className="of-theme-restaurant-post-body">{children}</div>
    </article>
  );
}

export default PostTemplate;
