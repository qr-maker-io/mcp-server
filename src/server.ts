import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ApiClient, QrMakerApiError } from './api-client.js';

/** Convert a plain JSON Schema object to a Zod raw shape for the MCP SDK.
 *  MCP SDK v1.28+ expects { key: z.string(), ... } not z.object({...}) */
function jsonSchemaToZodShape(schema: any): Record<string, z.ZodType> {
  if (!schema || schema.type !== 'object') return {};
  const props = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const shape: Record<string, z.ZodType> = {};

  for (const [key, def] of Object.entries(props) as [string, any][]) {
    let field: z.ZodType;
    if (def.type === 'string') {
      field = z.string().describe(def.description ?? '');
    } else if (def.type === 'number') {
      field = z.number().describe(def.description ?? '');
    } else if (def.type === 'boolean') {
      field = z.boolean().describe(def.description ?? '');
    } else if (def.type === 'array') {
      field = z.array(z.any()).describe(def.description ?? '');
    } else if (def.type === 'object') {
      field = z.record(z.any()).describe(def.description ?? '');
    } else if (Array.isArray(def.type) && def.type.includes('null')) {
      field = z.string().nullable().describe(def.description ?? '');
    } else {
      field = z.any().describe(def.description ?? '');
    }
    shape[key] = required.has(key) ? field : field.optional();
  }
  return shape;
}

// Tools
import { generateQrTool } from './tools/generate-qr.js';
import { batchGenerateTool } from './tools/batch-generate.js';
import { createLinkTool } from './tools/create-link.js';
import { getLinkAnalyticsTool } from './tools/get-link-analytics.js';
import { listTemplatesTool } from './tools/list-templates.js';
import { createTemplateTool } from './tools/create-template.js';
import { renderTemplateTool } from './tools/render-template.js';
import { getUsageTool } from './tools/get-usage.js';
import { getCapabilitiesTool } from './tools/get-capabilities.js';
import { publishLandingTool } from './tools/publish-landing.js';
import { listLinksTool } from './tools/list-links.js';
import { getLinkTool } from './tools/get-link.js';
import { getBatchStatusTool } from './tools/get-batch-status.js';
import { getLandingTool } from './tools/get-landing.js';
import { updateLinkTool } from './tools/update-link.js';
import { deleteLinkTool } from './tools/delete-link.js';
import { updateTemplateTool } from './tools/update-template.js';
import { deleteTemplateTool } from './tools/delete-template.js';
import { updateLandingTool } from './tools/update-landing.js';

// Resources
import { templatesResource, templateDetailResource } from './resources/templates.js';
import { usageResource } from './resources/usage.js';
import { linkAnalyticsResource } from './resources/link-analytics.js';

const ALL_TOOLS = [
  // QR generation
  generateQrTool,
  batchGenerateTool,
  getBatchStatusTool,
  // Links CRUD
  createLinkTool,
  listLinksTool,
  getLinkTool,
  updateLinkTool,
  deleteLinkTool,
  getLinkAnalyticsTool,
  // Style presets (templates) CRUD
  createTemplateTool,
  listTemplatesTool,
  updateTemplateTool,
  deleteTemplateTool,
  renderTemplateTool,
  // Landings
  publishLandingTool,
  getLandingTool,
  updateLandingTool,
  // Account
  getUsageTool,
  getCapabilitiesTool,
];

function formatError(err: unknown) {
  if (err instanceof QrMakerApiError) {
    let text = `Error: ${err.message}`;
    if (err.suggestion) text += `\nSuggestion: ${err.suggestion}`;
    if (err.details) text += `\nDetails: ${JSON.stringify(err.details)}`;
    return { content: [{ type: 'text' as const, text }], isError: true };
  }
  return {
    content: [{ type: 'text' as const, text: `Error: ${(err as Error).message}` }],
    isError: true,
  };
}

export function createServer(apiKey: string, baseUrl: string) {
  const client = new ApiClient({ apiKey, baseUrl });

  const server = new McpServer({
    name: 'qr-maker',
    version: '0.1.0',
  });

  // Register tools (convert plain JSON schemas to Zod for MCP SDK v1.28+)
  for (const tool of ALL_TOOLS) {
    const zodSchema = jsonSchemaToZodShape(tool.inputSchema);
    server.tool(
      tool.name,
      tool.description,
      zodSchema as any,
      async (args: any) => {
        try {
          return await tool.handler(client, args);
        } catch (err) {
          return formatError(err);
        }
      },
    );
  }

  // Register static resources
  server.resource(
    templatesResource.name,
    templatesResource.uri,
    { description: templatesResource.description, mimeType: templatesResource.mimeType },
    async () => ({
      contents: [{ uri: templatesResource.uri, text: await templatesResource.handler(client), mimeType: templatesResource.mimeType }],
    }),
  );

  server.resource(
    usageResource.name,
    usageResource.uri,
    { description: usageResource.description, mimeType: usageResource.mimeType },
    async () => ({
      contents: [{ uri: usageResource.uri, text: await usageResource.handler(client), mimeType: usageResource.mimeType }],
    }),
  );

  // Register dynamic resources (templates by ID, link analytics by ID)
  server.resource(
    templateDetailResource.name,
    templateDetailResource.uriTemplate,
    { description: templateDetailResource.description, mimeType: templateDetailResource.mimeType },
    async (uri: any) => {
      const id = String(uri.pathname?.split('/').pop() ?? uri);
      return {
        contents: [{ uri: String(uri), text: await templateDetailResource.handler(client, id), mimeType: templateDetailResource.mimeType }],
      };
    },
  );

  server.resource(
    linkAnalyticsResource.name,
    linkAnalyticsResource.uriTemplate,
    { description: linkAnalyticsResource.description, mimeType: linkAnalyticsResource.mimeType },
    async (uri: any) => {
      // Extract link ID from qr://links/{id}/analytics
      const parts = String(uri).replace('qr://', '').split('/');
      const id = parts[1] ?? '';
      return {
        contents: [{ uri: String(uri), text: await linkAnalyticsResource.handler(client, id), mimeType: linkAnalyticsResource.mimeType }],
      };
    },
  );

  return server;
}
