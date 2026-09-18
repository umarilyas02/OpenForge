function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-beauty-page">
      <h1 className="of-theme-beauty-page-title">{page.title}</h1>
      <div className="of-theme-beauty-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
