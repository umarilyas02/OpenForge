export async function Renderer({ moduleName }) {
  const module = await import(`./renderers/${moduleName}.js`);
  return module.render();
}
