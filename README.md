# MCP Notifier

A Model Context Protocol (MCP) server that provides desktop notification capabilities using node-notifier.

## Features

- Simple notification tool
- Advanced notification tool with additional options
- Support for different notification types (info, success, warning, error)
- Customizable notification settings

## Platform Support

This MCP server uses [node-notifier](https://www.npmjs.com/package/node-notifier) and works across multiple platforms:
- **macOS**: Uses macOS Notification Center
- **Windows**: Uses Windows Toast Notifications (Windows 8+) or taskbar balloons (< Windows 8)
- **Linux**: Uses notify-send command for Gnome/Ubuntu notifications

For more details on platform-specific behavior, visit the [node-notifier documentation](https://www.npmjs.com/package/node-notifier).

## Usage Options

You can use MCP Notifier in two ways:

### Option 1: Run Directly from the Published Package

If you're encountering issues with `npx @uehaj/mcp-notifier`, you can run the package directly:

```bash
# Run the server directly with node
npx -p @uehaj/mcp-notifier node -e "import('@uehaj/mcp-notifier/build/index.js')"
```

### Option 2: Clone and Build from Source

```bash
# Clone repository
git clone https://github.com/uehaj/mcp-notifier.git
cd mcp-notifier

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
node build/index.js
```

## Integration with Claude Desktop

1. Edit your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Choose one of the following configuration methods:

### For direct node method:

```json
{
  "mcpServers": {
    "mcp-notifier": {
      "command": "node",
      "args": [
        "-e",
        "import('@uehaj/mcp-notifier/build/index.js')"
      ]
    }
  }
}
```

### For local git clone method:

```json
{
  "mcpServers": {
    "mcp-notifier": {
      "command": "node",
      "args": [
        "/absolute/path/to/cloned/mcp-notifier/build/index.js"
      ]
    }
  }
}
```

3. Restart Claude Desktop

## Smithery Integration

This MCP server is available on [Smithery](https://smithery.ai/server/@uehaj/mcp-notifier). Since it requires desktop access to function properly, it must be installed locally rather than used as a hosted service.

### Run via Node:
```bash
# Run using direct node import
npx -p @uehaj/mcp-notifier node -e "import('@uehaj/mcp-notifier/build/index.js')"
```

### Manual setup from repository:
Follow the "Clone and Build from Source" instructions above.

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
# For direct node import method
npx -p @uehaj/mcp-notifier npx @modelcontextprotocol/inspector node -e "import('@uehaj/mcp-notifier/build/index.js')"

# For git clone method
cd mcp-notifier
npx @modelcontextprotocol/inspector node build/index.js
```

## Requirements

- Node.js 18 or higher
- npm 6 or higher
- Desktop environment (Windows, macOS, or Linux)
- Access permissions to notification system

## License

MIT
