function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-automotive-page">
      <h1 className="of-theme-automotive-page-title">{page.title}</h1>
      <div className="of-theme-automotive-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
