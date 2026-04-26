# ohmygrid

A visual **bento grid designer** built with React 19, TypeScript, and TailwindCSS v4.  
Design, customize, and export production-ready bento layouts as React TSX or standalone HTML.

---

## Features

### Layout engine

- **Free mode** — drag on the canvas to draw cells at any position and size
- **Template mode** — start from one of 5 built-in templates, or save and reload your own

### Cell types

| Type              | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| **Text Block**    | Heading, subheading, body copy with alignment and size controls |
| **Image**         | Any URL or uploaded file, configurable object-fit and position  |
| **Stat Card**     | Large metric value with label and directional trend indicator   |
| **Feature Card**  | Emoji icon + title + description                                |
| **Tag Cloud**     | Editable pill-tag list                                          |
| **Code Snippet**  | Monospace code block with language label                        |
| **Banner / Logo** | CSS gradient background with optional brand logo overlay        |

### Branding system

- Full color token set (primary, secondary, accent, background, surface, text)
- Typography: font family, base size, type scale ratio
- Border radius scale (sharp / soft / pill)
- Spacing scale (compact / default / relaxed)
- Logo upload (stored as base64)
- **Custom Google Fonts URL** — paste any `fonts.googleapis.com` link; family name is auto-detected
- **Brand presets** — save, name, and reload complete brand configurations

### Export

- **React TSX** — copy or download a self-contained component with inline styles
- **HTML/CSS** — standalone file with CSS custom properties, no build step needed

### Import

- Drag-and-drop or file-picker import of previously exported `.tsx` or `.html` files
- Live preview (cell count, grid dimensions) before confirming

### Persistence

All state (layout, cells, brand tokens) is auto-saved to `localStorage` and restored on reload.

---

## Quick start

```bash
# requires Bun — https://bun.sh
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `bun run dev`   | Start Vite dev server      |
| `bun run build` | Production build → `dist/` |
| `bun run lint`  | OxLint                     |
| `bun run fmt`   | OxFMT                      |

---

## Tech stack

- [React 19](https://react.dev) + TypeScript
- [Vite 8](https://vite.dev)
- [TailwindCSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- [Bun](https://bun.sh) as package manager and runtime
- [OxLint](https://oxc.rs/docs/guide/usage/linter) + [OxFMT](https://oxc.rs/docs/guide/usage/formatter)

---

## Project structure

```
src/
  types.ts              All interfaces and union types
  App.tsx               Root — useReducer + localStorage persistence
  state/
    initialState.ts     Defaults and factory functions
    reducer.ts          All actions and reducer
  components/
    TopBar.tsx          Header bar
    BrandPanel.tsx      Left brand panel
    Canvas.tsx          Grid canvas
    CellEditor.tsx      Right cell editor with overlap protection
    ExportModal.tsx
    ImportModal.tsx
    TemplatesModal.tsx
    cells/              One file per cell type
  utils/
    brandCssVars.ts     Brand tokens → CSS variables
    exportUtils.ts      React and HTML export generators
    importParser.ts     Parse exported files back into cells
    localStorage.ts     User template and brand preset persistence
    templates.ts        5 built-in templates
```

---

## License

MIT
