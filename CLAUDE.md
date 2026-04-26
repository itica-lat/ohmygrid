# CLAUDE.md — ohmygrid

Guidelines for AI agents working in this repository.

## Tech stack

| Layer           | Choice                                        |
| --------------- | --------------------------------------------- |
| Framework       | React 19 + TypeScript                         |
| Build           | Vite 8                                        |
| Package manager | **Bun** (use `bun` not `npm`/`yarn`)          |
| Styling         | TailwindCSS v4 via `@tailwindcss/vite` plugin |
| Linter          | OxLint (`bun run lint`)                       |
| Formatter       | OxFMT (`bun run fmt`)                         |

## Commands

```bash
bun install          # install deps
bun run dev          # start dev server (Vite)
bun run build        # production build → dist/
bun run lint         # oxlint .
bun run fmt          # oxfmt .
```

## Project structure

```
src/
  types.ts                   # All TypeScript interfaces and union types
  main.tsx                   # React root mount
  App.tsx                    # Root component, useReducer + localStorage
  index.css                  # TailwindCSS v4 + glass-morphism utility classes
  state/
    initialState.ts          # DEFAULT_BRAND, INITIAL_CELLS, createDefaultContent
    reducer.ts               # All actions and the main reducer
  components/
    TopBar.tsx               # Header: mode toggle, grid dims, template picker
    BrandPanel.tsx           # Left sidebar: brand tokens, Google Fonts, presets
    Canvas.tsx               # Grid engine, free-mode drag-to-place
    CellEditor.tsx           # Right sidebar: position editor with overlap check, content forms
    ExportModal.tsx          # Copy / download React TSX or HTML
    ImportModal.tsx          # Import a previously exported .tsx or .html
    TemplatesModal.tsx       # Browse, load, delete templates
    cells/
      TextCell.tsx
      ImageCell.tsx
      StatCard.tsx
      FeatureCard.tsx
      TagCloud.tsx
      CodeSnippet.tsx
      BannerCell.tsx
  utils/
    brandCssVars.ts          # Brand tokens → CSS custom properties
    exportUtils.ts           # generateReactExport / generateHtmlExport
    importParser.ts          # Parse exported .tsx/.html back into GridCell[]
    localStorage.ts          # Save/load user templates and brand presets
    templates.ts             # 5 built-in templates
```

## Key types (`src/types.ts`)

- `GridCell` — `{ id, colStart, rowStart, colSpan, rowSpan, content, customBackground?, customBorderRadius?, customPadding? }`
- `CellContent` — union: `TextContent | ImageContent | StatContent | FeatureContent | TagCloudContent | CodeContent | BannerContent`
- `BrandTokens` — colors, font, radius scale, spacing scale, logo (base64), `customFontUrl`
- `EditorState` — full app state stored in localStorage under `'ohmygrid-state-v1'`
- `SavedTemplate` / `SavedBrand` — user-saved presets stored under separate localStorage keys

## State management

Single `useReducer` in `App.tsx`. All mutations go through `dispatch()`. Actions in `src/state/reducer.ts`:

`SET_MODE` · `SET_GRID_CONFIG` · `ADD_CELL` · `UPDATE_CELL` · `DELETE_CELL` · `SELECT_CELL` · `SET_BRAND` · `OPEN_EXPORT` · `CLOSE_EXPORT` · `SET_EXPORT_TAB` · `SET_ACTIVE_TEMPLATE` · `RESET` · `LOAD_EXAMPLE` · `LOAD_STATE`

## Styling conventions

- All UI is inline styles + the utility classes defined in `src/index.css` (`@layer utilities`):  
  `.glass` · `.glass-card` · `.glass-strong` · `.input-base` · `.btn-primary` · `.btn-ghost` · `.btn-icon` · `.section-label` · `.tab-btn` · `.code-block`
- TailwindCSS utility classes can be used anywhere but inline styles take precedence.
- Glass-morphism palette: near-black `#0a0a0f` background, `rgba(255,255,255,0.07)` borders, `#6366f1` accent.

## Cell overlap prevention

`CellEditor` checks every geometry change with `cellsOverlap()` + `wouldOverlap()` before dispatching. If a collision is detected, it sets `geoError` local state and blocks the dispatch. Do not remove this guard.

## Adding a new cell type

1. Add interface to `src/types.ts` and include in the `CellContent` union.
2. Add a `case` to `createDefaultContent()` in `src/state/initialState.ts`.
3. Create `src/components/cells/NewCell.tsx`.
4. Wire the import and `case` in `Canvas.tsx` → `renderCellContent()`.
5. Add a `case` in `CellEditor.tsx` → content editor section + `CONTENT_TYPE_LABELS`.
6. Add rendering in `exportUtils.ts` for both HTML and React export.

## Don't

- Do not run `npm` or `yarn`. Always use `bun`.
- Do not add a router or backend; this is a fully client-side SPA.
- Do not add new npm dependencies without a strong reason.
- Do not bypass the overlap check in `CellEditor`.
