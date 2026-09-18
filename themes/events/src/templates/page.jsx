function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-events-page">
      <h1 className="of-theme-events-page-title">{page.title}</h1>
      <div className="of-theme-events-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
