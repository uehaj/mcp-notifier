# MCP Notifier

A Model Context Protocol (MCP) server that provides desktop notification capabilities using node-notifier.

## Features

- Simple notification tool
- Advanced notification tool with additional options
- Support for different notification types (info, success, warning, error)
- Customizable notification settings

## Installation

```bash
# Install from npm
npm install @uehaj/mcp-notifier

# Or install globally
npm install -g @uehaj/mcp-notifier
```

For development:

```bash
# Clone repository
git clone https://github.com/uehaj/mcp-notifier.git
cd mcp-notifier

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

Start the server:

```bash
# If installed globally
mcp-notifier

# If installed locally
npx @uehaj/mcp-notifier

# Or run directly from the build directory
node build/index.js
```

### Integration with Claude Desktop

1. Edit your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following configuration:

```json
{
  "mcpServers": {
    "mcp-notifier": {
      "command": "node",
      "args": [
        "/absolute/path/to/node_modules/@uehaj/mcp-notifier/build/index.js"
      ]
    }
  }
}
```

3. Restart Claude Desktop

## Available Tools

### notify

Basic notification tool with the following parameters:

- `title`: The notification title (required)
- `message`: The notification message (required)
- `icon`: Optional path to an icon file
- `sound`: Whether to play a sound (optional boolean)
- `wait`: Whether to wait for the notification to close (optional boolean)

### notify-advanced

Advanced notification tool with more options:

- `title`: The notification title (required)
- `message`: The notification message (required)
- `type`: Notification type - "info", "success", "warning", or "error" (optional)
- `timeout`: Auto-close timeout in milliseconds (optional)
- `closeLabel`: Text for close button (macOS only, optional)
- `actions`: Array of action button labels (macOS only, optional)

## Testing

Run tests:

```bash
npm test
```

You can also test the server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## Requirements

- Node.js 14 or higher
- npm 6 or higher

## License

MIT
