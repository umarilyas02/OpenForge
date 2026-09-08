function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-education-page">
      <header className="of-theme-education-page-header">
        <h1 className="of-theme-education-page-title">{page.title}</h1>
        {page.description ? (
          <p className="of-theme-education-page-description">
            {page.description}
          </p>
        ) : null}
      </header>
      <div className="of-theme-education-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
