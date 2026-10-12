# Design system: component instructions

The template for every component is `templates/component/`. It is the source of truth for structure.
Every component, with no exceptions, lives in `src/components/<Name>/` with exactly this file set:

```
<Name>/
  <Name>.tsx            implementation
  <Name>.meta.ts        metadata via defineMeta (see src/meta/types.ts); what agents read to pick and compose components
  <Name>.tokens.css     component-scoped tokens (--ds-<kebab-name>-*)
  <Name>.stories.tsx    visual test surface
  <Name>.test.tsx       behavior tests
  index.ts              single canonical export
```

## Creating a component
1. Run `npm run new:component -- <Name> [atoms|molecules|organisms]`. This copies the template. Never create the folder by hand.
2. Implement `<Name>.tsx`, then replace every `TODO` in `<Name>.meta.ts`.
3. Keep meta in sync with props, variants and tokens: any change to one means updating the other.
4. Add stories for each variant and tests for each behavior listed in meta (keyboard support, states).
5. Run `npm run check:meta` and `npm run typecheck`. Both must pass.

## Changing the structure
Edit `templates/component/` and the required-file list in `scripts/check-meta.ts` together.
