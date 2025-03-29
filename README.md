# MCP Notifier

A Model Context Protocol (MCP) server that provides desktop notification capabilities using node-notifier.

## Features

- Simple notification tool
- Advanced notification tool with additional options
- Support for different notification types (info, success, warning, error)
- Customizable notification settings

## Installation Options

You can use MCP Notifier in two ways:

### Option 1: Install from NPM

```bash
# Install globally
npm install -g @uehaj/mcp-notifier

# Or install locally in your project
npm install @uehaj/mcp-notifier
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
```

## Running the Server

### If installed from NPM:

```bash
# If installed globally
mcp-notifier

# If installed locally
npx @uehaj/mcp-notifier
```

### If cloned from source:

```bash
# From the project directory
npm run build
node build/index.js
```

## Integration with Claude Desktop

1. Edit your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Choose one of the following configuration methods:

### For NPM installation:

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

### For local git clone:

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

### Installation via Smithery:
```bash
# Install using Smithery CLI
npx @smithery/cli install @uehaj/mcp-notifier
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
npm test
```

You can also test the server using the MCP Inspector:

```bash
# For NPM installation
npx @modelcontextprotocol/inspector npx @uehaj/mcp-notifier

# For git clone
npx @modelcontextprotocol/inspector node build/index.js
```

## Requirements

- Node.js 18 or higher
- npm 6 or higher
- Desktop environment (Windows, macOS, or Linux)
- Access permissions to notification system

## License

MIT
