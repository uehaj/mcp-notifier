import { 
  spawnMCPServer, 
  sendInitializeRequest, 
  sendNotifyRequest, 
  cleanupServer,
  sleep 
} from './test-utils.js';

/**
 * Test advanced notification functionality
 */
export async function testAdvancedNotification() {
  let serverProcess = null;
  
  try {
    // Start server
    serverProcess = spawnMCPServer();
    
    // Wait for server initialization
    await sleep(2000);
    await sendInitializeRequest(serverProcess);
    
    // Send advanced notification
    await sleep(1000);
    await sendNotifyRequest(serverProcess, 'notify-advanced', {
      title: 'Advanced Notification Test',
      message: 'This is an example of a success message',
      type: 'success',
      timeout: 5000,
      closeLabel: 'Close',
      actions: ['Yes', 'No']
    });
    
    // Wait for notification to be processed
    await sleep(1000);
    
    return true;
  } catch (error) {
    console.error('Error during advanced notification test:', error);
    throw error;
  } finally {
    if (serverProcess) {
      cleanupServer(serverProcess);
    }
  }
}

// Entry point for individual test execution
if (process.argv[1].endsWith('test-advanced-notify.js')) {
  testAdvancedNotification()
    .then(() => {
      console.log('Advanced notification test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}
