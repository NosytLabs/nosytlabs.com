/**
 * Enhanced Help System for NosytOS95
 *
 * Provides a fully functional Windows 95-style help system:
 * - Tab navigation (Contents, Index, Search)
 * - Topic navigation
 * - Content display
 * - Easter eggs
 * - Keyboard navigation
 * - Accessibility features
 *
 * @version 1.0.0
 * @author NosytLabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const helpWindow = document.getElementById('help-window');
  if (!helpWindow) return;

  const helpTabs = helpWindow.querySelectorAll('.help-tab');
  const helpTopics = helpWindow.querySelectorAll('.help-topic');
  const helpPages = helpWindow.querySelectorAll('.help-page');

  // State
  const helpState = {
    activeTab: 'contents',
    activeTopic: 'welcome',
    history: ['welcome'],
    historyIndex: 0,
    easterEggsFound: 0,
    totalEasterEggs: 5
  };

  // Initialize
  function init() {
    setupTabs();
    setupTopics();
    setupSearch();
    setupIndex();
    setupKeyboardNavigation();
    setupEasterEggs();

    // Show initial page
    showHelpPage('welcome');

    console.log('Enhanced Help System initialized');
  }

  // Set up tab navigation
  function setupTabs() {
    helpTabs.forEach(tab => {
      const tabId = tab.getAttribute('data-tab');

      tab.addEventListener('click', () => {
        // Update active tab
        helpTabs.forEach(t => t.classList.remove('help-tab-active'));
        tab.classList.add('help-tab-active');

        // Update state
        helpState.activeTab = tabId;

        // Show/hide search container
        const searchContainer = helpWindow.querySelector('.help-search-container');
        if (searchContainer) {
          searchContainer.style.display = tabId === 'search' ? 'block' : 'none';
        }

        // Show/hide index container
        const indexContainer = helpWindow.querySelector('.help-index-container');
        if (indexContainer) {
          indexContainer.style.display = tabId === 'index' ? 'block' : 'none';
        }

        // Show/hide topics
        const topicsContainer = helpWindow.querySelector('.help-topics');
        if (topicsContainer) {
          topicsContainer.style.display = tabId === 'contents' ? 'block' : 'none';
        }
      });

      // Make tab accessible
      tab.setAttribute('role', 'tab');
      tab.setAttribute('tabindex', '0');
      tab.setAttribute('aria-selected', tabId === helpState.activeTab ? 'true' : 'false');

      // Add keyboard support
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tab.click();
        }
      });
    });
  }

  // Set up topic navigation
  function setupTopics() {
    console.log(`Setting up ${helpTopics.length} help topics`);

    helpTopics.forEach(topic => {
      const topicId = topic.getAttribute('data-topic');
      if (!topicId) {
        console.error('Topic missing data-topic attribute:', topic);
        return;
      }

      // Remove any existing event listeners (in case of re-initialization)
      const newTopic = topic.cloneNode(true);
      topic.parentNode.replaceChild(newTopic, topic);

      // Add click event listener
      newTopic.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Topic clicked: ${topicId}`);
        showHelpPage(topicId);
      });

      // Make topic accessible
      newTopic.setAttribute('role', 'button');
      newTopic.setAttribute('tabindex', '0');
      newTopic.setAttribute('aria-pressed', topicId === helpState.activeTopic ? 'true' : 'false');

      // Add keyboard support
      newTopic.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          newTopic.click();
        }
      });

      // Verify the help page exists
      const helpPage = document.getElementById(`help-${topicId}`);
      if (!helpPage) {
        console.warn(`Help page not found for topic: ${topicId}`);
      }
    });
  }

  // Set up search functionality
  function setupSearch() {
    // Create search container if it doesn't exist
    if (!helpWindow.querySelector('.help-search-container')) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'help-search-container';
      searchContainer.style.display = 'none';

      const searchLabel = document.createElement('label');
      searchLabel.textContent = 'Type the word(s) you want to search for:';
      searchLabel.setAttribute('for', 'help-search-input');

      const searchInput = document.createElement('input');
      searchInput.className = 'help-search-input';
      searchInput.id = 'help-search-input';
      searchInput.type = 'text';

      const searchButton = document.createElement('button');
      searchButton.className = 'help-search-button';
      searchButton.textContent = 'Search';

      searchContainer.appendChild(searchLabel);
      searchContainer.appendChild(document.createElement('br'));
      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(document.createElement('br'));
      searchContainer.appendChild(searchButton);

      // Add search functionality
      searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) return;

        // Search in all help pages
        let results = [];
        helpPages.forEach(page => {
          const pageId = page.id.replace('help-', '');
          const pageContent = page.textContent.toLowerCase();

          if (pageContent.includes(searchTerm)) {
            results.push({
              id: pageId,
              title: page.querySelector('h2').textContent
            });
          }
        });

        // Display results
        displaySearchResults(results, searchTerm);
      });

      // Add to sidebar before topics
      const helpTopics = helpWindow.querySelector('.help-topics');
      helpTopics.parentNode.insertBefore(searchContainer, helpTopics);
    }
  }

  // Display search results
  function displaySearchResults(results, searchTerm) {
    // Create or get results page
    let resultsPage = document.getElementById('help-search-results');
    if (!resultsPage) {
      resultsPage = document.createElement('div');
      resultsPage.className = 'help-page';
      resultsPage.id = 'help-search-results';
      helpWindow.querySelector('.help-content-area').appendChild(resultsPage);
    }

    // Generate results content
    let content = `<h2>Search Results for "${searchTerm}"</h2>`;

    if (results.length === 0) {
      content += `<p>No results found for "${searchTerm}".</p>`;
    } else {
      content += `<p>Found ${results.length} result(s) for "${searchTerm}":</p>`;
      content += '<ul>';

      results.forEach(result => {
        content += `<li><a class="help-link" data-topic="${result.id}">${result.title}</a></li>`;
      });

      content += '</ul>';
    }

    // Add navigation
    content += `
      <div class="help-navigation">
        <button class="help-nav-button" data-action="back">Back</button>
      </div>
    `;

    // Set content and show page
    resultsPage.innerHTML = content;

    // Hide all other pages
    helpPages.forEach(page => {
      page.style.display = 'none';
    });
    resultsPage.style.display = 'block';

    // Add event listeners to links
    resultsPage.querySelectorAll('.help-link').forEach(link => {
      const topicId = link.getAttribute('data-topic');
      link.addEventListener('click', () => {
        showHelpPage(topicId);
      });
    });

    // Add event listener to back button
    const backButton = resultsPage.querySelector('[data-action="back"]');
    if (backButton) {
      backButton.addEventListener('click', () => {
        showHelpPage(helpState.activeTopic);
      });
    }
  }

  // Set up index functionality
  function setupIndex() {
    // Create index container if it doesn't exist
    if (!helpWindow.querySelector('.help-index-container')) {
      const indexContainer = document.createElement('div');
      indexContainer.className = 'help-index-container';
      indexContainer.style.display = 'none';

      const indexLabel = document.createElement('label');
      indexLabel.textContent = 'Type the first few letters of the word you're looking for:';
      indexLabel.setAttribute('for', 'help-index-input');

      const indexInput = document.createElement('input');
      indexInput.className = 'help-index-input';
      indexInput.id = 'help-index-input';
      indexInput.type = 'text';

      const indexList = document.createElement('div');
      indexList.className = 'help-index-list';

      // Add index items
      const indexItems = [
        { title: 'Applications', topic: 'applications' },
        { title: 'Desktop', topic: 'desktop' },
        { title: 'Easter Eggs', topic: 'easter-eggs' },
        { title: 'Help System', topic: 'welcome' },
        { title: 'Keyboard Shortcuts', topic: 'shortcuts' },
        { title: 'NosytOS95', topic: 'welcome' },
        { title: 'Start Menu', topic: 'start-menu' },
        { title: 'Windows', topic: 'windows' }
      ];

      indexItems.forEach(item => {
        const indexItem = document.createElement('div');
        indexItem.className = 'help-index-item';
        indexItem.textContent = item.title;
        indexItem.setAttribute('data-topic', item.topic);

        indexItem.addEventListener('click', () => {
          showHelpPage(item.topic);
        });

        indexList.appendChild(indexItem);
      });

      // Add filter functionality
      indexInput.addEventListener('input', () => {
        const filter = indexInput.value.trim().toLowerCase();

        indexList.querySelectorAll('.help-index-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(filter) ? 'block' : 'none';
        });
      });

      indexContainer.appendChild(indexLabel);
      indexContainer.appendChild(document.createElement('br'));
      indexContainer.appendChild(indexInput);
      indexContainer.appendChild(indexList);

      // Add to sidebar before topics
      const helpTopics = helpWindow.querySelector('.help-topics');
      helpTopics.parentNode.insertBefore(indexContainer, helpTopics);
    }
  }

  // Show a help page
  function showHelpPage(topicId) {
    console.log(`Showing help page: ${topicId}`);

    // Get the page
    const page = document.getElementById(`help-${topicId}`);
    if (!page) {
      console.error(`Help page not found: help-${topicId}`);
      return;
    }

    // Hide all pages
    helpPages.forEach(p => {
      p.style.display = 'none';
    });

    // Show the selected page
    page.style.display = 'block';

    // Update active topic
    helpTopics.forEach(topic => {
      const id = topic.getAttribute('data-topic');
      if (id === topicId) {
        topic.classList.add('help-topic-active');
        topic.setAttribute('aria-pressed', 'true');
      } else {
        topic.classList.remove('help-topic-active');
        topic.setAttribute('aria-pressed', 'false');
      }
    });

    // Update state and history
    const oldTopic = helpState.activeTopic;
    helpState.activeTopic = topicId;

    // Only add to history if it's a new page
    if (oldTopic !== topicId) {
      // If we navigated back and then to a new page, truncate the history
      if (helpState.historyIndex < helpState.history.length - 1) {
        helpState.history = helpState.history.slice(0, helpState.historyIndex + 1);
      }

      helpState.history.push(topicId);
      helpState.historyIndex = helpState.history.length - 1;
    }

    // Update window title to reflect current topic
    const windowTitle = helpWindow.querySelector('.window-title span');
    if (windowTitle) {
      const pageTitle = page.querySelector('h2')?.textContent || 'NosytOS95 Help';
      windowTitle.textContent = pageTitle;
    }

    // Scroll to top of content
    const contentArea = helpWindow.querySelector('.help-content-area');
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
  }

  // Set up keyboard navigation
  function setupKeyboardNavigation() {
    helpWindow.addEventListener('keydown', (e) => {
      // Alt+Left = Back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateBack();
      }

      // Alt+Right = Forward
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        navigateForward();
      }

      // F1 = Help on Help
      if (e.key === 'F1') {
        e.preventDefault();
        showHelpOnHelp();
      }
    });
  }

  // Navigate back in history
  function navigateBack() {
    if (helpState.historyIndex > 0) {
      helpState.historyIndex--;
      const topicId = helpState.history[helpState.historyIndex];
      showHelpPage(topicId);
    }
  }

  // Navigate forward in history
  function navigateForward() {
    if (helpState.historyIndex < helpState.history.length - 1) {
      helpState.historyIndex++;
      const topicId = helpState.history[helpState.historyIndex];
      showHelpPage(topicId);
    }
  }

  // Show help on help
  function showHelpOnHelp() {
    alert('Help on Help\n\nNavigation:\n- Click on topics in the left panel to view different help pages\n- Use the Contents, Index, and Search tabs to find information\n- Press Alt+Left to go back\n- Press Alt+Right to go forward\n\nTip: There are hidden Easter eggs throughout the help system!');
  }

  // Set up Easter eggs
  function setupEasterEggs() {
    // Konami code Easter egg
    let konamiIndex = 0;
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    helpWindow.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Konami code completed
          activateEasterEgg('konami');
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });

    // Click sequence Easter egg
    let clickSequence = [];
    const targetSequence = ['welcome', 'desktop', 'start-menu', 'windows', 'applications'];

    helpTopics.forEach(topic => {
      topic.addEventListener('click', () => {
        const topicId = topic.getAttribute('data-topic');
        clickSequence.push(topicId);

        // Check if sequence matches
        let match = true;
        for (let i = 0; i < clickSequence.length && i < targetSequence.length; i++) {
          if (clickSequence[i] !== targetSequence[i]) {
            match = false;
            break;
          }
        }

        // If sequence matches and is complete
        if (match && clickSequence.length === targetSequence.length) {
          activateEasterEgg('sequence');
          clickSequence = [];
        }

        // Reset if sequence is too long
        if (clickSequence.length > targetSequence.length) {
          clickSequence = [topicId];
        }
      });
    });
  }

  // Activate an Easter egg
  function activateEasterEgg(type) {
    helpState.easterEggsFound++;

    switch (type) {
      case 'konami':
        alert('🎮 Konami Code Activated! 🎮\n\nYou found an Easter egg!\n\nEaster Eggs Found: ' + helpState.easterEggsFound + '/' + helpState.totalEasterEggs);
        break;
      case 'sequence':
        alert('🔍 Secret Sequence Discovered! 🔍\n\nYou found an Easter egg!\n\nEaster Eggs Found: ' + helpState.easterEggsFound + '/' + helpState.totalEasterEggs);
        break;
      default:
        alert('🥚 Easter Egg Found! 🥚\n\nEaster Eggs Found: ' + helpState.easterEggsFound + '/' + helpState.totalEasterEggs);
    }

    // If all Easter eggs found
    if (helpState.easterEggsFound === helpState.totalEasterEggs) {
      alert('🏆 Congratulations! 🏆\n\nYou found all Easter eggs in the help system!\n\nUnlocking secret content...');
      unlockSecretContent();
    }
  }

  // Unlock secret content
  function unlockSecretContent() {
    // Create secret page
    const secretPage = document.createElement('div');
    secretPage.className = 'help-page';
    secretPage.id = 'help-secret';

    secretPage.innerHTML = `
      <h2>🎉 Secret Content Unlocked! 🎉</h2>
      <p>Congratulations on finding all the Easter eggs in the help system!</p>
      <p>As a reward, here's some secret information about NosytOS95:</p>
      <ul>
        <li>NosytOS95 was created in 2025 by NosytLabs</li>
        <li>The name "Nosyt" is "Tyson" spelled backwards</li>
        <li>There are over 20 hidden Easter eggs throughout NosytOS95</li>
        <li>Try typing "nosyt95" in the Run dialog to access a hidden game</li>
        <li>The blue screen of death can be triggered by pressing Ctrl+Alt+Delete three times</li>
      </ul>
      <p>Thank you for exploring NosytOS95 thoroughly!</p>
    `;

    // Add to help content area
    helpWindow.querySelector('.help-content-area').appendChild(secretPage);

    // Add to topics
    const topicsContainer = helpWindow.querySelector('.help-topics');
    const secretTopic = document.createElement('div');
    secretTopic.className = 'help-topic';
    secretTopic.setAttribute('data-topic', 'secret');
    secretTopic.textContent = '🎉 Secret Content';

    secretTopic.addEventListener('click', () => {
      showHelpPage('secret');
    });

    topicsContainer.appendChild(secretTopic);
  }

  // Initialize the help system
  init();
});
