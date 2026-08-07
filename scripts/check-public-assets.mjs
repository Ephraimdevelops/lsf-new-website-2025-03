import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const publicRoot = fileURLToPath(new URL("../public", import.meta.url));
const forbiddenExtensions = new Set([
  ".alfa",
  ".cgi",
  ".phar",
  ".php",
  ".phtml",
  ".pl",
  ".sh",
]);
const forbiddenNames = new Set([".htaccess"]);
const violations = [];

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(path);
      continue;
    }

    if (forbiddenNames.has(entry.name) || forbiddenExtensions.has(extname(entry.name).toLowerCase())) {
      violations.push(relative(publicRoot, path));
    }
  }
}

await scan(publicRoot);

if (violations.length > 0) {
  console.error("Forbidden executable-looking files found under public/:\n" + violations.join("\n"));
  process.exitCode = 1;
}
