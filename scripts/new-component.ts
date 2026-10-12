import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const name = process.argv[2];
const category = process.argv[3] ?? "atoms";
if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("Usage: npm run new:component -- <PascalCaseName> [atoms|molecules|organisms]");
  process.exit(1);
}
if (!["atoms", "molecules", "organisms"].includes(category)) {
  console.error(`Invalid category "${category}"`);
  process.exit(1);
}

const templateDir = resolve("templates/component");
const dir = resolve("src/components", name);
if (existsSync(dir)) {
  console.error(`${dir} already exists`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const fill = (s: string) =>
  s.replaceAll("__Name__", name).replaceAll("__name__", kebab).replaceAll("__category__", category);

const files = readdirSync(templateDir);
for (const file of files) {
  writeFileSync(join(dir, fill(file)), fill(readFileSync(join(templateDir, file), "utf8")));
}
console.log(`Created src/components/${name}/ from templates/component (${files.length} files). Fill in ${name}.meta.ts TODOs.`);
