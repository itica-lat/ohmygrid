import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { stateManager } from "../state";
import { generateReactExport, generateHtmlExport } from "../../../src/utils/exportUtils";

export function registerExportTools(server: McpServer): void {
  server.tool(
    "export_grid",
    "Generate exportable code for the current grid (React TSX or HTML)",
    {
      format: z
        .enum(["react", "html"])
        .default("react")
        .describe("Export format: 'react' for React TSX, 'html' for standalone HTML"),
    },
    async ({ format }) => {
      const state = stateManager.getState();
      if (state.cells.length === 0) {
        return {
          content: [{ type: "text", text: "Grid is empty — add some cells before exporting." }],
          isError: true,
        };
      }

      const code = format === "react" ? generateReactExport(state) : generateHtmlExport(state);
      return {
        content: [
          {
            type: "text",
            text: code,
          },
        ],
      };
    },
  );
}
