/**
 * Enhanced System Dialogs for NosytOS95
 *
 * Provides Windows 95-style system dialogs for:
 * - Shutdown
 * - Restart
 * - Log off
 * - Run
 * - Find
 * - Help
 * - Message Box (for disabled applications)
 *
 * @version 1.0.0
 * @author NosytLabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Desktop element for appending dialogs
  const desktop = document.querySelector('.win95-desktop');

  // Set up disabled application icons to show message box
  setupDisabledIcons();

  // Dialog templates
  const dialogTemplates = {
    shutdown: {
      title: 'Shut Down Windows',
      icon: '/images/win95/shutdown.png',
      message: 'Are you sure you want to shut down your computer?',
      buttons: [
        { text: 'Yes', action: 'confirm-shutdown' },
        { text: 'No', action: 'cancel' }
      ]
    },
    restart: {
      title: 'Restart Windows',
      icon: '/images/win95/restart.png',
      message: 'Are you sure you want to restart your computer?',
      buttons: [
        { text: 'Yes', action: 'confirm-restart' },
        { text: 'No', action: 'cancel' }
      ]
    },
    logoff: {
      title: 'Log Off Windows',
      icon: '/images/win95/logoff.png',
      message: 'Are you sure you want to log off?',
      buttons: [
        { text: 'Yes', action: 'confirm-logoff' },
        { text: 'No', action: 'cancel' }
      ]
    },
    run: {
      title: 'Run',
      icon: '/images/win95/run.png',
      message: 'Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.',
      input: true,
      buttons: [
        { text: 'OK', action: 'confirm-run' },
        { text: 'Cancel', action: 'cancel' },
        { text: 'Browse...', action: 'browse' }
      ]
    },
    find: {
      title: 'Find',
      icon: '/images/win95/find.png',
      message: 'Search for files or folders:',
      input: true,
      buttons: [
        { text: 'Find Now', action: 'confirm-find' },
        { text: 'Cancel', action: 'cancel' }
      ]
    },
    error: {
      title: 'Error',
      icon: '/images/win95/error.png',
      message: 'An error has occurred.',
      buttons: [
        { text: 'OK', action: 'cancel' }
      ]
    }
  };

  // Active dialog element
  let activeDialog = null;

  // Create and show a dialog
  function showDialog(type, customMessage = null) {
    // Close any existing dialog
    if (activeDialog) {
      closeDialog();
    }

    // Get dialog template
    const template = dialogTemplates[type];
    if (!template) {
      console.error(`Dialog type "${type}" not found`);
      return;
    }

    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'win95-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'dialog-title');

    // Create dialog header
    const header = document.createElement('div');
    header.className = 'dialog-header';

    const title = document.createElement('div');
    title.id = 'dialog-title';
    title.textContent = template.title;

    const closeButton = document.createElement('button');
    closeButton.className = 'dialog-close';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', closeDialog);

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create dialog content
    const content = document.createElement('div');
    content.className = 'dialog-content';

    if (template.icon) {
      const icon = document.createElement('img');
      icon.className = 'dialog-icon';
      icon.src = template.icon;
      icon.alt = '';
      content.appendChild(icon);
    }

    const message = document.createElement('div');
    message.className = 'dialog-message';
    message.textContent = customMessage || template.message;
    content.appendChild(message);

    // Add input field if needed
    if (template.input) {
      const inputContainer = document.createElement('div');
      inputContainer.className = 'dialog-input-container';

      const input = document.createElement('input');
      input.className = 'dialog-input';
      input.type = 'text';
      input.id = 'dialog-input';

      inputContainer.appendChild(input);
      content.appendChild(inputContainer);
    }

    // Create dialog buttons
    const buttons = document.createElement('div');
    buttons.className = 'dialog-buttons';

    template.buttons.forEach(button => {
      const buttonElement = document.createElement('button');
      buttonElement.className = 'dialog-button';
      buttonElement.textContent = button.text;
      buttonElement.setAttribute('data-action', button.action);

      buttonElement.addEventListener('click', () => {
        handleDialogAction(button.action, type);
      });

      buttons.appendChild(buttonElement);
    });

    // Assemble dialog
    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(buttons);

    // Add to desktop
    if (desktop) {
      desktop.appendChild(dialog);

      // Center dialog
      const left = (desktop.offsetWidth - dialog.offsetWidth) / 2;
      const top = (desktop.offsetHeight - dialog.offsetHeight) / 2;
      dialog.style.left = `${left}px`;
      dialog.style.top = `${top}px`;

      // Focus first button
      const firstButton = dialog.querySelector('.dialog-button');
      if (firstButton) {
        firstButton.focus();
      }

      // Add keyboard navigation
      dialog.addEventListener('keydown', handleDialogKeydown);
    }

    // Store active dialog
    activeDialog = dialog;

    return dialog;
  }

  // Close the active dialog
  function closeDialog() {
    if (!activeDialog) return;

    // Remove dialog
    activeDialog.remove();
    activeDialog = null;
  }

  // Handle dialog button actions
  function handleDialogAction(action, dialogType) {
    switch (action) {
      case 'confirm-shutdown':
        performShutdown();
        break;
      case 'confirm-restart':
        performRestart();
        break;
      case 'confirm-logoff':
        performLogoff();
        break;
      case 'confirm-run':
        performRun();
        break;
      case 'confirm-find':
        performFind();
        break;
      case 'browse':
        showBrowseDialog();
        break;
      case 'cancel':
      default:
        closeDialog();
        break;
    }
  }

  // Handle keyboard navigation in dialog
  function handleDialogKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDialog();
    } else if (e.key === 'Tab') {
      // Keep focus within dialog
      const focusableElements = activeDialog.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Perform shutdown action
  function performShutdown() {
    closeDialog();

    // Show shutdown animation or message
    const shutdownScreen = document.createElement('div');
    shutdownScreen.className = 'shutdown-screen';
    shutdownScreen.innerHTML = `
      <div class="shutdown-message">
        <p>It is now safe to turn off your computer.</p>
      </div>
    `;

    document.body.appendChild(shutdownScreen);
  }

  // Perform restart action
  function performRestart() {
    closeDialog();

    // Show restart animation
    const restartScreen = document.createElement('div');
    restartScreen.className = 'restart-screen';
    restartScreen.innerHTML = `
      <div class="restart-message">
        <p>Windows is restarting...</p>
      </div>
    `;

    document.body.appendChild(restartScreen);

    // Simulate restart after delay
    setTimeout(() => {
      restartScreen.remove();
      window.location.reload();
    }, 3000);
  }

  // Perform logoff action
  function performLogoff() {
    closeDialog();

    // Show logoff animation
    const logoffScreen = document.createElement('div');
    logoffScreen.className = 'logoff-screen';
    logoffScreen.innerHTML = `
      <div class="logoff-message">
        <p>Logging off...</p>
      </div>
    `;

    document.body.appendChild(logoffScreen);

    // Redirect to home page after delay
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }

  // Perform run action
  function performRun() {
    if (!activeDialog) return;

    const input = activeDialog.querySelector('#dialog-input');
    if (!input) return;

    const command = input.value.trim();
    if (!command) return;

    closeDialog();

    // Handle common commands
    switch (command.toLowerCase()) {
      case 'notepad':
        openWindow('notepad-window');
        break;
      case 'explorer':
      case 'my computer':
        openWindow('my-computer-window');
        break;
      case 'msie':
      case 'iexplore':
      case 'internet explorer':
        openWindow('browser-window');
        break;
      case 'cmd':
      case 'command':
        openWindow('terminal-window');
        break;
      default:
        showDialog('error', `Cannot find the file '${command}'. Make sure you typed the name correctly, and then try again.`);
        break;
    }
  }

  // Perform find action
  function performFind() {
    if (!activeDialog) return;

    const input = activeDialog.querySelector('#dialog-input');
    if (!input) return;

    const searchTerm = input.value.trim();
    if (!searchTerm) return;

    closeDialog();

    // Show search results window (to be implemented)
    showDialog('error', 'Search functionality is not implemented in this demo.');
  }

  // Show browse dialog
  function showBrowseDialog() {
    closeDialog();

    // Show file browser (to be implemented)
    showDialog('error', 'Browse functionality is not implemented in this demo.');
  }

  // Helper function to open a window
  function openWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    // Use window manager if available
    if (typeof window.activateWindow === 'function') {
      windowElement.style.display = 'block';
      window.activateWindow(windowId);
    } else {
      // Fallback
      windowElement.style.display = 'block';
      windowElement.style.zIndex = '1000';
    }
  }

  /**
   * Set up disabled application icons to show message box
   */
  function setupDisabledIcons() {
    const disabledIcons = document.querySelectorAll('.disabled-icon');

    disabledIcons.forEach(icon => {
      icon.addEventListener('click', function() {
        const appName = this.querySelector('span').textContent;
        showMessageBox(appName);
      });
    });
  }

  /**
   * Show a message box for disabled applications
   * @param {string} appName - The name of the application
   */
  function showMessageBox(appName) {
    const title = `${appName} - Coming Soon`;
    const message = `${appName} is currently under development and will be available in a future update of NosytOS95.`;
    const icon = '/images/win95/info.png';

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'win95-dialog message-box';

    // Create header
    const header = document.createElement('div');
    header.className = 'dialog-header';
    header.innerHTML = `
      <div class="dialog-title">${title}</div>
      <button class="dialog-close" aria-label="Close dialog">×</button>
    `;

    // Create content
    const content = document.createElement('div');
    content.className = 'dialog-content';
    content.innerHTML = `
      <div class="dialog-icon">
        <img src="${icon}" alt="Information">
      </div>
      <div class="dialog-message">${message}</div>
    `;

    // Create buttons
    const buttons = document.createElement('div');
    buttons.className = 'dialog-buttons';
    buttons.innerHTML = `
      <button class="dialog-button" id="dialog-ok">OK</button>
    `;

    // Assemble dialog
    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(buttons);

    // Add to desktop
    if (desktop) {
      desktop.appendChild(dialog);

      // Center dialog
      const left = (desktop.offsetWidth - dialog.offsetWidth) / 2;
      const top = (desktop.offsetHeight - dialog.offsetHeight) / 2;
      dialog.style.left = `${left}px`;
      dialog.style.top = `${top}px`;

      // Focus OK button
      const okButton = dialog.querySelector('#dialog-ok');
      if (okButton) {
        okButton.focus();
      }

      // Add event listeners
      const closeButton = dialog.querySelector('.dialog-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          desktop.removeChild(dialog);
        });
      }

      okButton.addEventListener('click', () => {
        desktop.removeChild(dialog);
      });

      // Add keyboard navigation
      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          desktop.removeChild(dialog);
        } else if (e.key === 'Enter') {
          okButton.click();
        }
      });
    }
  }

  // Export functions for global use
  window.showShutdownDialog = () => showDialog('shutdown');
  window.showRestartDialog = () => showDialog('restart');
  window.showLogoffDialog = () => showDialog('logoff');
  window.showRunDialog = () => showDialog('run');
  window.showFindDialog = () => showDialog('find');
  window.showErrorDialog = (message) => showDialog('error', message);
  window.showMessageBox = showMessageBox;
});
