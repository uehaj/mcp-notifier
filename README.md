# MCP Notifier

A Model Context Protocol (MCP) server that provides desktop notification capabilities using node-notifier.

## Features

- Simple notification tool
- Advanced notification tool with additional options
- Support for different notification types (info, success, warning, error)
- Customizable notification settings

## Usage Options

You can use MCP Notifier in two ways:

### Option 1: Run Directly with npx (No Installation Required)

You can run the MCP Notifier directly without installing it using npx:

```bash
# Run directly without installation
npx @uehaj/mcp-notifier
```

This will download and execute the package in a single command without installing it globally or locally.

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

### For npx (No Installation) method:

```json
{
  "mcpServers": {
    "mcp-notifier": {
      "command": "npx",
      "args": [
        "@uehaj/mcp-notifier"
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

### Run via Smithery CLI (No Installation):
```bash
# Run directly using Smithery CLI
npx @smithery/cli run @uehaj/mcp-notifier
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
# For npx method
npx @modelcontextprotocol/inspector npx @uehaj/mcp-notifier

# For git clone method
cd mcp-notifier
npx @modelcontextprotocol/inspector node build/index.js
```

## Requirements

- Node.js 18 or higher
- npm 6 or higher (for npx command)
- Desktop environment (Windows, macOS, or Linux)
- Access permissions to notification system

## License

MIT
