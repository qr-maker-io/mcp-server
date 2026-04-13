import type { ApiClient } from '../api-client.js';

export const renderTemplateTool = {
  name: 'render_template',
  description: 'Generate a QR code using a saved style preset. Applies the style settings to the given content. Optionally override specific style properties.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      template_id: { type: 'string', description: 'ID of the template to render' },
      content: { type: 'string', description: 'Data to encode in the QR code (URL, text, etc.)' },
      format: { type: 'string', enum: ['png', 'svg'], description: 'Output format. Default: png.' },
      overrides: { type: 'object', description: 'Optional style overrides to apply on top of the template' },
    },
    required: ['template_id', 'content'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.renderTemplate(args.template_id, {
      content: args.content,
      format: args.format,
      overrides: args.overrides,
    });
    const lines = [`QR rendered from template ${args.template_id}`];
    if (result.url || result.image_url) lines.push(`Image URL: ${result.url || result.image_url}`);
    return {
      content: [
        { type: 'text' as const, text: lines.join('\n') },
        ...(result.format === 'png' && result.image_base64 ? [{
          type: 'image' as const,
          data: result.image_base64,
          mimeType: 'image/png',
        }] : []),
      ],
    };
  },
};
