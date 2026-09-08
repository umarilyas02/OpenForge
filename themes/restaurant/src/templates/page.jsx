function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-restaurant-page">
      <header className="of-theme-restaurant-page-header">
        {page.eyebrow ? (
          <p className="of-theme-restaurant-page-eyebrow">{page.eyebrow}</p>
        ) : null}
        <h1 className="of-theme-restaurant-page-title">{page.title}</h1>
      </header>
      <div className="of-theme-restaurant-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
