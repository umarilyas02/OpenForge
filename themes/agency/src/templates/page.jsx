function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-agency-page">
      <h1 className="of-theme-agency-page-title">{page.title}</h1>
      <div className="of-theme-agency-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
