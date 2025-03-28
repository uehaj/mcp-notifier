import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import notifier from "node-notifier";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an MCP server
const server = new McpServer({
  name: "mcp-notifier",
  version: "1.0.0"
});

// Add a notify tool
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

// Add an advanced notify tool with more options
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

// Start the server
async function main() {
  console.error("[INFO] Starting MCP Notifier server...");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[INFO] MCP Notifier server running on stdio");
}

main().catch((error) => {
  console.error("[FATAL] Error in main():", error);
  process.exit(1);
});
