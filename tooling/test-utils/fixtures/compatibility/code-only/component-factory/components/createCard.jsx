export function createCard(variant) {
  return function GeneratedCard({ children }) {
    return <article data-variant={variant}>{children}</article>;
  };
}
