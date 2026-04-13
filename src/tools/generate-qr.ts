import type { ApiClient } from '../api-client.js';

export const generateQrTool = {
  name: 'generate_qr',
  description: 'Generate a styled QR code image with custom colors, logos, dot styles, and corner shapes. Supports PNG and SVG output. Returns base64-encoded image data. When the content is a URL, a tracked short link is created automatically — the QR encodes the short URL for click analytics.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      content: { type: 'string', description: 'The data to encode in the QR code (URL, text, vCard, etc.). Max 4096 characters.' },
      format: { type: 'string', enum: ['png', 'svg'], description: 'Output image format. Default: png.' },
      template_id: { type: 'string', description: 'Optional template ID to use as base style. Overrides from style param are merged on top.' },
      style: {
        type: 'object',
        description: 'QR code styling options',
        properties: {
          width: { type: 'number', description: 'Image width in pixels (100-4096). Default: 300.' },
          height: { type: 'number', description: 'Image height in pixels (100-4096). Default: 300.' },
          margin: { type: 'number', description: 'Quiet zone margin (0-100). Default: 10.' },
          errorCorrectionLevel: { type: 'string', enum: ['L', 'M', 'Q', 'H'], description: 'Error correction level. Default: M.' },
          dotsOptions: { type: 'object', description: '{ type: "square"|"dots"|"rounded"|"classy"|"classy-rounded", color: "#hex" }' },
          backgroundOptions: { type: 'object', description: '{ color: "#hex" }' },
          cornersSquareOptions: { type: 'object', description: '{ type: "square"|"dot"|"extra-rounded", color: "#hex" }' },
          cornersDotOptions: { type: 'object', description: '{ type: "square"|"dot", color: "#hex" }' },
          image: { type: 'string', description: 'URL of logo image to embed in center of QR code' },
        },
      },
    },
    required: ['content'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.generateQr({
      content: args.content,
      format: args.format,
      style: args.style,
      template_id: args.template_id,
    });
    const lines = [`QR code generated (${result.format}). ID: ${result.id}`];
    if (result.short_link) {
      lines.push(`Short URL: ${result.short_link.url} (tracked — click analytics enabled)`);
    }
    if (result.url || result.image_url) {
      lines.push(`Image URL: ${result.url || result.image_url}`);
    }
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
