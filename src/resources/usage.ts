import type { ApiClient } from '../api-client.js';

export const usageResource = {
  uri: 'qr://usage',
  name: 'QR Maker Usage',
  description: 'Current billing period usage, quota limits, and estimated cost',
  mimeType: 'application/json',
  handler: async (client: ApiClient) => {
    const result = await client.getUsage();
    return JSON.stringify(result, null, 2);
  },
};
