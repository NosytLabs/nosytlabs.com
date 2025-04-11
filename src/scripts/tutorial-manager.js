class TutorialManager {
  constructor(vaultUI) {
    this.vaultUI = vaultUI;
    this.steps = {
      'welcome': {
        message: 'Welcome to Vault Shelter! Let\'s learn how to manage your vault.',
        trigger: 'gameStart',
        next: 'resourceIntro'
      },
      'resourceIntro': {
        message: 'These are your vital resources: Food, Water, and Power. Keep them above zero!',
        trigger: 'dashboardVisible',
        element: '#resource-panel',
        next: 'dwellerIntro'
      },
      'dwellerIntro': {
        message: 'These are your dwellers. Drag them to rooms to assign jobs.',
        trigger: 'dwellerListVisible',
        element: '#dweller-list',
        next: 'firstAssignment'
      },
      'firstAssignment': {
        message: 'Try assigning a dweller to Food Production to increase food supply.',
        trigger: 'dwellerAssigned',
        validate: (data) => data.room === 'Food Production',
        next: 'expansionIntro'
      },
      'expansionIntro': {
        message: 'When ready, expand your vault to add new rooms and capabilities.',
        trigger: 'roomAdded',
        element: '#expand-vault',
        next: 'saveIntro'
      },
      'saveIntro': {
        message: 'Remember to save your progress regularly!',
        trigger: 'saveControlsVisible',
        element: '.save-controls',
        next: 'complete'
      },
      'complete': {
        message: 'Tutorial complete! You can revisit tutorials anytime from the Help menu.',
        trigger: null
      }
    };
    
    this.currentStep = null;
    this.completedSteps = new Set();
    this.skipped = false;
    this.loadProgress();
  }

  start() {
    if (this.skipped) return;
    this.currentStep = 'welcome';
    this.showStep();
  }

  showStep() {
    const step = this.steps[this.currentStep];
    if (!step) return;

    // Highlight relevant UI element if specified
    if (step.element) {
      const el = document.querySelector(step.element);
      if (el) el.classList.add('tutorial-highlight');
    }

    this.vaultUI.showAlert(step.message, 'tutorial');
    this.completedSteps.add(this.currentStep);
    this.saveProgress();
  }

  progress(trigger, data) {
    if (this.skipped || !this.currentStep) return;

    const step = this.steps[this.currentStep];
    if (step.trigger === trigger) {
      // Validate step completion if needed
      if (step.validate && !step.validate(data)) return;

      // Remove highlight from current step
      if (step.element) {
        const el = document.querySelector(step.element);
        if (el) el.classList.remove('tutorial-highlight');
      }

      // Move to next step
      if (step.next) {
        this.currentStep = step.next;
        this.showStep();
      }
    }
  }

  skip() {
    this.skipped = true;
    this.currentStep = null;
    
    // Remove any active highlights
    Object.values(this.steps).forEach(step => {
      if (step.element) {
        const el = document.querySelector(step.element);
        if (el) el.classList.remove('tutorial-highlight');
      }
    });

    this.vaultUI.showAlert('Tutorial skipped. You can restart it from the Help menu.', 'info');
    this.saveProgress();
  }

  saveProgress() {
    const progress = {
      currentStep: this.currentStep,
      completedSteps: Array.from(this.completedSteps),
      skipped: this.skipped
    };
    localStorage.setItem('tutorialProgress', JSON.stringify(progress));
  }

  loadProgress() {
    const progress = JSON.parse(localStorage.getItem('tutorialProgress'));
    if (progress) {
      this.currentStep = progress.currentStep;
      this.completedSteps = new Set(progress.completedSteps || []);
      this.skipped = progress.skipped || false;
    }
  }

  addHelpButton() {
    const helpBtn = document.createElement('button');
    helpBtn.id = 'help-button';
    helpBtn.textContent = 'Help';
    helpBtn.addEventListener('click', () => this.showHelpMenu());
    document.querySelector('.expansion-controls').after(helpBtn);
  }

  showHelpMenu() {
    const menu = document.createElement('div');
    menu.id = 'help-menu';
    
    const title = document.createElement('h3');
    title.textContent = 'Help Menu';
    menu.appendChild(title);

    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart Tutorial';
    restartBtn.addEventListener('click', () => {
      this.completedSteps.clear();
      this.skipped = false;
      this.start();
      menu.remove();
    });
    menu.appendChild(restartBtn);

    const skipBtn = document.createElement('button');
    skipBtn.textContent = this.skipped ? 'Enable Tutorial' : 'Skip Tutorial';
    skipBtn.addEventListener('click', () => {
      if (this.skipped) {
        this.skipped = false;
        this.start();
      } else {
        this.skip();
      }
      menu.remove();
    });
    menu.appendChild(skipBtn);

    document.body.appendChild(menu);
  }
}

// Add to VaultUI initialization
document.addEventListener('DOMContentLoaded', () => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/lz-string@1.4.4/libs/lz-string.min.js';
  script.onload = () => {
    const vaultUI = new VaultUI();
    const tutorial = new TutorialManager(vaultUI);
    
    vaultUI.setupSaveControls();
    tutorial.addHelpButton();
    
    // Start tutorial if not completed/skipped
    if (!tutorial.skipped && !tutorial.completedSteps.has('complete')) {
      tutorial.start();
    }

    // Hook into game events for tutorial progression
    document.addEventListener('dwellerAssigned', (e) => {
      tutorial.progress('dwellerAssigned', e.detail);
    });

    document.addEventListener('roomAdded', (e) => {
      tutorial.progress('roomAdded', e.detail);
    });

    // Simulate other triggers
    setTimeout(() => {
      tutorial.progress('dashboardVisible');
      tutorial.progress('dwellerListVisible');
      tutorial.progress('saveControlsVisible');
    }, 1000);
  };
  
  document.head.appendChild(script);
});