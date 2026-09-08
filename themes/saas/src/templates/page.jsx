function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-saas-page">
      <h1 className="of-theme-saas-page-title">{page.title}</h1>
      <div className="of-theme-saas-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
