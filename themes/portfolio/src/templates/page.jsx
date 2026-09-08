function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-portfolio-page">
      <h1 className="of-theme-portfolio-page-title">{page.title}</h1>
      <div className="of-theme-portfolio-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
