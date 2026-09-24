// Lets Node's built-in TypeScript support run app modules outside Next:
// resolves the "@/" alias and extensionless imports, and stubs "server-only".
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);

export async function resolve(specifier, context, next) {
  if (specifier === "server-only") return { url: "data:text/javascript,export {}", shortCircuit: true };
  let url;
  if (specifier.startsWith("@/")) url = new URL(specifier.slice(2), root);
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) url = new URL(specifier, context.parentURL);
  if (url && !/\.[cm]?[jt]sx?$/.test(url.pathname)) {
    for (const ext of [".ts", ".tsx", "/index.ts"]) {
      const candidate = new URL(url.href + ext);
      if (existsSync(fileURLToPath(candidate))) return next(candidate.href, context);
    }
  }
  return next(url ? url.href : specifier, context);
}
