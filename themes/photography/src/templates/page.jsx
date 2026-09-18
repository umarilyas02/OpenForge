function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-photography-page">
      <h1 className="of-theme-photography-page-title">{page.title}</h1>
      <div className="of-theme-photography-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
