import type { ApiClient } from '../api-client.js';

export const deleteTemplateTool = {
  name: 'delete_template',
  description: 'Permanently delete a QR code style preset. This action cannot be undone. Short links using this style will keep their current QR appearance.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      template_id: { type: 'string', description: 'The style preset ID to delete' },
    },
    required: ['template_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    await client.deleteTemplate(args.template_id);
    return {
      content: [{
        type: 'text' as const,
        text: `Style preset ${args.template_id} has been permanently deleted.`,
      }],
    };
  },
};
