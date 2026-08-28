function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-page">
      <h1 className="of-theme-page-title">{page.title}</h1>
      <div className="of-theme-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
