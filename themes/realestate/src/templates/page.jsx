function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-realestate-page">
      <h1 className="of-theme-realestate-page-title">{page.title}</h1>
      <div className="of-theme-realestate-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
