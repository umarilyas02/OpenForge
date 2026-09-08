function PageTemplate({ page, children }) {
  const kicker = page?.kicker ?? page?.section ?? null;
  const standfirst = page?.description ?? null;

  return (
    <main className="of-theme-magazine-page">
      <header className="of-theme-magazine-page-header">
        {kicker ? <p className="of-theme-magazine-kicker">{kicker}</p> : null}
        <h1 className="of-theme-magazine-page-title">{page.title}</h1>
        {standfirst ? (
          <p className="of-theme-magazine-page-standfirst">{standfirst}</p>
        ) : null}
      </header>
      <div className="of-theme-magazine-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
