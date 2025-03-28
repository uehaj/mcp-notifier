# MCP Notifier

A Model Context Protocol (MCP) server that provides desktop notification capabilities using node-notifier.

## Features

- Simple notification tool
- Advanced notification tool with additional options
- Support for different notification types (info, success, warning, error)
- Customizable notification settings

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

Start the server:

```bash
npm start
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
        "/absolute/path/to/mcp-notifier/build/index.js"
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

You can test the server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## Requirements

- Node.js 14 or higher
- npm 6 or higher
