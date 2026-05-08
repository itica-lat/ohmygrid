import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { stateManager } from "../state";

export function registerGridTools(server: McpServer): void {
  server.tool(
    "create_grid",
    "Create or reconfigure the grid with specified dimensions",
    {
      columns: z.number().min(1).max(24).describe("Number of columns (1-24)"),
      rows: z.number().min(1).max(24).describe("Number of rows (1-24)"),
      gap: z.number().min(0).max(64).default(16).describe("Gap between cells in px"),
      padding: z.number().min(0).max(128).default(24).describe("Grid outer padding in px"),
    },
    async ({ columns, rows, gap, padding }) => {
      stateManager.reset();
      stateManager.setGridConfig({ columns, rows, gap, padding });
      return {
        content: [
          {
            type: "text",
            text: `Grid created: ${columns}x${rows}, gap=${gap}px, padding=${padding}px`,
          },
        ],
      };
    },
  );

  server.tool(
    "get_grid_state",
    "Get the complete current grid state including cells, brand, and config",
    {},
    async () => {
      const state = stateManager.getState();
      return {
        content: [{ type: "text", text: JSON.stringify(state, null, 2) }],
      };
    },
  );

  server.tool(
    "reset_grid",
    "Reset the grid to blank state (clears all cells, keeps brand)",
    {},
    async () => {
      stateManager.reset();
      return {
        content: [{ type: "text", text: "Grid reset to blank state. Brand tokens preserved." }],
      };
    },
  );

  server.tool(
    "load_example",
    "Load the built-in example/demo grid with sample cells",
    {},
    async () => {
      stateManager.loadExample();
      const count = stateManager.cells.length;
      return {
        content: [{ type: "text", text: `Example grid loaded with ${count} cells.` }],
      };
    },
  );
}
