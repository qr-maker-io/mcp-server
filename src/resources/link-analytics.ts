import type { ApiClient } from '../api-client.js';

export const linkAnalyticsResource = {
  uriTemplate: 'qr://links/{id}/analytics',
  name: 'Link Click Analytics',
  description: 'Click analytics for a tracked short link — total clicks, unique visitors, country and daily breakdown',
  mimeType: 'application/json',
  handler: async (client: ApiClient, id: string) => {
    const result = await client.getLinkAnalytics(id);
    return JSON.stringify(result, null, 2);
  },
};
