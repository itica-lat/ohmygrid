import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { stateManager, buildContent, wouldOverlap } from "../state";

const CONTENT_TYPES = ["text", "image", "stat", "feature", "tagcloud", "code", "banner"] as const;
const ALIGN_OPTIONS = ["left", "center", "right"] as const;
const HEADING_SIZE_OPTIONS = ["sm", "md", "lg", "xl", "2xl"] as const;
const IMAGE_FIT_OPTIONS = ["cover", "contain", "fill"] as const;
const TREND_OPTIONS = ["up", "down", "neutral"] as const;
const LOGO_POSITIONS = ["left", "center", "right"] as const;

export function registerCellTools(server: McpServer): void {
  server.tool(
    "add_cell",
    "Add a cell to the grid with specified content type and position",
    {
      type: z.enum(CONTENT_TYPES).describe("Cell content type"),
      colStart: z.number().min(1).describe("Starting column (1-based)"),
      rowStart: z.number().min(1).describe("Starting row (1-based)"),
      colSpan: z.number().min(1).max(12).default(1).describe("Column span width"),
      rowSpan: z.number().min(1).max(12).default(1).describe("Row span height"),
      // ── Text fields ──
      heading: z.string().optional().describe("Text cell: heading text"),
      subheading: z.string().optional().describe("Text cell: subheading text"),
      body: z.string().optional().describe("Text cell: body paragraph"),
      align: z.enum(ALIGN_OPTIONS).optional().describe("Text/Banner cell: text alignment"),
      headingSize: z.enum(HEADING_SIZE_OPTIONS).optional().describe("Text cell: heading size"),
      // ── Image fields ──
      src: z.string().optional().describe("Image cell: source URL"),
      alt: z.string().optional().describe("Image cell: alt text"),
      fit: z.enum(IMAGE_FIT_OPTIONS).optional().describe("Image cell: object-fit mode"),
      position: z
        .string()
        .optional()
        .describe("Image cell: object position (e.g. 'center center')"),
      // ── Stat fields ──
      label: z.string().optional().describe("Stat cell: metric label"),
      value: z.string().optional().describe("Stat cell: metric value"),
      trend: z.string().optional().describe("Stat cell: trend text"),
      trendDirection: z.enum(TREND_OPTIONS).optional().describe("Stat cell: trend direction"),
      // ── Feature fields ──
      icon: z.string().optional().describe("Feature cell: emoji or icon character"),
      title: z.string().optional().describe("Feature/Banner cell: title"),
      description: z.string().optional().describe("Feature cell: description text"),
      // ── Tagcloud fields ──
      tags: z.array(z.string()).optional().describe("Tagcloud cell: array of tag strings"),
      // ── Code fields ──
      language: z.string().optional().describe("Code cell: programming language"),
      code: z.string().optional().describe("Code cell: source code content"),
      // ── Banner fields ──
      subtitle: z.string().optional().describe("Banner cell: subtitle"),
      showLogo: z.boolean().optional().describe("Banner cell: show logo"),
      logoPosition: z.enum(LOGO_POSITIONS).optional().describe("Banner cell: logo position"),
      gradientFrom: z.string().optional().describe("Banner cell: gradient start color"),
      gradientTo: z.string().optional().describe("Banner cell: gradient end color"),
      gradientAngle: z.number().optional().describe("Banner cell: gradient angle in degrees"),
    },
    async (params) => {
      const { type, colStart, rowStart, colSpan, rowSpan, ...rest } = params;

      const geo = { colStart, rowStart, colSpan, rowSpan };
      if (wouldOverlap(stateManager.cells, "", geo)) {
        return {
          content: [
            { type: "text", text: "Error: cell overlaps with an existing cell at this position" },
          ],
          isError: true,
        };
      }

      const content = buildContent(type, rest as Record<string, unknown>);
      const id = stateManager.newCellId();
      stateManager.addCell({ id, ...geo, content });

      return {
        content: [
          {
            type: "text",
            text: `Cell ${id} added at (${colStart}, ${rowStart}) spanning ${colSpan}x${rowSpan}`,
          },
        ],
      };
    },
  );

  server.tool(
    "update_cell",
    "Update a cell's position, span, or style (does not change content)",
    {
      id: z.string().describe("The ID of the cell to update"),
      colStart: z.number().min(1).optional().describe("New starting column"),
      rowStart: z.number().min(1).optional().describe("New starting row"),
      colSpan: z.number().min(1).max(12).optional().describe("New column span"),
      rowSpan: z.number().min(1).max(12).optional().describe("New row span"),
      customBackground: z.string().optional().describe("Custom background color"),
      customBorderRadius: z.string().optional().describe("Custom border radius"),
      customPadding: z.string().optional().describe("Custom padding"),
    },
    async ({
      id,
      colStart,
      rowStart,
      colSpan,
      rowSpan,
      customBackground,
      customBorderRadius,
      customPadding,
    }) => {
      const existing = stateManager.cells.find((c) => c.id === id);
      if (!existing) {
        return { content: [{ type: "text", text: `Error: cell ${id} not found` }], isError: true };
      }

      const geoUpdates: Partial<Record<string, number>> = {};
      if (colStart !== undefined) geoUpdates.colStart = colStart;
      if (rowStart !== undefined) geoUpdates.rowStart = rowStart;
      if (colSpan !== undefined) geoUpdates.colSpan = colSpan;
      if (rowSpan !== undefined) geoUpdates.rowSpan = rowSpan;

      if (Object.keys(geoUpdates).length > 0) {
        const nextGeo = { ...existing, ...geoUpdates };
        if (wouldOverlap(stateManager.cells, id, nextGeo)) {
          return {
            content: [
              { type: "text", text: "Error: position change would overlap with an existing cell" },
            ],
            isError: true,
          };
        }
      }

      stateManager.updateCell(id, {
        ...(colStart !== undefined ? { colStart } : {}),
        ...(rowStart !== undefined ? { rowStart } : {}),
        ...(colSpan !== undefined ? { colSpan } : {}),
        ...(rowSpan !== undefined ? { rowSpan } : {}),
        ...(customBackground !== undefined ? { customBackground } : {}),
        ...(customBorderRadius !== undefined ? { customBorderRadius } : {}),
        ...(customPadding !== undefined ? { customPadding } : {}),
      });

      return { content: [{ type: "text", text: `Cell ${id} updated` }] };
    },
  );

  server.tool(
    "set_cell_content",
    "Replace a cell's content entirely",
    {
      id: z.string().describe("The ID of the cell to update"),
      type: z.enum(CONTENT_TYPES).describe("New content type"),
      // ── Text fields ──
      heading: z.string().optional().describe("Text cell: heading text"),
      subheading: z.string().optional().describe("Text cell: subheading text"),
      body: z.string().optional().describe("Text cell: body paragraph"),
      align: z.enum(ALIGN_OPTIONS).optional().describe("Text/Banner cell: text alignment"),
      headingSize: z.enum(HEADING_SIZE_OPTIONS).optional().describe("Text cell: heading size"),
      // ── Image fields ──
      src: z.string().optional().describe("Image cell: source URL"),
      alt: z.string().optional().describe("Image cell: alt text"),
      fit: z.enum(IMAGE_FIT_OPTIONS).optional().describe("Image cell: object-fit mode"),
      // ── Stat fields ──
      label: z.string().optional().describe("Stat cell: metric label"),
      value: z.string().optional().describe("Stat cell: metric value"),
      trend: z.string().optional().describe("Stat cell: trend text"),
      trendDirection: z.enum(TREND_OPTIONS).optional().describe("Stat cell: trend direction"),
      // ── Feature fields ──
      icon: z.string().optional().describe("Feature cell: emoji or icon"),
      title: z.string().optional().describe("Feature/Banner cell: title"),
      description: z.string().optional().describe("Feature cell: description"),
      // ── Tagcloud fields ──
      tags: z.array(z.string()).optional().describe("Tagcloud cell: array of tags"),
      // ── Code fields ──
      language: z.string().optional().describe("Code cell: language"),
      code: z.string().optional().describe("Code cell: source code"),
      // ── Banner fields ──
      subtitle: z.string().optional().describe("Banner cell: subtitle"),
      showLogo: z.boolean().optional().describe("Banner cell: show logo"),
      logoPosition: z.enum(LOGO_POSITIONS).optional().describe("Banner cell: logo position"),
      gradientFrom: z.string().optional().describe("Banner cell: gradient start color"),
      gradientTo: z.string().optional().describe("Banner cell: gradient end color"),
      gradientAngle: z.number().optional().describe("Banner cell: gradient angle"),
    },
    async ({ id, type, ...rest }) => {
      const existing = stateManager.cells.find((c) => c.id === id);
      if (!existing) {
        return { content: [{ type: "text", text: `Error: cell ${id} not found` }], isError: true };
      }
      const content = buildContent(type, rest as Record<string, unknown>);
      stateManager.updateCell(id, { content });
      return { content: [{ type: "text", text: `Cell ${id} content updated to ${type}` }] };
    },
  );

  server.tool(
    "delete_cell",
    "Remove a cell from the grid by ID",
    {
      id: z.string().describe("The ID of the cell to delete"),
    },
    async ({ id }) => {
      const exists = stateManager.cells.some((c) => c.id === id);
      if (!exists) {
        return { content: [{ type: "text", text: `Error: cell ${id} not found` }], isError: true };
      }
      stateManager.deleteCell(id);
      return { content: [{ type: "text", text: `Cell ${id} deleted` }] };
    },
  );

  server.tool(
    "list_cells",
    "List all cells in the grid with their position, span, and content type",
    {},
    async () => {
      const cells = stateManager.cells;
      if (cells.length === 0) {
        return { content: [{ type: "text", text: "No cells in the grid." }] };
      }
      const summary = cells
        .map(
          (c) =>
            `[${c.id}] ${c.content.type} at (${c.colStart},${c.rowStart}) span ${c.colSpan}x${c.rowSpan}`,
        )
        .join("\n");
      return { content: [{ type: "text", text: `Cells (${cells.length}):\n${summary}` }] };
    },
  );
}
