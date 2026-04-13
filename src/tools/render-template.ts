import type { ApiClient } from '../api-client.js';

export const renderTemplateTool = {
  name: 'render_template',
  description: `Generate a QR code by applying a saved style preset to new content. Looks up the template by ID, merges any provided overrides on top of the stored style options, then renders the QR code. Returns a public image URL and, for PNG output, an inline base64 image. Use this instead of generate_qr when the user has a saved brand style they want to reuse — avoids re-specifying all style options each time. Use overrides to tweak individual properties (e.g. foreground color) without changing the saved preset.`,
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
