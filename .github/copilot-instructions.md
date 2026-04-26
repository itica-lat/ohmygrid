# ohmygrid — Copilot Instructions

## Project overview

ohmygrid is a client-side **bento grid designer** SPA. Users compose grid layouts from typed cells, configure a brand system, and export production-ready React TSX or HTML.

## Tech stack

- **React 19** + **TypeScript** (strict, `erasableSyntaxOnly`, `noUnusedLocals`)
- **Vite 8** as bundler and dev server
- **TailwindCSS v4** via `@tailwindcss/vite` (no config file needed)
- **Bun** as package manager — always use `bun`, never `npm` or `yarn`
- **OxLint** + **OxFMT** for lint and format
- No router, no backend, no external state library

## Commands

```bash
bun install      # install
bun run dev      # dev server
bun run build    # production build
bun run lint     # oxlint .
bun run fmt      # oxfmt .
```

## Architecture rules

### State

All app state lives in a single `useReducer` in `App.tsx`. Every mutation must go through `dispatch()`. Never use local `useState` for anything that belongs to the global editor state. Actions are defined in `src/state/reducer.ts`.

### Styling

- Use the utility classes in `src/index.css`: `.glass`, `.glass-card`, `.glass-strong`, `.input-base`, `.btn-primary`, `.btn-ghost`, `.btn-icon`, `.section-label`, `.tab-btn`, `.code-block`
- Inline styles are fine and preferred for dynamic values
- Color palette: `#0a0a0f` background, `#6366f1` accent, `rgba(255,255,255,0.07)` borders

### Cell overlap guard

`CellEditor.tsx` contains `cellsOverlap()` + `wouldOverlap()` helpers. Every geometry update must go through `tryUpdateGeo()`. **Never bypass or remove this check.**

### Cell types

`CellContent` is a discriminated union. To add a new type:

1. Add interface + extend the union in `src/types.ts`
2. Add `case` to `createDefaultContent()` in `src/state/initialState.ts`
3. Create `src/components/cells/NewCell.tsx`
4. Wire in `Canvas.tsx` → `renderCellContent()`
5. Add editor in `CellEditor.tsx` + entry in `CONTENT_TYPE_LABELS`
6. Add render in `exportUtils.ts` (both React and HTML branches)

### localStorage keys

| Key                          | Content                                         |
| ---------------------------- | ----------------------------------------------- |
| `ohmygrid-state-v1`          | Full `EditorState` — auto-saved on every render |
| `ohmygrid-user-templates-v1` | `SavedTemplate[]`                               |
| `ohmygrid-user-brands-v1`    | `SavedBrand[]`                                  |

## Code style

- Functional components only, no class components
- Prefer explicit `React.Dispatch<Action>` prop types over inferring from hooks
- Export named exports, not default exports (except `App.tsx`)
- Do not add comments or docstrings to code that does not require explanation
- Keep components focused — split into sub-components when a single component exceeds ~200 lines
