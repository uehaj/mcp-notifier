import { sleep } from './test-utils.js';
import { testBasicNotification } from './test-notify.js';
import { testAdvancedNotification } from './test-advanced-notify.js';

/**
 * Run a function with timeout
 * @param {Function} fn Async function to run
 * @param {number} timeout Timeout in milliseconds
 * @param {string} name Function name for error message
 */
async function runWithTimeout(fn, timeout, name) {
  let timeoutId;
  
  try {
    // Race between function and timeout
    const result = await Promise.race([
      fn(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${name} timed out (${timeout}ms)`));
        }, timeout);
      })
    ]);
    
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function runTests() {
  // Test timeout setting (30 seconds)
  const TEST_TIMEOUT = 30000;
  
  console.log('======================================');
  console.log('Starting MCP Notifier Test Suite');
  console.log('======================================');
  
  try {
    // Test 1: Basic notification test
    console.log('\n▶ Test 1: Basic Notification Test');
    await runWithTimeout(testBasicNotification, TEST_TIMEOUT, 'Basic notification test');
    console.log('✓ Basic notification test completed\n');
    
    // Wait between tests
    await sleep(2000);
    
    // Test 2: Advanced notification test
    console.log('\n▶ Test 2: Advanced Notification Test');
    await runWithTimeout(testAdvancedNotification, TEST_TIMEOUT, 'Advanced notification test');
    console.log('✓ Advanced notification test completed\n');
    
    console.log('======================================');
    console.log('All tests completed successfully!');
    console.log('======================================');
    process.exit(0);
  } catch (error) {
    console.error('Error during test execution:', error);
    process.exit(1);
  }
}

// Run test suite
runTests();
