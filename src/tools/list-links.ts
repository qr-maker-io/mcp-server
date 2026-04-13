import type { ApiClient } from '../api-client.js';

export const listLinksTool = {
  name: 'list_links',
  description: 'List tracked short links with click counts. Supports cursor pagination. Returns code, target URL, status, and creation date for each link.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      cursor: { type: 'string', description: 'Pagination cursor from previous response' },
      limit: { type: 'number', description: 'Number of links per page (1-100). Default: 25.' },
    },
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.listLinks(args.cursor, args.limit);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
