import type { ApiClient } from '../api-client.js';

export const deleteLinkTool = {
  name: 'delete_link',
  description: 'Permanently delete a short link and all its associated data (QR targets, analytics, landing pages). This action cannot be undone. Consider using update_link with status "disabled" instead.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      link_id: { type: 'string', description: 'The short link ID or code to delete' },
    },
    required: ['link_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    await client.deleteLink(args.link_id);
    return {
      content: [{
        type: 'text' as const,
        text: `Short link ${args.link_id} has been permanently deleted.`,
      }],
    };
  },
};
