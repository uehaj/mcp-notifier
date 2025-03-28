import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import notifier from "node-notifier";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.error("[DEBUG] Initializing MCP Notifier server...");

// Create an MCP server
let server: McpServer;
try {
  console.error("[DEBUG] Creating McpServer instance...");
  server = new McpServer({
    name: "mcp-notifier",
    version: "1.0.0"
  });
  console.error("[DEBUG] McpServer instance created successfully");
  
  // Debug server capabilities
  console.error("[DEBUG] Server configuration:", {
    name: server.name,
    version: server.version
    // tools will be logged after registration
  });
} catch (err) {
  console.error("[FATAL] Failed to create McpServer instance:", err);
  throw err;
}

// Add a notify tool
console.error("[DEBUG] Registering 'notify' tool...");
try {
  server.tool(
    "notify",
    {
      title: z.string().describe("The notification title"),
      message: z.string().describe("The notification message"),
      icon: z.string().optional().describe("Optional icon path"),
      sound: z.boolean().optional().describe("Play a sound with the notification"),
      wait: z.boolean().optional().describe("Wait for the notification to be closed before continuing")
    },
  async ({ title, message, icon, sound, wait }) => {
    try {
      // Debug logging
      console.error(`[DEBUG] notify tool called with: title=${title}, message=${message}, icon=${icon || 'default'}, sound=${sound}, wait=${wait}`);
      
      // Set default icon path if not provided
      const iconPath = icon || path.join(__dirname, "..", "assets", "icon.svg");
      console.error(`[DEBUG] Using icon path: ${iconPath}`);
      
      // Create a promise to handle the notification
      const result = await new Promise((resolve, reject) => {
        console.error(`[DEBUG] Showing notification...`);
        notifier.notify(
          {
            title,
            message,
            icon: iconPath,
            sound: sound === true,
            wait: wait === true
          },
          (err, response) => {
            if (err) {
              console.error(`[ERROR] Notification error: ${err.message}`);
              reject(err);
            }
            console.error(`[DEBUG] Notification response: ${JSON.stringify(response)}`);
            resolve(response);
          }
        );
      });
      
      console.error(`[INFO] Notification displayed successfully`);
      return {
        content: [{
          type: "text",
          text: `Notification displayed successfully: ${JSON.stringify(result)}`
        }]
      };
    } catch (error) {
      console.error(`[ERROR] Notification failed: ${(error as Error).message}`);
      return {
        content: [{
          type: "text",
          text: `Error displaying notification: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
  );
  console.error("[DEBUG] 'notify' tool registered successfully");
} catch (err) {
  console.error("[ERROR] Failed to register 'notify' tool:", err);
  throw err;
}

// Add an advanced notify tool with more options
console.error("[DEBUG] Registering 'notify-advanced' tool...");
try {
  server.tool(
    "notify-advanced",
    {
      title: z.string().describe("The notification title"),
      message: z.string().describe("The notification message"),
      type: z.enum(["info", "success", "warning", "error"]).optional().describe("Notification type"),
      timeout: z.number().optional().describe("Auto-close timeout in milliseconds"),
      closeLabel: z.string().optional().describe("Text for close button (macOS only)"),
      actions: z.array(z.string()).optional().describe("Array of action button labels (macOS only)")
    },
  async ({ title, message, type, timeout, closeLabel, actions }) => {
    try {
      // Debug logging
      console.error(`[DEBUG] notify-advanced tool called with:
        title=${title}, 
        message=${message}, 
        type=${type || 'default'}, 
        timeout=${timeout}, 
        closeLabel=${closeLabel}, 
        actions=${actions ? JSON.stringify(actions) : 'none'}`);
      
      // Set icon based on notification type
      let iconPath;
      switch(type) {
        case "success":
          iconPath = path.join(__dirname, "..", "assets", "success.svg");
          break;
        case "warning":
          iconPath = path.join(__dirname, "..", "assets", "warning.svg");
          break;
        case "error":
          iconPath = path.join(__dirname, "..", "assets", "error.svg");
          break;
        default:
          iconPath = path.join(__dirname, "..", "assets", "info.svg");
          break;
      }
      console.error(`[DEBUG] Using icon path for type ${type}: ${iconPath}`);
      
      // Create a promise to handle the notification
      console.error(`[DEBUG] Showing advanced notification...`);
      const result = await new Promise((resolve, reject) => {
        notifier.notify(
          {
            title,
            message,
            icon: iconPath,
            timeout,
            closeLabel,
            actions,
            sound: true
          },
          (err, response, metadata) => {
            if (err) {
              console.error(`[ERROR] Advanced notification error: ${err.message}`);
              reject(err);
            }
            console.error(`[DEBUG] Advanced notification response: ${JSON.stringify(response)}`);
            console.error(`[DEBUG] Metadata: ${JSON.stringify(metadata)}`);
            resolve({ response, action: metadata?.activationValue });
          }
        );
      });
      
      console.error(`[INFO] Advanced notification displayed successfully`);
      return {
        content: [{
          type: "text",
          text: `Advanced notification displayed successfully: ${JSON.stringify(result)}`
        }]
      };
    } catch (error) {
      console.error(`[ERROR] Advanced notification failed: ${(error as Error).message}`);
      return {
        content: [{
          type: "text",
          text: `Error displaying advanced notification: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
  );
  console.error("[DEBUG] 'notify-advanced' tool registered successfully");
} catch (err) {
  console.error("[ERROR] Failed to register 'notify-advanced' tool:", err);
  throw err;
}

// Start the server
async function main() {
  try {
    console.error("[DEBUG] Node.js version:", process.version);
    console.error("[DEBUG] Current directory:", process.cwd());
    console.error("[DEBUG] Module path:", __dirname);
    console.error("[DEBUG] Import meta URL:", import.meta.url);
    
    console.error("[INFO] Starting MCP Notifier server...");
    console.error("[DEBUG] Creating StdioServerTransport...");
    const transport = new StdioServerTransport();
    
    console.error("[DEBUG] Connecting to transport...");
    await server.connect(transport);
    console.error("[INFO] MCP Notifier server running on stdio");
  } catch (err) {
    console.error("[FATAL] Error in server setup:", err);
    console.error("[DEBUG] Error details:", {
      name: (err as Error).name,
      message: (err as Error).message,
      stack: (err as Error).stack
    });
    throw err;
  }
}

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
  console.error('[DEBUG] Stack trace:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Check for required dependencies
console.error('[DEBUG] Checking for required modules...');
try {
  // Test importing each critical dependency
  console.error('[DEBUG] Testing @modelcontextprotocol/sdk import...');
  const { McpServer: TestServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  console.error('[DEBUG] McpServer imported successfully');
  
  console.error('[DEBUG] Testing node-notifier import...');
  const testNotifier = await import('node-notifier');
  console.error('[DEBUG] node-notifier imported successfully');
  
  console.error('[DEBUG] Testing zod import...');
  const testZod = await import('zod');
  console.error('[DEBUG] zod imported successfully');
} catch (err) {
  console.error('[FATAL] Failed to import required modules:', err);
  process.exit(1);
}

main().catch((error) => {
  console.error("[FATAL] Error in main():", error);
  console.error("[DEBUG] Detailed error:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error.code
  });
  process.exit(1);
});
