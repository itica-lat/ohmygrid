import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { stateManager } from "../state";

const RADIUS_SCALES = ["sharp", "soft", "pill"] as const;
const SPACING_SCALES = ["compact", "default", "relaxed"] as const;

export function registerBrandTools(server: McpServer): void {
  server.tool(
    "set_brand",
    "Update brand design tokens such as colors, fonts, spacing, and logo",
    {
      colorPrimary: z.string().optional().describe("Primary brand color (hex or CSS color)"),
      colorSecondary: z.string().optional().describe("Secondary brand color"),
      colorAccent: z.string().optional().describe("Accent/highlight color"),
      colorBackground: z.string().optional().describe("Page background color"),
      colorSurface: z.string().optional().describe("Card/surface background color"),
      colorText: z.string().optional().describe("Text color"),
      fontFamily: z.string().optional().describe("Font family name"),
      fontBaseSize: z.number().min(10).max(24).optional().describe("Base font size in pixels"),
      fontRatio: z.number().min(1).max(2).optional().describe("Type scale ratio"),
      borderRadiusScale: z
        .enum(RADIUS_SCALES)
        .optional()
        .describe("Border radius scale: sharp, soft, or pill"),
      spacingScale: z
        .enum(SPACING_SCALES)
        .optional()
        .describe("Spacing scale: compact, default, or relaxed"),
      logo: z.string().optional().describe("Base64-encoded logo data URI"),
      customFontUrl: z.string().optional().describe("URL to a custom web font"),
    },
    async (params) => {
      const cleaned = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined),
      );
      if (Object.keys(cleaned).length === 0) {
        return { content: [{ type: "text", text: "No brand tokens provided to update." }] };
      }
      stateManager.setBrand(cleaned);
      return {
        content: [{ type: "text", text: `Brand updated: ${Object.keys(cleaned).join(", ")}` }],
      };
    },
  );
}
