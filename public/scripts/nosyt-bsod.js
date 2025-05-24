/**
 * NosytOS95 Blue Screen of Death (BSOD)
 * A realistic Windows 95 BSOD implementation
 */

// Create a global namespace for BSOD
window.NosytBSOD = window.NosytBSOD || {};

// BSOD state
const bsodState = {
  active: false,
  errorCodes: [
    'UNEXPECTED_KERNEL_MODE_TRAP',
    'KMODE_EXCEPTION_NOT_HANDLED',
    'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED',
    'IRQL_NOT_LESS_OR_EQUAL',
    'PAGE_FAULT_IN_NONPAGED_AREA',
    'DRIVER_IRQL_NOT_LESS_OR_EQUAL',
    'KERNEL_STACK_INPAGE_ERROR',
    'INACCESSIBLE_BOOT_DEVICE',
    'NTFS_FILE_SYSTEM',
    'FAT_FILE_SYSTEM'
  ],
  errorMessages: [
    'A fatal exception has occurred at 0028:C00D1DE1 in VXD VMM(01) + 00010E36.',
    'A fatal exception 0E has occurred at 0028:C00D1DE1 in VXD VMM(01) + 00010E36.',
    'A fatal exception 0D has occurred at 0028:C00D1DE1 in VXD VMM(01) + 00010E36.',
    'A fatal exception 0A has occurred at 0028:C00D1DE1 in VXD VMM(01) + 00010E36.',
    'A fatal exception 0C has occurred at 0028:C00D1DE1 in VXD VMM(01) + 00010E36.'
  ],
  drivers: [
    'NDIS.VXD',
    'MMSYSTEM.DLL',
    'USER.EXE',
    'GDI.EXE',
    'KERNEL32.DLL',
    'MSGSRV32.EXE',
    'EXPLORER.EXE',
    'SHELL32.DLL',
    'NOSYT.DLL',
    'DUCK.DRV',
    'DOOM.DRV'
  ]
};

/**
 * Initialize the BSOD
 */
function initBSOD() {
  console.log('NosytOS95 BSOD initialized');
  
  // Add keyboard shortcut for BSOD (Ctrl+Alt+B)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'b') {
      triggerBSOD();
    }
  });
  
  // Add BSOD to error menu
  const errorMenuItem = document.querySelector('[data-action="trigger-bsod"]');
  if (errorMenuItem) {
    errorMenuItem.addEventListener('click', triggerBSOD);
  }
}

/**
 * Trigger the BSOD
 */
function triggerBSOD(customMessage = null) {
  if (bsodState.active) return;
  
  // Play error sound
  if (window.soundManager) {
    window.soundManager.playSound('critical');
  }
  
  // Create BSOD element
  const bsod = document.createElement('div');
  bsod.className = 'win95-bsod';
  
  // Generate random error
  const errorCode = bsodState.errorCodes[Math.floor(Math.random() * bsodState.errorCodes.length)];
  const errorMessage = customMessage || bsodState.errorMessages[Math.floor(Math.random() * bsodState.errorMessages.length)];
  const driver = bsodState.drivers[Math.floor(Math.random() * bsodState.drivers.length)];
  
  // Set BSOD content
  bsod.innerHTML = `
    <div class="bsod-content">
      <div class="bsod-header">
        Windows
      </div>
      <div class="bsod-message">
        <p>A fatal exception ${errorCode} has occurred at ${generateRandomAddress()}.</p>
        <p>The current application will be terminated.</p>
        <p>* Press any key to terminate the current application.</p>
        <p>* Press CTRL+ALT+DEL to restart your computer. You will lose any unsaved information in all applications.</p>
      </div>
      <div class="bsod-details">
        <p>${errorMessage}</p>
        <p>The system has halted. Press CTRL+ALT+DEL to restart.</p>
      </div>
      <div class="bsod-technical">
        <p>Technical information:</p>
        <p>*** STOP: 0x0000000A (0xC000001D, 0x00000002, 0x00000000, 0x8013139C)</p>
        <p>*** ${driver} - Address 8013139C base at 80100000, DateStamp 36b072a0</p>
      </div>
    </div>
  `;
  
  // Add BSOD to body
  document.body.appendChild(bsod);
  
  // Set BSOD state
  bsodState.active = true;
  
  // Add event listener for any key
  document.addEventListener('keydown', handleBSODKeydown);
  
  // Add event listener for mouse click
  document.addEventListener('click', handleBSODClick);
}

/**
 * Handle keydown event for BSOD
 */
function handleBSODKeydown(e) {
  // Check for Ctrl+Alt+Del
  if (e.ctrlKey && e.altKey && e.key === 'Delete') {
    restartSystem();
  } else {
    // Any other key
    closeBSOD();
  }
}

/**
 * Handle click event for BSOD
 */
function handleBSODClick(e) {
  closeBSOD();
}

/**
 * Close the BSOD
 */
function closeBSOD() {
  // Remove BSOD element
  const bsod = document.querySelector('.win95-bsod');
  if (bsod) {
    document.body.removeChild(bsod);
  }
  
  // Reset BSOD state
  bsodState.active = false;
  
  // Remove event listeners
  document.removeEventListener('keydown', handleBSODKeydown);
  document.removeEventListener('click', handleBSODClick);
}

/**
 * Restart the system
 */
function restartSystem() {
  // Play shutdown sound
  if (window.soundManager) {
    window.soundManager.playSound('shutdown');
  }
  
  // Show shutdown screen
  const shutdownScreen = document.createElement('div');
  shutdownScreen.className = 'win95-shutdown';
  shutdownScreen.innerHTML = `
    <div class="shutdown-content">
      <div class="shutdown-message">
        <p>It is now safe to turn off your computer.</p>
      </div>
    </div>
  `;
  
  // Add shutdown screen to body
  document.body.appendChild(shutdownScreen);
  
  // Remove BSOD
  closeBSOD();
  
  // Wait and reload page
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}

/**
 * Generate a random memory address
 */
function generateRandomAddress() {
  const segment = Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
  const offset = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
  return `0x${segment}:${offset}`;
}

// Initialize BSOD when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('NosytOS95 BSOD loading');
  
  // Delay initialization to ensure DOM is fully loaded
  setTimeout(initBSOD, 1000);
});

// Export functions
window.NosytBSOD = {
  triggerBSOD,
  closeBSOD,
  restartSystem
};
