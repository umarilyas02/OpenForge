function PageTemplate({ page, children }) {
  return (
    <main className="of-theme-ecommerce-page">
      <h1 className="of-theme-ecommerce-page-title">{page.title}</h1>
      <div className="of-theme-ecommerce-page-body">{children}</div>
    </main>
  );
}

export default PageTemplate;
