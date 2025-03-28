import { spawn } from 'child_process';
import { existsSync } from 'fs';

/**
 * Spawn an MCP server process
 * @returns {Object} Server process with stdin/stdout/stderr
 */
export function spawnMCPServer() {
  const serverPath = '/Users/ueha-j/mcp-work/mcp-notifier/build/index.js';
  
  if (!existsSync(serverPath)) {
    throw new Error(`Server file not found: ${serverPath}`);
  }
  
  console.log('Starting MCP server...');
  
  const serverProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  serverProcess.on('error', (err) => {
    console.error('Server process launch error:', err);
    throw err;
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.log('Server log:', data.toString());
  });
  
  return serverProcess;
}

/**
 * Send initialization request to MCP server
 * @param {Object} serverProcess Server process
 * @returns {Promise} Promise that resolves when initialization is complete
 */
export function sendInitializeRequest(serverProcess) {
  return new Promise((resolve, reject) => {
    console.log('Sending initialization request...');
    
    const initializeRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-01-01',
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        },
        capabilities: {}
      }
    };
    
    serverProcess.stdin.write(JSON.stringify(initializeRequest) + '\n');
    
    const responseHandler = (data) => {
      console.log('Server response (initialization):', data.toString());
      
      try {
        const response = JSON.parse(data.toString());
        
        if (response.id === 1) {
          console.log('Initialization complete, sending initialized notification...');
          
          const initializedNotification = {
            jsonrpc: '2.0',
            method: 'initialized',
            params: {}
          };
          
          serverProcess.stdin.write(JSON.stringify(initializedNotification) + '\n');
          serverProcess.stdout.removeListener('data', responseHandler);
          
          // Notify that initialization is complete
          resolve(serverProcess);
        }
      } catch (err) {
        console.error('Response parsing error:', err);
        reject(err);
      }
    };
    
    serverProcess.stdout.on('data', responseHandler);
  });
}

/**
 * Send notification request to MCP server
 * @param {Object} serverProcess Server process
 * @param {string} toolName Tool name to call
 * @param {Object} toolArgs Tool arguments
 * @returns {Promise} Promise that resolves when notification is complete
 */
export function sendNotifyRequest(serverProcess, toolName, toolArgs) {
  return new Promise((resolve, reject) => {
    console.log(`Calling ${toolName} tool...`);
    
    const notifyRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: toolArgs
      }
    };
    
    const responseHandler = (data) => {
      console.log('Server response (notification result):', data.toString());
      serverProcess.stdout.removeListener('data', responseHandler);
      resolve(data.toString());
    };
    
    serverProcess.stdout.on('data', responseHandler);
    serverProcess.stdin.write(JSON.stringify(notifyRequest) + '\n');
  });
}

/**
 * Cleanup server process
 * @param {Object} serverProcess Server process
 */
export function cleanupServer(serverProcess) {
  console.log('Test complete, shutting down server...');
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms Milliseconds to sleep
 * @returns {Promise} Promise that resolves after specified time
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
