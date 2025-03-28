import { 
  spawnMCPServer, 
  sendInitializeRequest, 
  sendNotifyRequest, 
  cleanupServer,
  sleep 
} from './test-utils.js';

/**
 * Test basic notification functionality
 */
export async function testBasicNotification() {
  let serverProcess = null;
  
  try {
    // Start server
    serverProcess = spawnMCPServer();
    
    // Wait for server initialization
    await sleep(2000);
    await sendInitializeRequest(serverProcess);
    
    // Send basic notification
    await sleep(1000);
    await sendNotifyRequest(serverProcess, 'notify', {
      title: 'Test Notification',
      message: 'This is a test notification from MCP server',
      sound: true
    });
    
    // Wait for notification to be processed
    await sleep(1000);
    
    return true;
  } catch (error) {
    console.error('Error during basic notification test:', error);
    throw error;
  } finally {
    if (serverProcess) {
      cleanupServer(serverProcess);
    }
  }
}

// Entry point for individual test execution
if (process.argv[1].endsWith('test-notify.js')) {
  testBasicNotification()
    .then(() => {
      console.log('Basic notification test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}
