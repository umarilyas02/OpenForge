function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-finance-page">
      <h1 className="of-theme-finance-page-title">{page.title}</h1>
      <div className="of-theme-finance-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
