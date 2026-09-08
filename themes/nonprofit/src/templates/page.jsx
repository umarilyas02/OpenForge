function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-nonprofit-page">
      <h1 className="of-theme-nonprofit-page-title">{page.title}</h1>
      {page.summary ? (
        <p className="of-theme-nonprofit-page-summary">{page.summary}</p>
      ) : null}
      <div className="of-theme-nonprofit-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
