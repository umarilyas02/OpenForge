export default async function Page() {
  const message = await Promise.resolve("Portable source");

  return (
    <main>
      <h1>{message}</h1>
    </main>
  );
}
