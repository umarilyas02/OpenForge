function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-construction-page">
      <h1 className="of-theme-construction-page-title">{page.title}</h1>
      <div className="of-theme-construction-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
