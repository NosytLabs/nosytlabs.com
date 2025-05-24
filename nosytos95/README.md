# NosytOS95 - Enhanced Windows 95 Experience

A comprehensive Windows 95-style interface for NosytLabs with enhanced games and applications.

## Folder Structure

```
nosytos95/
├── applications/         # Individual application logic
│   ├── minesweeper/     # Minesweeper game
│   ├── tetris/          # Tetris game
│   ├── snake/           # Snake game
│   ├── calculator/      # Calculator app
│   ├── solitaire/       # Solitaire card game
│   ├── duck-hunt/       # Enhanced Duck Hunt
│   ├── notepad/         # Enhanced Notepad
│   ├── terminal/        # Enhanced Terminal
│   ├── paint/           # Enhanced Paint
│   ├── file-explorer/   # File Explorer
│   ├── chat/            # Chat application
│   ├── virtual-pc/      # Virtual PC with games
│   ├── soundboard/      # Soundboard app
│   ├── photo-booth/     # Photo Booth app
│   └── ipod/            # iPod music player
├── core/                # Core OS functionality
│   ├── window-manager.js
│   ├── taskbar.js
│   ├── start-menu.js
│   ├── desktop.js
│   └── clippy.js
├── styles/              # Organized CSS
│   ├── core.css         # Core Windows 95 styles
│   ├── applications.css # Application-specific styles
│   └── themes.css       # Color themes and variations
├── assets/              # Images, sounds, fonts
│   ├── icons/           # Application and system icons
│   ├── sounds/          # Sound effects and music
│   ├── fonts/           # Windows 95 fonts
│   └── images/          # Background images and graphics
└── components/          # Reusable UI components
    ├── window.js        # Window component
    ├── button.js        # Button component
    └── dialog.js        # Dialog component
```

## Features

### Games
- **Minesweeper** - Classic mine-sweeping game with multiple difficulty levels
- **Tetris** - Block-stacking puzzle game with line clearing
- **Snake** - Classic snake game with food collection
- **Solitaire** - Klondike solitaire card game
- **Duck Hunt** - Enhanced shooting game with sound effects

### Applications
- **Calculator** - Windows 95 style calculator
- **Notepad** - Text editor with file operations
- **Paint** - Drawing application with tools
- **Terminal** - Command-line interface with Easter eggs
- **File Explorer** - File system browser
- **Chat** - Communication interface
- **Virtual PC** - Retro game emulator
- **Soundboard** - Sound effect player
- **Photo Booth** - Camera application
- **iPod** - Music player interface

### System Features
- **Window Management** - Draggable, resizable windows
- **Taskbar** - Application launcher and switcher
- **Start Menu** - Hierarchical application menu
- **Desktop Icons** - Double-click to launch apps
- **Clippy Assistant** - Helpful AI assistant
- **Authentic Windows 95 Styling** - Pixel-perfect recreation

## Installation

1. Copy the `nosytos95` folder to your project
2. Include the main CSS and JS files in your HTML
3. Initialize the OS with `initNosytOS95()`

## Usage

```javascript
// Initialize NosytOS95
document.addEventListener('DOMContentLoaded', function() {
    initNosytOS95();
});
```

## Customization

The system uses CSS custom properties for easy theming:

```css
:root {
    --win95-desktop: #2D0A4F;     /* NosytLabs purple */
    --win95-window-bg: #c0c0c0;
    --win95-window-header: #4C1D95;
    --win95-accent: #FF6B00;      /* NosytLabs orange */
}
```

## Contributing

1. Add new applications to the `applications/` folder
2. Follow the existing code structure and styling
3. Update the main OS file to register new applications
4. Test thoroughly in the Windows 95 environment

## License

MIT License - Feel free to use and modify for your projects.
