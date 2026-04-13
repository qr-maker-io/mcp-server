import type { ApiClient } from '../api-client.js';

export const publishLandingTool = {
  name: 'publish_landing',
  description: 'Publish an HTML landing page and get back a hosted URL, tracked short link, and QR code image in one call. The landing is published to CDN and a short link is created for QR tracking. Free-tier landings include a watermark footer.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      html: { type: 'string', description: 'The full HTML content of the landing page. Max 2MB.' },
      title: { type: 'string', description: 'Optional title for the landing page. Max 200 characters.' },
      format: { type: 'string', enum: ['png', 'svg', 'jpg', 'jpeg', 'pdf'], description: 'QR code output format. Default: png.' },
      style: {
        type: 'object',
        description: 'QR code styling options (same as generate_qr style)',
        properties: {
          width: { type: 'number', description: 'Image width in pixels (100-4096). Default: 300.' },
          height: { type: 'number', description: 'Image height in pixels (100-4096). Default: 300.' },
          margin: { type: 'number', description: 'Quiet zone margin (0-100). Default: 10.' },
          dotsOptions: { type: 'object', description: '{ type, color }' },
          backgroundOptions: { type: 'object', description: '{ color }' },
          cornersSquareOptions: { type: 'object', description: '{ type, color }' },
          cornersDotOptions: { type: 'object', description: '{ type, color }' },
        },
      },
    },
    required: ['html'],
  },
  handler: async (client: ApiClient, args: any) => {
    const result = await client.publishLandingWithQr({
      html: args.html,
      title: args.title,
      style: args.style,
      format: args.format,
    });

    // Return text summary (no large base64 in MCP response)
    const lines = [
      `Landing published successfully!`,
      ``,
      `Landing URL: ${result.landing.url}`,
      result.landing.title ? `Title: ${result.landing.title}` : null,
      `Landing ID: ${result.landing.id}`,
      `Version: ${result.landing.version}`,
      ``,
      `Short Link: ${result.short_link?.url ?? result.landing.short_url}`,
      result.manage?.url ? `Manage URL: ${result.manage.url}` : null,
      ``,
      `QR Format: ${result.qr.format}`,
      result.qr.url ? `QR Image URL: ${result.qr.url}` : null,
    ].filter(Boolean);

    return {
      content: [{ type: 'text' as const, text: lines.join('\n') }],
    };
  },
};
