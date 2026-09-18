function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-travel-page">
      <h1 className="of-theme-travel-page-title">{page.title}</h1>
      <div className="of-theme-travel-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
