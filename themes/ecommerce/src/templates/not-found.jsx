function NotFoundTemplate() {
  return (
    <main className="of-theme-ecommerce-not-found">
      <h1>Page not found</h1>
      <p>
        This product or page is no longer on the shelf. Try the shop index, or
        search for the item by name.
      </p>
      <p>
        <a className="of-theme-ecommerce-not-found-link" href="/shop">
          Back to the shop
        </a>
      </p>
    </main>
  );
}

export default NotFoundTemplate;
