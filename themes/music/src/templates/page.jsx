function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-music-page">
      <h1 className="of-theme-music-page-title">{page.title}</h1>
      <div className="of-theme-music-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
