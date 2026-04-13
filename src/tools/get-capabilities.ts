import type { ApiClient } from '../api-client.js';

export const getCapabilitiesTool = {
  name: 'get_capabilities',
  description: 'Get the full feature matrix for your current API key tier. Shows available features, rate limits, quota, analytics retention, SLA, and upgrade options. Call this first to understand what operations are available.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
  },
  handler: async (client: ApiClient, _args: any) => {
    const result = await client.getCapabilities();
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
