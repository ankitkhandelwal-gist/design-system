# Design system: component instructions

The template for every component is `templates/component/`. It is the source of truth for structure.
Every component, with no exceptions, lives in `src/components/<Name>/` with exactly this file set:

```
<Name>/
  <Name>.tsx            implementation
  <Name>.meta.ts        metadata via defineMeta (see src/meta/types.ts); what agents read to pick and compose components
  <Name>.tokens.css     component-scoped tokens (--ds-<kebab-name>-*) plus the component styles
  <Name>.stories.tsx    visual test surface
  <Name>.test.tsx       behavior tests
  index.ts              single canonical export
```

## Creating a component
1. Run `npm run new:component -- <Name> [atoms|molecules|organisms]`. This copies the template. Never create the folder by hand.
2. Implement `<Name>.tsx`, then replace every `TODO` in `<Name>.meta.ts`.
3. Keep meta in sync with props, variants and tokens: any change to one means updating the other.
4. Add stories for each variant and tests for each behavior listed in meta (keyboard support, states).
5. Run `npm run check:meta`, `npm run typecheck` and `npm test`. All must pass.
6. Building from Figma: read every variant's variable bindings with the Figma MCP (use_figma), map them to `--ds-*` tokens, and verify sizes in the `AllStates`-style story against Figma. See `src/components/Button` as the reference implementation.

## Changing the structure
Edit `templates/component/` and the required-file list in `scripts/check-meta.ts` together.

## Tokens
Global tokens live in `src/tokens/` (generated, never hand-edited) and are loaded in `.storybook/preview.tsx`.
Source of truth: `tokens/figma-tokens.json` (primitives, spacing, radius, typography, shadows) `tokens/semantic-colors.txt` (semantic colors) and `tokens/tag-colors.txt` (Tag collection), exported from the Figma file.
Regenerate with `npm run build:tokens`.

- Components must consume **semantic** tokens (`--ds-color-button-primary-bg`), not primitives, and never hardcode colors, sizes or radii.
- Text styles: use the `.ds-text-<category>-<size>-<weight>` classes (e.g. `ds-text-body-14-medium`), one per Figma text style, or compose from the font tokens.
- Naming: `--ds-color-*`, `--ds-font-*`, `--ds-line-height-*`, `--ds-letter-spacing-*`, `--ds-spacing-*`, `--ds-radius-*`, `--ds-icon-size-*`, `--ds-shadow-*`.
- Component-scoped tokens in `<Name>.tokens.css` should alias these globals.
- Meta `tokens` sections list the global token names a component uses.

## Icons
Icons come from Google Material Symbols (Rounded, 400) via `@material-symbols/svg-400` (Apache-2.0, see `THIRD_PARTY_NOTICES.md`). Do not copy or generate SVG files.
- Import icons from `src/icons` (`import { SearchIcon } from "../../icons"`), never from the package directly in components. Each icon is its own import, so apps only bundle what they use.
- Naming: `<Name>Icon` is the outline style, `<Name>FilledIcon` the filled style (e.g. `InfoIcon`, `InfoFilledIcon`).
- To add an icon: add one `export` line to `src/icons/index.ts`. File names use underscores (`node_modules/@material-symbols/svg-400/rounded/`). Pick outline or `-fill` by looking at the Figma icon.
- Icons use `currentColor` and a 1em default size (svgr options in `vite.svgr.ts`). Components size and color them through CSS, so pass them as `leadingIcon`/`trailingIcon` props and never set colors or sizes on the icon itself.
- The Storybook icon dropdowns list every `*Icon` exported from `src/icons` automatically.
