import type { EditorState, GridCell, CellContent } from "../types";
import { brandToCssString, borderRadiusValue } from "./brandCssVars";

// ─── helpers ─────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escJsx(s: string): string {
  return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cellStyle(cell: GridCell): string {
  return `grid-column: ${cell.colStart} / span ${cell.colSpan}; grid-row: ${cell.rowStart} / span ${cell.rowSpan};`;
}

// ─── HTML content renderers ───────────────────────────────────────────────────

function renderHtmlContent(content: CellContent): string {
  switch (content.type) {
    case "text":
      return `
    <div style="text-align:${content.align}; display:flex; flex-direction:column; gap:6px; height:100%; justify-content:center;">
      ${content.heading ? `<h2 style="margin:0; font-size:calc(var(--font-base-size) * ${headingMultiplier(content.headingSize)}); color:var(--color-text); font-family:var(--font-family);">${esc(content.heading)}</h2>` : ""}
      ${content.subheading ? `<p style="margin:0; font-size:calc(var(--font-base-size) * 0.9); color:rgba(255,255,255,0.6); font-family:var(--font-family);">${esc(content.subheading)}</p>` : ""}
      ${content.body ? `<p style="margin:0; font-size:var(--font-base-size); color:rgba(255,255,255,0.75); font-family:var(--font-family); line-height:1.6;">${esc(content.body)}</p>` : ""}
    </div>`;
    case "image":
      return `<img src="${esc(content.src)}" alt="${esc(content.alt)}" style="width:100%;height:100%;object-fit:${content.fit};object-position:${content.position};border-radius:var(--radius-scale);" />`;
    case "stat":
      return `
    <div style="display:flex;flex-direction:column;gap:4px;height:100%;justify-content:center;">
      <span style="font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.4);font-family:var(--font-family);">${esc(content.label)}</span>
      <span style="font-size:calc(var(--font-base-size) * 2);font-weight:700;color:var(--color-text);font-family:var(--font-family);line-height:1.1;">${esc(content.value)}</span>
      <span style="font-size:12px;font-weight:500;color:${trendColor(content.trendDirection)};font-family:var(--font-family);">${trendIcon(content.trendDirection)} ${esc(content.trend)}</span>
    </div>`;
    case "feature":
      return `
    <div style="display:flex;flex-direction:column;gap:8px;height:100%;justify-content:center;">
      <span style="font-size:28px;">${content.icon}</span>
      <strong style="font-size:calc(var(--font-base-size) * 1.05);color:var(--color-text);font-family:var(--font-family);">${esc(content.title)}</strong>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);font-family:var(--font-family);line-height:1.5;">${esc(content.description)}</p>
    </div>`;
    case "tagcloud":
      return `
    <div style="display:flex;flex-wrap:wrap;gap:6px;align-content:center;height:100%;">
      ${content.tags.map((t) => `<span style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:9999px;padding:4px 12px;font-size:12px;font-weight:500;color:rgba(255,255,255,0.8);font-family:var(--font-family);">${esc(t)}</span>`).join("\n      ")}
    </div>`;
    case "code":
      return `
    <pre style="margin:0;font-family:ui-monospace,Consolas,monospace;font-size:12px;overflow:auto;height:100%;color:rgba(255,255,255,0.85);line-height:1.6;"><code>${esc(content.code)}</code></pre>`;
  }
}

// ─── JSX content renderers ────────────────────────────────────────────────────

function renderJsxContent(content: CellContent): string {
  switch (content.type) {
    case "text":
      return `
      <div style={{ textAlign: "${content.align}", display: "flex", flexDirection: "column", gap: 6, height: "100%", justifyContent: "center" }}>
        ${content.heading ? `<h2 style={{ margin: 0, fontSize: "calc(var(--font-base-size) * ${headingMultiplier(content.headingSize)})", color: "var(--color-text)", fontFamily: "var(--font-family)" }}>${escJsx(content.heading)}</h2>` : ""}
        ${content.subheading ? `<p style={{ margin: 0, fontSize: "calc(var(--font-base-size) * 0.9)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-family)" }}>${escJsx(content.subheading)}</p>` : ""}
        ${content.body ? `<p style={{ margin: 0, fontSize: "var(--font-base-size)", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-family)", lineHeight: 1.6 }}>${escJsx(content.body)}</p>` : ""}
      </div>`;
    case "image":
      return `<img src="${escJsx(content.src)}" alt="${escJsx(content.alt)}" style={{ width: "100%", height: "100%", objectFit: "${content.fit}", objectPosition: "${content.position}", borderRadius: "var(--radius-scale)" }} />`;
    case "stat":
      return `
      <div style={{ display: "flex", flexDirection: "column", gap: 4, height: "100%", justifyContent: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-family)" }}>${escJsx(content.label)}</span>
        <span style={{ fontSize: "calc(var(--font-base-size) * 2)", fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-family)", lineHeight: 1.1 }}>${escJsx(content.value)}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: "${trendColor(content.trendDirection)}", fontFamily: "var(--font-family)" }}>${trendIcon(content.trendDirection)} ${escJsx(content.trend)}</span>
      </div>`;
    case "feature":
      return `
      <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", justifyContent: "center" }}>
        <span style={{ fontSize: 28 }}>${content.icon}</span>
        <strong style={{ fontSize: "calc(var(--font-base-size) * 1.05)", color: "var(--color-text)", fontFamily: "var(--font-family)" }}>${escJsx(content.title)}</strong>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-family)", lineHeight: 1.5 }}>${escJsx(content.description)}</p>
      </div>`;
    case "tagcloud":
      return `
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignContent: "center", height: "100%" }}>
        ${content.tags.map((t) => `<span style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9999, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-family)" }}>${escJsx(t)}</span>`).join("\n        ")}
      </div>`;
    case "code":
      return `<pre style={{ margin: 0, fontFamily: "ui-monospace,Consolas,monospace", fontSize: 12, overflow: "auto", height: "100%", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}><code>${escJsx(content.code)}</code></pre>`;
  }
}

// ─── shared helpers ───────────────────────────────────────────────────────────

function headingMultiplier(size: string): number {
  const map: Record<string, number> = { sm: 0.9, md: 1.1, lg: 1.4, xl: 1.8, "2xl": 2.4 };
  return map[size] ?? 1.4;
}

function trendColor(dir: string): string {
  if (dir === "up") return "#34d399";
  if (dir === "down") return "#f87171";
  return "rgba(255,255,255,0.5)";
}

function trendIcon(dir: string): string {
  if (dir === "up") return "↑";
  if (dir === "down") return "↓";
  return "→";
}

// ─── React export ─────────────────────────────────────────────────────────────

export function generateReactExport(state: EditorState): string {
  const { gridConfig: g, cells, brand } = state;
  const cellsCode = cells
    .map((cell) => {
      const style = `{ gridColumn: "${cell.colStart} / span ${cell.colSpan}", gridRow: "${cell.rowStart} / span ${cell.rowSpan}", background: ${cell.customBackground ? `"${cell.customBackground}"` : '"var(--color-surface)"'}, borderRadius: ${cell.customBorderRadius ? `"${cell.customBorderRadius}"` : '"var(--radius-scale)"'}, padding: ${cell.customPadding ? `"${cell.customPadding}"` : '"calc(var(--font-base-size) * var(--spacing-scale))"'}, overflow: "hidden" }`;
      return `      <div key="${cell.id}" style={${style}}>\n        ${renderJsxContent(cell.content).trim()}\n      </div>`;
    })
    .join("\n");

  return `import type React from 'react';

const BRAND_VARS = \`
  --color-primary: ${brand.colorPrimary};
  --color-secondary: ${brand.colorSecondary};
  --color-accent: ${brand.colorAccent};
  --color-bg: ${brand.colorBackground};
  --color-surface: ${brand.colorSurface};
  --color-text: ${brand.colorText};
  --font-family: ${brand.fontFamily};
  --font-base-size: ${brand.fontBaseSize}px;
  --font-ratio: ${brand.fontRatio};
  --radius-scale: ${borderRadiusValue(brand.borderRadiusScale)};
  --spacing-scale: ${spacingValue(brand.spacingScale)};
\`;

export function BentoGrid(): React.ReactElement {
  return (
    <div style={{ background: "var(--color-bg)", padding: ${g.padding}, fontFamily: "var(--font-family)" }}>
      <style dangerouslySetInnerHTML={{ __html: \`:root {\${BRAND_VARS}}\` }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(${g.columns}, 1fr)",
          gridTemplateRows: "repeat(${g.rows}, minmax(100px, 1fr))",
          gap: ${g.gap},
        }}
      >
${cellsCode}
      </div>
    </div>
  );
}
`;
}

function spacingValue(scale: string): string {
  if (scale === "compact") return "0.75";
  if (scale === "relaxed") return "1.5";
  return "1";
}

// ─── HTML export ──────────────────────────────────────────────────────────────

export function generateHtmlExport(state: EditorState): string {
  const { gridConfig: g, cells, brand } = state;
  const cellsHtml = cells
    .map((cell) => {
      const bg = cell.customBackground ?? "var(--color-surface)";
      const radius = cell.customBorderRadius ?? "var(--radius-scale)";
      const pad = cell.customPadding ?? "calc(var(--font-base-size) * var(--spacing-scale))";
      const style = `${cellStyle(cell)} background:${bg}; border-radius:${radius}; padding:${pad}; overflow:hidden; border:1px solid rgba(255,255,255,0.08);`;
      return `    <div style="${style}">\n      ${renderHtmlContent(cell.content).trim()}\n    </div>`;
    })
    .join("\n");

  const cssVars = brandToCssString(brand);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bento Grid</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    :root {
${cssVars}
    }
    body {
      margin: 0;
      padding: 0;
      background: var(--color-bg);
      font-family: var(--font-family);
      color: var(--color-text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(${g.columns}, 1fr);
      grid-template-rows: repeat(${g.rows}, minmax(100px, 1fr));
      gap: ${g.gap}px;
      padding: ${g.padding}px;
      width: 100%;
      max-width: 1200px;
    }
  </style>
</head>
<body>
  <div class="bento-grid">
${cellsHtml}
  </div>
</body>
</html>
`;
}
