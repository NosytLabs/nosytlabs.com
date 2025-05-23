# Doom II WebAssembly Integration

This directory contains the WebAssembly build of Doom II and its required assets for NosytOS95.

## Required Files

- `doom2.wasm` - The WebAssembly module containing the Doom II engine
- `doom2.data` - Game data file containing textures, sprites, and levels
- `doom2.js` - JavaScript glue code for WebAssembly initialization

## Build Instructions

1. Install Emscripten SDK
2. Clone Chocolate Doom source code
3. Apply the NosytOS95 patches from `patches/`
4. Run build script:

```bash
# In chocolate-doom directory
emcmake cmake .
emmake make
```

5. Copy built files to this directory:
```bash
cp build/src/doom2.* /path/to/nosytos95/public/doom/
```

## Integration Steps

1. Ensure WebAssembly support is enabled in the browser
2. Load module via DoomGame class in `nosyt-doom.js`
3. Initialize with proper memory allocation (minimum 256MB)
4. Set up input handlers for keyboard/mouse
5. Configure audio context for sound effects

## Asset Structure

```
public/doom/
├── doom2.wasm      # WebAssembly module
├── doom2.data      # Game assets
├── doom2.js        # JavaScript glue code
├── config/         # Configuration files
└── saves/          # Save game directory
```

## Memory Management

The WebAssembly module requires:
- Initial memory: 256MB
- Maximum memory: 512MB
- Shared memory buffers for audio processing

## Performance Considerations

1. Enable WebGL for hardware acceleration
2. Use requestAnimationFrame for smooth rendering
3. Implement proper resource cleanup on window close
4. Handle audio context suspension on window blur

## Known Issues

1. Audio may not work on first click (requires user interaction)
2. Fullscreen mode requires proper event handling
3. Save games need IndexedDB for persistent storage

## Security Notes

1. WebAssembly module is sandboxed by default
2. File system access is restricted to emulated FS
3. Audio requires user interaction due to browser policies
4. Network features are disabled for security

## TODO

1. Implement save/load functionality
2. Add configuration UI for controls and video settings
3. Optimize texture loading for faster startup
4. Add multiplayer support via WebRTC