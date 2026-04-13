import type { ApiClient } from '../api-client.js';

export const updateTemplateTool = {
  name: 'update_template',
  description: `Update an existing QR code style preset. Accepts partial updates — only the fields you provide are changed; omitted fields keep their current values. The options field, if provided, fully replaces the stored style options. Use this to rename a preset, adjust colors or shapes, change visibility (is_public), or update tags for searchability. Returns the updated template object including its ID, name, options, and timestamps. Call list_templates first if you need to find the template_id.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      template_id: { type: 'string', description: 'The style preset ID to update' },
      name: { type: 'string', description: 'New name' },
      description: { type: 'string', description: 'New description' },
      options: { type: 'object', description: 'New QR styling options (replaces existing)' },
      is_public: { type: 'boolean', description: 'Whether this style is publicly visible' },
      tags: { type: 'array', items: { type: 'string' }, description: 'New tags' },
    },
    required: ['template_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    const { template_id, ...params } = args;
    const result = await client.updateTemplate(template_id, params);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
