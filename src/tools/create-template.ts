import type { ApiClient } from '../api-client.js';

export const createTemplateTool = {
  name: 'create_template',
  description: 'Save a QR code style preset. Style presets store visual settings (colors, dot styles, logos, dimensions) that can be applied to any content via render_template. Styles are unlimited and do not count against your quota.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      name: { type: 'string', description: 'Style preset name (1-255 chars)' },
      description: { type: 'string', description: 'Optional description (max 1000 chars)' },
      options: {
        type: 'object',
        description: 'QR styling options to save as preset (same as generate_qr style param)',
      },
      tags: { type: 'array', items: { type: 'string' }, description: 'Optional tags for organization (max 20)' },
      is_public: { type: 'boolean', description: 'Whether this style is publicly visible. Default: false.' },
    },
    required: ['name', 'options'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.createTemplate(args);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
