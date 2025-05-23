// Integration Test Suite for NosytOS95

async function testFileSystemIntegration() {
  console.log('Testing File System Integration...');
  
  // Test file creation and event propagation
  try {
    NosytFS.createFile('C:\\test.txt', 'Test content');
    await new Promise(resolve => {
      NosytFS.addEventListener('fileCreated', (data) => {
        console.log('✓ File creation event received');
        resolve();
      });
    });
  } catch (error) {
    console.error('✗ File creation test failed:', error);
  }

  // Test clipboard operations
  try {
    NosytExplorer.clipboard = null;
    NosytExplorer.selectedItems.clear();
    NosytExplorer.selectedItems.add('C:\\test.txt');
    NosytExplorer.copySelection();
    console.log('✓ Clipboard operation successful');
  } catch (error) {
    console.error('✗ Clipboard test failed:', error);
  }

  // Test drag-drop simulation
  try {
    const dragEvent = new DragEvent('dragstart', {
      dataTransfer: new DataTransfer()
    });
    document.querySelector('.folder-item[data-path="C:\\test.txt"]')
      .dispatchEvent(dragEvent);
    console.log('✓ Drag-drop simulation successful');
  } catch (error) {
    console.error('✗ Drag-drop test failed:', error);
  }
}

async function testWindowManagement() {
  console.log('Testing Window Management...');
  
  // Test window focus handling
  try {
    const windows = document.querySelectorAll('.win95-window');
    windows.forEach(win => {
      win.click();
      const isActive = win.classList.contains('active');
      console.log(`✓ Window focus test: ${isActive ? 'passed' : 'failed'}`);
    });
  } catch (error) {
    console.error('✗ Window focus test failed:', error);
  }

  // Test taskbar integration
  try {
    const taskbarItems = document.querySelectorAll('.taskbar-item');
    console.log(`✓ Found ${taskbarItems.length} taskbar items`);
  } catch (error) {
    console.error('✗ Taskbar integration test failed:', error);
  }
}

async function testCrossComponentFeatures() {
  console.log('Testing Cross-Component Features...');
  
  // Test start menu integration
  try {
    document.querySelector('.start-button').click();
    const menuVisible = document.querySelector('.start-menu').style.display !== 'none';
    console.log(`✓ Start menu test: ${menuVisible ? 'passed' : 'failed'}`);
  } catch (error) {
    console.error('✗ Start menu test failed:', error);
  }

  // Test context menus
  try {
    const contextEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100
    });
    document.querySelector('.folder-grid').dispatchEvent(contextEvent);
    const menuVisible = document.querySelector('.win95-context-menu').style.display !== 'none';
    console.log(`✓ Context menu test: ${menuVisible ? 'passed' : 'failed'}`);
  } catch (error) {
    console.error('✗ Context menu test failed:', error);
  }
}

async function testPerformance() {
  console.log('Testing Performance...');
  
  // Test file system operations performance
  try {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      NosytFS.createFile(`C:\\test${i}.txt`, 'Test content');
    }
    const end = performance.now();
    console.log(`✓ File system operations: ${end - start}ms for 100 operations`);
  } catch (error) {
    console.error('✗ Performance test failed:', error);
  }

  // Test window rendering performance
  try {
    const start = performance.now();
    document.querySelectorAll('.win95-window').forEach(win => {
      win.style.display = 'none';
      void win.offsetHeight; // Force reflow
      win.style.display = 'block';
    });
    const end = performance.now();
    console.log(`✓ Window rendering: ${end - start}ms`);
  } catch (error) {
    console.error('✗ Window rendering test failed:', error);
  }
}

// Run all tests
async function runIntegrationTests() {
  console.log('Starting Integration Tests...');
  await testFileSystemIntegration();
  await testWindowManagement();
  await testCrossComponentFeatures();
  await testPerformance();
  console.log('Integration Tests Complete');
}

// Execute tests when page is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(runIntegrationTests, 2000); // Wait for system initialization
});