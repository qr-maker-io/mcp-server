import type { ApiClient } from '../api-client.js';

export const listTemplatesTool = {
  name: 'list_templates',
  description: 'List saved QR code style presets. Styles store visual settings (colors, dots, logos) that can be reused across QR codes. Supports cursor pagination.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      cursor: { type: 'string', description: 'Pagination cursor from previous response' },
      limit: { type: 'number', description: 'Number of templates per page (1-100). Default: 25.' },
    },
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.listTemplates(args.cursor, args.limit);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
