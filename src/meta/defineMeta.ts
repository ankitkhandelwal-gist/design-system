import type { ComponentMeta } from "./types";

/** Returns a list of problems with a component's metadata (empty if valid). */
export function validateMeta(meta: ComponentMeta): string[] {
  const errors: string[] = [];
  const { axes, purpose, invalidCombinations = [] } = meta.variants;

  if (!meta.component.name) errors.push("component.name is empty");
  if (!meta.component.description) errors.push("component.description is empty");
  if (!meta.component.path) errors.push("component.path is empty");
  if (!meta.relationships.role) errors.push("relationships.role is empty");

  for (const key of Object.keys(purpose)) {
    const [axis, value] = key.split(".") as [string, string];
    if (!axes[axis]) errors.push(`variants.purpose["${key}"]: unknown axis "${axis}"`);
    else if (!axes[axis].includes(value))
      errors.push(`variants.purpose["${key}"]: "${value}" is not a value of axis "${axis}"`);
  }
  for (const [axis, values] of Object.entries(axes)) {
    for (const value of values) {
      if (!(`${axis}.${value}` in purpose))
        errors.push(`variants.purpose is missing "${axis}.${value}"`);
    }
  }
  invalidCombinations.forEach((combo, i) => {
    for (const [axis, value] of Object.entries(combo.axes)) {
      if (!axes[axis]?.includes(value))
        errors.push(`variants.invalidCombinations[${i}]: "${axis}=${value}" is not a defined variant`);
    }
  });

  if (meta.aiHints.keywords.length === 0) errors.push("aiHints.keywords is empty");
  return errors;
}

/** Every component's `<Name>.meta.ts` must default-export the result of this. */
export function defineMeta<const T extends ComponentMeta>(meta: T): T {
  const errors = validateMeta(meta);
  if (errors.length > 0) {
    throw new Error(`Invalid metadata for "${meta.component.name}":\n- ${errors.join("\n- ")}`);
  }
  return meta;
}
