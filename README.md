# @qr-maker/mcp-server

[![Glama score](https://glama.ai/mcp/servers/qr-maker-io/mcp-server/badges/score.svg)](https://glama.ai/mcp/servers/qr-maker-io/mcp-server)
[![npm](https://img.shields.io/npm/v/@qr-maker/mcp-server)](https://www.npmjs.com/package/@qr-maker/mcp-server)

MCP (Model Context Protocol) server for [QR Maker](https://qr-maker.io) — generate styled QR codes, manage dynamic short links with click analytics, and publish micro-landing pages from any AI assistant.

## Quick Start

### Claude Code

Add to `~/.claude/claude_code_config.json`:

```json
{
  "mcpServers": {
    "qr-maker": {
      "command": "npx",
      "args": [
        "@qr-maker/mcp-server",
        "--api-key=qk_live_YOUR_API_KEY"
      ]
    }
  }
}
```

Restart Claude Code and type `/mcp` to verify.

### Cursor / Windsurf

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "qr-maker": {
      "command": "npx",
      "args": ["@qr-maker/mcp-server", "--api-key=qk_live_YOUR_API_KEY"]
    }
  }
}
```

### Environment Variables

Instead of `--api-key`, you can set:

```bash
export QR_MAKER_API_KEY=qk_live_YOUR_API_KEY
export QR_MAKER_API_URL=https://api.qr-maker.io  # default
```

## Get Your API Key

1. Sign up at [qr-maker.io](https://qr-maker.io)
2. Go to **Settings → API Keys**
3. Click **Create Key** and copy it

## Available Tools (19)

### QR Code Generation
| Tool | Description |
|------|-------------|
| `generate_qr` | Generate a styled QR code with custom colors, dots, logos, and frames |
| `batch_generate` | Batch generate up to 100 QR codes (Pro+) |
| `get_batch_status` | Poll batch job status |

### Short Links
| Tool | Description |
|------|-------------|
| `create_short_link` | Create a tracked short link with click analytics |
| `list_links` | List short links with click counts |
| `get_link` | Get details of a specific short link |
| `update_link` | Update target URL, status, or expiration |
| `delete_link` | Permanently delete a short link |
| `get_link_analytics` | Click analytics — countries, devices, daily breakdown |

### Style Presets
| Tool | Description |
|------|-------------|
| `create_template` | Save a reusable QR style preset |
| `list_templates` | List saved style presets |
| `update_template` | Update a style preset |
| `delete_template` | Delete a style preset |
| `render_template` | Generate QR using a saved style preset |

### Landing Pages
| Tool | Description |
|------|-------------|
| `publish_landing` | Publish HTML landing page + short link + QR in one call |
| `get_landing` | Get landing page details |
| `update_landing` | Update landing HTML and re-publish |

### Account
| Tool | Description |
|------|-------------|
| `get_usage` | Check current quota and usage |
| `get_capabilities` | Feature matrix for your plan |

## Example Prompts

Once connected, try:

- "Generate a QR code for my website with purple rounded dots"
- "Create a short link for https://qr-maker.io and show me the analytics"
- "Publish a landing page for my restaurant with a menu and WhatsApp button"
- "List my style presets and render one with new content"

## Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector \
  npx @qr-maker/mcp-server -- \
  --api-key=qk_live_YOUR_KEY
```

## Documentation

- [Quick Start](https://qr-maker.io/docs/quickstart)
- [API Reference](https://qr-maker.io/docs/api)
- [MCP Server Guide](https://qr-maker.io/docs/agents)
- [ChatGPT Integration](https://qr-maker.io/docs/chatgpt)
- [OpenAPI Spec](https://api.qr-maker.io/v2/openapi.json)

## License

MIT
