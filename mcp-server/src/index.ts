#!/usr/bin/env bun
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const transportFlag = args.find((a) => a.startsWith("--transport="));
  const portFlag = args.find((a) => a.startsWith("--port="));
  const transport = transportFlag ? transportFlag.split("=")[1] : "stdio";
  const port =
    Number.parseInt(process.env.PORT ?? "", 10) ||
    (portFlag ? Number.parseInt(portFlag.split("=")[1], 10) : 3000);

  const server = createServer();

  if (transport === "http") {
    const { WebStandardStreamableHTTPServerTransport } =
      await import("@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js");

    const mcpTransport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
    });

    await server.connect(mcpTransport);

    Bun.serve({
      port,
      async fetch(request) {
        const url = new URL(request.url);
        if (url.pathname === "/mcp") {
          return mcpTransport.handleRequest(request);
        }
        return new Response("Not found", { status: 404 });
      },
    });

    console.error(`ohmygrid MCP server running on http://localhost:${port}/mcp`);
  } else {
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
    console.error("ohmygrid MCP server running on stdio");
  }
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
