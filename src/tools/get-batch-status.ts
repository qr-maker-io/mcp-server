import type { ApiClient } from '../api-client.js';

export const getBatchStatusTool = {
  name: 'get_batch_status',
  description: 'Check the status of a batch QR generation job. Use after batch_generate to poll for completion. Returns total, completed, failed counts and individual item statuses.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      batch_id: { type: 'string', description: 'The batch job ID returned by batch_generate' },
    },
    required: ['batch_id'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.getBatchStatus(args.batch_id);
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      }],
    };
  },
};
