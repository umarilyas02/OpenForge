function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-legal-page">
      <h1 className="of-theme-legal-page-title">{page.title}</h1>
      <div className="of-theme-legal-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
