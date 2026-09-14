// Lets Node (with built-in type stripping) run the app's TypeScript modules in
// checks: resolves the `@/` alias and extensionless relative imports to .ts/.tsx.
//   node --import ./scripts/lib/ts-hooks.mjs scripts/check-builder-service.ts
import { registerHooks } from "node:module";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../src");

function candidates(base) {
  return [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")];
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    let base = null;
    if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
    else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
      base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (base) {
      for (const file of candidates(base)) {
        if (existsSync(file) && statSync(file).isFile()) {
          return nextResolve(pathToFileURL(file).href, context);
        }
      }
    }
    return nextResolve(specifier, context);
  },
});
