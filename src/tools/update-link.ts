import type { ApiClient } from '../api-client.js';

export const updateLinkTool = {
  name: 'update_link',
  description: 'Update a short link — change target URL, status, or expiration. Set status to "disabled" to deactivate without deleting. The QR code continues to work but redirects will stop.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      link_id: { type: 'string', description: 'The short link ID or code to update' },
      target_url: { type: 'string', description: 'New target URL' },
      status: { type: 'string', enum: ['active', 'disabled'], description: 'Link status' },
      expires_at: { type: ['string', 'null'], description: 'Expiration date (ISO 8601) or null to remove expiry' },
      folder_id: { type: ['string', 'null'], description: 'Folder ID or null to remove from folder' },
    },
    required: ['link_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    const { link_id, ...params } = args;
    const result = await client.updateLink(link_id, params);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
