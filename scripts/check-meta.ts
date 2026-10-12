import { readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { validateMeta } from "../src/meta/defineMeta";
import type { ComponentMeta } from "../src/meta/types";

const root = resolve("src/components");
const failures: string[] = [];

const dirs = existsSync(root)
  ? readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory())
  : [];

const requiredFiles = (name: string) => [
  `${name}.tsx`,
  `${name}.meta.ts`,
  `${name}.tokens.css`,
  `${name}.stories.tsx`,
  `${name}.test.tsx`,
  "index.ts",
];

for (const dir of dirs) {
  for (const f of requiredFiles(dir)) {
    if (!existsSync(join(root, dir, f))) failures.push(`${dir}: missing ${f}`);
  }
  const file = join(root, dir, `${dir}.meta.ts`);
  if (!existsSync(file)) continue;
  const meta: ComponentMeta | undefined = (await import(pathToFileURL(file).href)).default;
  if (!meta) {
    failures.push(`${dir}: ${dir}.meta.ts has no default export`);
    continue;
  }
  if (meta.component.name !== dir) failures.push(`${dir}: component.name is "${meta.component.name}"`);
  for (const e of validateMeta(meta)) failures.push(`${dir}: ${e}`);
}

if (failures.length > 0) {
  console.error(failures.map((f) => `✗ ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${dirs.length} component(s) have valid metadata`);
