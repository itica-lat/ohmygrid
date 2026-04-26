import type { GridCell, GridConfig, CellContent } from "../types";
import { newId } from "../state/initialState";

interface ParseResult {
  gridConfig: GridConfig;
  cells: GridCell[];
}

// ─── HTML parser ──────────────────────────────────────────────────────────────

export function parseHtmlExport(html: string): ParseResult | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Parse grid config from <style> block
    const styleText = doc.querySelector("style")?.textContent ?? "";
    const columns = extractInt(styleText, /grid-template-columns:\s*repeat\((\d+)/) ?? 4;
    const rows = extractInt(styleText, /grid-template-rows:\s*repeat\((\d+)/) ?? 3;
    const gap = extractInt(styleText, /gap:\s*(\d+)px/) ?? 16;
    const padding = extractInt(styleText, /padding:\s*(\d+)px/) ?? 24;

    const gridEl = doc.querySelector(".bento-grid");
    if (!gridEl) return null;

    const cells: GridCell[] = [];
    let idCounter = Date.now();

    Array.from(gridEl.children).forEach((el) => {
      const styleAttr = (el as HTMLElement).getAttribute("style") ?? "";
      const colStart = extractInt(styleAttr, /grid-column:\s*(\d+)/) ?? 1;
      const rowStart = extractInt(styleAttr, /grid-row:\s*(\d+)/) ?? 1;
      const colSpan =
        extractInt(styleAttr, /span\s+(\d+)(?=[^;]*grid-column|;)/) ??
        extractInt(styleAttr, /grid-column:[^;]*span\s+(\d+)/) ??
        1;
      const rowSpan = extractInt(styleAttr, /grid-row:[^;]*span\s+(\d+)/) ?? 1;

      const content = detectHtmlContent(el as HTMLElement);

      cells.push({
        id: `imp-${idCounter++}`,
        colStart,
        rowStart,
        colSpan,
        rowSpan,
        content,
      });
    });

    return { gridConfig: { columns, rows, gap, padding }, cells };
  } catch {
    return null;
  }
}

// ─── TSX parser ───────────────────────────────────────────────────────────────

export function parseTsxExport(tsx: string): ParseResult | null {
  try {
    const columns = extractInt(tsx, /gridTemplateColumns:\s*"repeat\((\d+)/) ?? 4;
    const rows = extractInt(tsx, /gridTemplateRows:\s*"repeat\((\d+)/) ?? 3;
    const gap = extractInt(tsx, /gap:\s*(\d+),/) ?? 16;
    const padding = extractInt(tsx, /padding:\s*(\d+),/) ?? 24;

    const cells: GridCell[] = [];
    let idCounter = Date.now();

    // Match each <div key="..." style={{ gridColumn: "C / span S", gridRow: "R / span RS" ... }}>
    const cellRegex = /<div\s+key="([^"]+)"\s+style=\{\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\}/g;
    let match: RegExpExecArray | null;

    while ((match = cellRegex.exec(tsx)) !== null) {
      const styleStr = match[2];
      const colStr = /gridColumn:\s*"(\d+)\s*\/\s*span\s*(\d+)"/.exec(styleStr);
      const rowStr = /gridRow:\s*"(\d+)\s*\/\s*span\s*(\d+)"/.exec(styleStr);
      if (!colStr || !rowStr) continue;

      const colStart = parseInt(colStr[1]);
      const colSpan = parseInt(colStr[2]);
      const rowStart = parseInt(rowStr[1]);
      const rowSpan = parseInt(rowStr[2]);

      // Extract inner JSX content (between > and next </div> at the same level)
      const startIdx = match.index + match[0].length;
      const innerMatch = extractInnerContent(tsx, startIdx);
      const content = detectJsxContent(innerMatch);

      cells.push({ id: `imp-${idCounter++}`, colStart, rowStart, colSpan, rowSpan, content });
    }

    if (cells.length === 0) return null;
    return { gridConfig: { columns, rows, gap, padding }, cells };
  } catch {
    return null;
  }
}

// ─── Content detection ────────────────────────────────────────────────────────

function detectHtmlContent(el: HTMLElement): CellContent {
  const html = el.innerHTML;

  // Image
  if (el.querySelector("img") && !el.querySelector("h2")) {
    const img = el.querySelector("img") as HTMLImageElement;
    return { type: "image", src: img.src, alt: img.alt, fit: "cover", position: "center center" };
  }

  // Code snippet (pre/code)
  if (el.querySelector("pre")) {
    const pre = el.querySelector("pre")!;
    const langEl = el.querySelector("span");
    return {
      type: "code",
      language: langEl?.textContent?.trim() ?? "code",
      code: pre.textContent?.trim() ?? "",
    };
  }

  // Tag cloud (multiple spans with border-radius 9999)
  const spans = el.querySelectorAll("span");
  if (spans.length > 2 && !el.querySelector("h2")) {
    const tags = Array.from(spans)
      .map((s) => s.textContent?.trim() ?? "")
      .filter(Boolean);
    return { type: "tagcloud", tags };
  }

  // Stat card (uppercase label + big value)
  const allSpans = Array.from(spans);
  if (allSpans.length >= 2 && el.querySelector("span")) {
    const texts = allSpans.map((s) => s.textContent?.trim() ?? "");
    if (texts.length >= 2 && !el.querySelector("strong")) {
      return {
        type: "stat",
        label: texts[0] ?? "",
        value: texts[1] ?? "",
        trend: texts[2] ?? "",
        trendDirection: "neutral",
      };
    }
  }

  // Feature card (emoji + strong + p)
  if (el.querySelector("strong") && spans.length > 0) {
    const icon = spans[0]?.textContent?.trim() ?? "✨";
    const title = el.querySelector("strong")?.textContent?.trim() ?? "";
    const desc = el.querySelector("p")?.textContent?.trim() ?? "";
    return { type: "feature", icon, title, description: desc };
  }

  // Text block (default)
  const h2 = el.querySelector("h2")?.textContent?.trim() ?? "";
  const ps = Array.from(el.querySelectorAll("p")).map((p) => p.textContent?.trim() ?? "");

  // Detect if contains HTML for banner
  if (html.includes("linear-gradient")) {
    return {
      type: "banner",
      title: h2,
      subtitle: ps[0] ?? "",
      showLogo: false,
      logoPosition: "left",
      gradientFrom: "#6366f1",
      gradientTo: "#06b6d4",
      gradientAngle: 135,
      textAlign: "left",
    };
  }

  return {
    type: "text",
    heading: h2,
    subheading: ps[0] ?? "",
    body: ps[1] ?? "",
    align: "left",
    headingSize: "lg",
  };
}

function detectJsxContent(jsx: string): CellContent {
  // Code snippet
  if (jsx.includes("<pre") || jsx.includes("<code")) {
    const codeMatch = />\s*([\s\S]*?)\s*<\/code>/.exec(jsx);
    return {
      type: "code",
      language: "tsx",
      code: codeMatch?.[1]?.replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim() ?? "",
    };
  }

  // Image
  if (jsx.includes("<img")) {
    const srcMatch = /src="([^"]*)"/.exec(jsx);
    const altMatch = /alt="([^"]*)"/.exec(jsx);
    return {
      type: "image",
      src: srcMatch?.[1] ?? "",
      alt: altMatch?.[1] ?? "",
      fit: "cover",
      position: "center center",
    };
  }

  // Feature card (emoji + strong)
  if (jsx.includes("<strong") && jsx.includes("<span")) {
    const iconMatch = /<span[^>]*>\s*([^\s<]{1,4})\s*<\/span>/.exec(jsx);
    const titleMatch = /<strong[^>]*>\s*([\s\S]*?)\s*<\/strong>/.exec(jsx);
    const descMatch = /<p[^>]*>\s*([\s\S]*?)\s*<\/p>/.exec(jsx);
    return {
      type: "feature",
      icon: iconMatch?.[1]?.trim() ?? "✨",
      title: titleMatch?.[1]?.trim() ?? "",
      description: descMatch?.[1]?.trim() ?? "",
    };
  }

  // Tag cloud
  const spanMatches = [...jsx.matchAll(/<span[^>]*>\s*([\s\S]*?)\s*<\/span>/g)];
  if (spanMatches.length > 2) {
    const tags = spanMatches.map((m) => m[1].trim()).filter(Boolean);
    return { type: "tagcloud", tags };
  }

  // Stat (3+ standalone spans)
  const inlineSpans = [...jsx.matchAll(/<span[^>]*>(.*?)<\/span>/gs)];
  if (inlineSpans.length >= 2) {
    const texts = inlineSpans.map((m) => m[1].trim());
    return {
      type: "stat",
      label: texts[0] ?? "",
      value: texts[1] ?? "",
      trend: texts[2] ?? "",
      trendDirection: "neutral",
    };
  }

  // Text
  const h2Match = /<h2[^>]*>\s*([\s\S]*?)\s*<\/h2>/.exec(jsx);
  const pMatches = [...jsx.matchAll(/<p[^>]*>\s*([\s\S]*?)\s*<\/p>/g)];
  return {
    type: "text",
    heading: h2Match?.[1]?.trim() ?? "",
    subheading: pMatches[0]?.[1]?.trim() ?? "",
    body: pMatches[1]?.[1]?.trim() ?? "",
    align: "left",
    headingSize: "lg",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractInt(text: string, re: RegExp): number | null {
  const m = re.exec(text);
  return m ? parseInt(m[1]) : null;
}

function extractInnerContent(tsx: string, startIdx: number): string {
  // Find content until the matching </div> (handles one level of nesting)
  let depth = 0;
  let i = startIdx;
  const end = Math.min(startIdx + 2000, tsx.length);
  while (i < end) {
    if (tsx[i] === "<") {
      if (tsx.slice(i, i + 2) === "</") {
        if (depth === 0) return tsx.slice(startIdx, i);
        depth--;
      } else if (!tsx.slice(i).match(/^<[^/]/)) {
        // self-closing or text
      } else {
        depth++;
      }
    }
    i++;
  }
  return tsx.slice(startIdx, end);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export function parseExportFile(content: string, filename: string): ParseResult | null {
  const isTsx = filename.endsWith(".tsx") || filename.endsWith(".ts") || filename.endsWith(".jsx");
  if (isTsx) return parseTsxExport(content);
  return parseHtmlExport(content);
}

export { newId };
