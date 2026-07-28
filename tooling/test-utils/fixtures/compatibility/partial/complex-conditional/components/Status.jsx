export function Status({ compact, ready }) {
  return compact ? (
    ready ? (
      <strong>Ready</strong>
    ) : (
      <span>Waiting</span>
    )
  ) : (
    <p>Expanded</p>
  );
}
