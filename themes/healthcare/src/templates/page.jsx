function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-healthcare-page">
      <header className="of-theme-healthcare-page-header">
        <h1 className="of-theme-healthcare-page-title">{page.title}</h1>
        {page.description ? (
          <p className="of-theme-healthcare-page-summary">{page.description}</p>
        ) : null}
      </header>
      <div className="of-theme-healthcare-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
