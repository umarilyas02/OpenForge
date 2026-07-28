export default function BlogPostPage({ params }) {
  return <article data-slug={params.slug}>Nested route fixture</article>;
}
