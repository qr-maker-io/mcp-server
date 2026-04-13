import type { ApiClient } from '../api-client.js';

export const templatesResource = {
  uri: 'qr://templates',
  name: 'QR Templates',
  description: 'List of saved QR code style templates',
  mimeType: 'application/json',
  handler: async (client: ApiClient) => {
    const result = await client.listTemplates(undefined, 50);
    return JSON.stringify(result, null, 2);
  },
};

export const templateDetailResource = {
  uriTemplate: 'qr://templates/{id}',
  name: 'QR Template Details',
  description: 'Detailed information about a specific QR code template including its style options',
  mimeType: 'application/json',
  handler: async (client: ApiClient, id: string) => {
    const result = await client.getTemplate(id);
    return JSON.stringify(result, null, 2);
  },
};
