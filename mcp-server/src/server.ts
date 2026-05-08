import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGridTools } from "./tools/grid";
import { registerCellTools } from "./tools/cells";
import { registerBrandTools } from "./tools/brand";
import { registerExportTools } from "./tools/export";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "ohmygrid",
    version: "1.0.0",
  });

  registerGridTools(server);
  registerCellTools(server);
  registerBrandTools(server);
  registerExportTools(server);

  return server;
}
