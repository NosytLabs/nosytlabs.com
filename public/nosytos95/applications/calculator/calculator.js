// NosytOS95 Calculator Application
// Windows 95 style calculator with basic arithmetic operations

class CalculatorApp {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.display = '';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.memory = 0;
        this.history = [];
        
        this.init();
    }

    init() {
        this.createCalculatorInterface();
        this.setupEventListeners();
        this.setupKeyboardControls();
        this.updateDisplay();
        console.log('Calculator initialized');
    }

    createCalculatorInterface() {
        this.container.innerHTML = `
            <div class="calculator-app">
                <div class="calculator-menu">
                    <div class="menu-bar">
                        <span class="menu-item" data-menu="view">View</span>
                        <span class="menu-item" data-menu="edit">Edit</span>
                        <span class="menu-item" data-menu="help">Help</span>
                    </div>
                </div>
                <div class="calculator-body">
                    <div class="display-container">
                        <div class="display-screen">
                            <div class="display-text">0</div>
                        </div>
                    </div>
                    <div class="memory-indicators">
                        <div class="memory-indicator" id="memory-indicator" style="visibility: hidden;">M</div>
                    </div>
                    <div class="button-grid">
                        <!-- Memory buttons -->
                        <button class="calc-btn memory-btn" data-action="memory-clear">MC</button>
                        <button class="calc-btn memory-btn" data-action="memory-recall">MR</button>
                        <button class="calc-btn memory-btn" data-action="memory-store">MS</button>
                        <button class="calc-btn memory-btn" data-action="memory-add">M+</button>
                        <button class="calc-btn memory-btn" data-action="memory-subtract">M-</button>
                        
                        <!-- Function buttons -->
                        <button class="calc-btn function-btn" data-action="clear">C</button>
                        <button class="calc-btn function-btn" data-action="clear-entry">CE</button>
                        <button class="calc-btn function-btn" data-action="backspace">⌫</button>
                        <button class="calc-btn function-btn" data-action="sign">±</button>
                        <button class="calc-btn function-btn" data-action="sqrt">√</button>
                        
                        <!-- Number and operation buttons -->
                        <button class="calc-btn number-btn" data-value="7">7</button>
                        <button class="calc-btn number-btn" data-value="8">8</button>
                        <button class="calc-btn number-btn" data-value="9">9</button>
                        <button class="calc-btn operation-btn" data-operation="divide">÷</button>
                        <button class="calc-btn function-btn" data-action="percent">%</button>
                        
                        <button class="calc-btn number-btn" data-value="4">4</button>
                        <button class="calc-btn number-btn" data-value="5">5</button>
                        <button class="calc-btn number-btn" data-value="6">6</button>
                        <button class="calc-btn operation-btn" data-operation="multiply">×</button>
                        <button class="calc-btn function-btn" data-action="reciprocal">1/x</button>
                        
                        <button class="calc-btn number-btn" data-value="1">1</button>
                        <button class="calc-btn number-btn" data-value="2">2</button>
                        <button class="calc-btn number-btn" data-value="3">3</button>
                        <button class="calc-btn operation-btn" data-operation="subtract">−</button>
                        <button class="calc-btn equals-btn" data-action="equals" rowspan="2">=</button>
                        
                        <button class="calc-btn number-btn zero-btn" data-value="0">0</button>
                        <button class="calc-btn number-btn" data-value=".">.</button>
                        <button class="calc-btn operation-btn" data-operation="add">+</button>
                    </div>
                </div>
                <div class="calculator-status">
                    <div class="status-text">Ready</div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Button clicks
        const buttons = this.container.querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });

        // Menu items
        const menuItems = this.container.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleMenuClick(e.target.dataset.menu);
            });
        });
    }

    setupKeyboardControls() {
        // Focus the container to receive keyboard events
        this.container.tabIndex = 0;
        this.container.focus();

        this.container.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    handleButtonClick(button) {
        const value = button.dataset.value;
        const operation = button.dataset.operation;
        const action = button.dataset.action;

        if (value !== undefined) {
            this.inputNumber(value);
        } else if (operation) {
            this.inputOperation(operation);
        } else if (action) {
            this.performAction(action);
        }

        this.updateDisplay();
        this.updateStatus('Ready');
    }

    handleKeyPress(e) {
        e.preventDefault();
        
        const key = e.key;
        
        // Numbers and decimal point
        if (/[0-9.]/.test(key)) {
            this.inputNumber(key);
        }
        // Operations
        else if (key === '+') {
            this.inputOperation('add');
        } else if (key === '-') {
            this.inputOperation('subtract');
        } else if (key === '*') {
            this.inputOperation('multiply');
        } else if (key === '/') {
            this.inputOperation('divide');
        }
        // Actions
        else if (key === 'Enter' || key === '=') {
            this.performAction('equals');
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.performAction('clear');
        } else if (key === 'Backspace') {
            this.performAction('backspace');
        } else if (key === 'Delete') {
            this.performAction('clear-entry');
        }

        this.updateDisplay();
    }

    inputNumber(value) {
        if (value === '.' && this.display.includes('.')) {
            return; // Don't allow multiple decimal points
        }

        if (this.waitingForOperand) {
            this.display = value;
            this.waitingForOperand = false;
        } else {
            this.display = this.display === '0' ? value : this.display + value;
        }
    }

    inputOperation(nextOperation) {
        const inputValue = parseFloat(this.display);

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operation) {
            const currentValue = this.previousValue || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operation);

            this.display = String(newValue);
            this.previousValue = newValue;
        }

        this.waitingForOperand = true;
        this.operation = nextOperation;
    }

    performAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'clear-entry':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'equals':
                this.equals();
                break;
            case 'sign':
                this.toggleSign();
                break;
            case 'percent':
                this.percent();
                break;
            case 'sqrt':
                this.sqrt();
                break;
            case 'reciprocal':
                this.reciprocal();
                break;
            case 'memory-clear':
                this.memoryClear();
                break;
            case 'memory-recall':
                this.memoryRecall();
                break;
            case 'memory-store':
                this.memoryStore();
                break;
            case 'memory-add':
                this.memoryAdd();
                break;
            case 'memory-subtract':
                this.memorySubtract();
                break;
        }
    }

    calculate(firstValue, secondValue, operation) {
        switch (operation) {
            case 'add':
                return firstValue + secondValue;
            case 'subtract':
                return firstValue - secondValue;
            case 'multiply':
                return firstValue * secondValue;
            case 'divide':
                if (secondValue === 0) {
                    this.updateStatus('Cannot divide by zero');
                    return firstValue;
                }
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }

    clear() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
    }

    clearEntry() {
        this.display = '0';
    }

    backspace() {
        if (this.display.length > 1) {
            this.display = this.display.slice(0, -1);
        } else {
            this.display = '0';
        }
    }

    equals() {
        const inputValue = parseFloat(this.display);

        if (this.previousValue !== null && this.operation) {
            const newValue = this.calculate(this.previousValue, inputValue, this.operation);
            
            // Add to history
            this.addToHistory(`${this.previousValue} ${this.getOperationSymbol(this.operation)} ${inputValue} = ${newValue}`);
            
            this.display = String(newValue);
            this.previousValue = null;
            this.operation = null;
            this.waitingForOperand = true;
        }
    }

    toggleSign() {
        if (this.display !== '0') {
            this.display = this.display.startsWith('-') 
                ? this.display.slice(1) 
                : '-' + this.display;
        }
    }

    percent() {
        const value = parseFloat(this.display);
        this.display = String(value / 100);
    }

    sqrt() {
        const value = parseFloat(this.display);
        if (value < 0) {
            this.updateStatus('Invalid input');
            return;
        }
        this.display = String(Math.sqrt(value));
    }

    reciprocal() {
        const value = parseFloat(this.display);
        if (value === 0) {
            this.updateStatus('Cannot divide by zero');
            return;
        }
        this.display = String(1 / value);
    }

    memoryClear() {
        this.memory = 0;
        this.updateMemoryIndicator();
        this.updateStatus('Memory cleared');
    }

    memoryRecall() {
        this.display = String(this.memory);
        this.waitingForOperand = true;
        this.updateStatus('Memory recalled');
    }

    memoryStore() {
        this.memory = parseFloat(this.display);
        this.updateMemoryIndicator();
        this.updateStatus('Memory stored');
    }

    memoryAdd() {
        this.memory += parseFloat(this.display);
        this.updateMemoryIndicator();
        this.updateStatus('Added to memory');
    }

    memorySubtract() {
        this.memory -= parseFloat(this.display);
        this.updateMemoryIndicator();
        this.updateStatus('Subtracted from memory');
    }

    updateMemoryIndicator() {
        const indicator = this.container.querySelector('#memory-indicator');
        indicator.style.visibility = this.memory !== 0 ? 'visible' : 'hidden';
    }

    addToHistory(calculation) {
        this.history.push(calculation);
        if (this.history.length > 10) {
            this.history.shift(); // Keep only last 10 calculations
        }
    }

    getOperationSymbol(operation) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[operation] || operation;
    }

    updateDisplay() {
        const displayElement = this.container.querySelector('.display-text');
        let displayValue = this.display;

        // Format large numbers
        if (displayValue.length > 12) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1e12) {
                displayValue = num.toExponential(6);
            } else {
                displayValue = num.toPrecision(12);
            }
        }

        displayElement.textContent = displayValue;
    }

    updateStatus(message) {
        const statusElement = this.container.querySelector('.status-text');
        statusElement.textContent = message;
        
        // Clear status after 3 seconds
        setTimeout(() => {
            statusElement.textContent = 'Ready';
        }, 3000);
    }

    handleMenuClick(menu) {
        switch (menu) {
            case 'view':
                this.showViewMenu();
                break;
            case 'edit':
                this.showEditMenu();
                break;
            case 'help':
                this.showHelp();
                break;
        }
    }

    showViewMenu() {
        // Toggle between standard and scientific view
        alert('View menu - Standard/Scientific modes would be implemented here');
    }

    showEditMenu() {
        // Copy/Paste functionality
        const editMenu = `Edit Menu:
        
Copy: Ctrl+C
Paste: Ctrl+V
        
History:
${this.history.slice(-5).join('\n')}`;
        
        alert(editMenu);
    }

    showHelp() {
        const helpText = `Calculator Help:

Basic Operations:
• +, -, ×, ÷ for arithmetic
• = or Enter to calculate
• C or Esc to clear all
• CE or Delete to clear entry
• Backspace to delete last digit

Memory Functions:
• MC: Memory Clear
• MR: Memory Recall
• MS: Memory Store
• M+: Add to memory
• M-: Subtract from memory

Special Functions:
• ±: Change sign
• %: Percentage
• √: Square root
• 1/x: Reciprocal

Keyboard Shortcuts:
• Numbers: 0-9
• Operations: +, -, *, /
• Decimal: .
• Equals: Enter or =
• Clear: Esc or C
• Backspace: Backspace
• Clear Entry: Delete`;

        alert(helpText);
    }

    // Application lifecycle methods
    hasUnsavedChanges() {
        return false; // Calculator doesn't have unsaved changes
    }

    pause() {
        // Calculator doesn't need to pause
    }

    resume() {
        // Calculator doesn't need to resume
    }
}

// Initialize when window is loaded
if (typeof window !== 'undefined') {
    window.CalculatorApp = CalculatorApp;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorApp;
}
