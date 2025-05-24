/**
 * NosytOS95 File System Handler
 * Manages file operations and system events for the Windows 95 style file system
 */

class NosytFileSystem {
  constructor() {
    this.fileSystem = {
      'C:\\': {
        type: 'directory',
        contents: {
          'WINDOWS': {
            type: 'directory',
            contents: {
              'SYSTEM': {
                type: 'directory',
                contents: {
                  'SYSTEM.INI': { type: 'file', content: '; Windows 95 System Configuration\n[boot]\nshell=explorer.exe\n' },
                  'WIN.INI': { type: 'file', content: '; Windows 95 Configuration\n[windows]\nload=\nrun=\n' }
                }
              }
            }
          },
          'My Documents': {
            type: 'directory',
            contents: {
              'README.TXT': { type: 'file', content: 'Welcome to NosytOS95!\n\nThis is your personal documents folder.' }
            }
          },
          'Program Files': {
            type: 'directory',
            contents: {}
          }
        }
      }
    };

    // File type to icon mapping
    this.iconMapping = {
      'directory': '/images/win95/folder.png',
      '.txt': '/images/win95/text-file.png',
      '.exe': '/images/win95/application.png',
      '.ini': '/images/win95/settings.png',
      '.bat': '/images/win95/batch.png',
      '.com': '/images/win95/msdos.png',
      'default': '/images/win95/unknown.png'
    };

    // Event handlers
    this.eventHandlers = {
      'fileCreated': [],
      'fileDeleted': [],
      'fileModified': [],
      'directoryCreated': [],
      'directoryDeleted': [],
      'fileSystemChanged': []
    };
  }

  /**
   * Get the contents of a directory
   */
  getDirectoryContents(path) {
    const directory = this.getPathObject(path);
    if (!directory || directory.type !== 'directory') {
      throw new Error(`Invalid directory: ${path}`);
    }
    return directory.contents;
  }

  /**
   * Get a file or directory by path
   */
  getPathObject(path) {
    if (!path) return null;

    // Normalize path
    path = path.replace(/\//g, '\\');
    if (!path.startsWith('C:\\')) {
      path = 'C:\\' + path;
    }

    const parts = path.split('\\').filter(p => p);
    let current = this.fileSystem[parts[0] + '\\'];

    for (let i = 1; i < parts.length; i++) {
      if (!current || current.type !== 'directory') return null;
      current = current.contents[parts[i]];
    }

    return current;
  }

  /**
   * Create a new file
   */
  createFile(path, content = '') {
    const { dir, name } = this.parsePath(path);
    const directory = this.getPathObject(dir);

    if (!directory || directory.type !== 'directory') {
      throw new Error(`Invalid directory: ${dir}`);
    }

    if (directory.contents[name]) {
      throw new Error(`File already exists: ${path}`);
    }

    directory.contents[name] = {
      type: 'file',
      content: content
    };

    this.triggerEvent('fileCreated', { path, content });
    this.triggerEvent('fileSystemChanged');
  }

  /**
   * Create a new directory
   */
  createDirectory(path) {
    const { dir, name } = this.parsePath(path);
    const parent = this.getPathObject(dir);

    if (!parent || parent.type !== 'directory') {
      throw new Error(`Invalid directory: ${dir}`);
    }

    if (parent.contents[name]) {
      throw new Error(`Directory already exists: ${path}`);
    }

    parent.contents[name] = {
      type: 'directory',
      contents: {}
    };

    this.triggerEvent('directoryCreated', { path });
    this.triggerEvent('fileSystemChanged');
  }

  /**
   * Delete a file or directory
   */
  delete(path) {
    const { dir, name } = this.parsePath(path);
    const parent = this.getPathObject(dir);
    const target = this.getPathObject(path);

    if (!parent || !target) {
      throw new Error(`Invalid path: ${path}`);
    }

    delete parent.contents[name];

    if (target.type === 'file') {
      this.triggerEvent('fileDeleted', { path });
    } else {
      this.triggerEvent('directoryDeleted', { path });
    }
    this.triggerEvent('fileSystemChanged');
  }

  /**
   * Move a file or directory
   */
  move(sourcePath, targetPath) {
    const content = this.getPathObject(sourcePath);
    if (!content) {
      throw new Error(`Source not found: ${sourcePath}`);
    }

    this.copy(sourcePath, targetPath);
    this.delete(sourcePath);
  }

  /**
   * Copy a file or directory
   */
  copy(sourcePath, targetPath) {
    const content = this.getPathObject(sourcePath);
    if (!content) {
      throw new Error(`Source not found: ${sourcePath}`);
    }

    const { dir, name } = this.parsePath(targetPath);
    const targetDir = this.getPathObject(dir);

    if (!targetDir || targetDir.type !== 'directory') {
      throw new Error(`Invalid target directory: ${dir}`);
    }

    targetDir.contents[name] = JSON.parse(JSON.stringify(content));
    this.triggerEvent('fileSystemChanged');
  }

  /**
   * Get file icon based on extension
   */
  getFileIcon(filename) {
    if (!filename) return this.iconMapping.default;
    
    const ext = filename.includes('.') ? 
      '.' + filename.split('.').pop().toLowerCase() : 
      null;

    if (!ext) return this.iconMapping.default;
    return this.iconMapping[ext] || this.iconMapping.default;
  }

  /**
   * Parse a path into directory and filename
   */
  parsePath(path) {
    path = path.replace(/\//g, '\\');
    const parts = path.split('\\');
    const name = parts.pop();
    const dir = parts.join('\\');
    return { dir, name };
  }

  /**
   * Add event listener
   */
  addEventListener(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].push(handler);
    }
  }

  /**
   * Remove event listener
   */
  removeEventListener(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event]
        .filter(h => h !== handler);
    }
  }

  /**
   * Trigger an event
   */
  triggerEvent(event, data = {}) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }
}

// Create global instance
window.NosytFS = new NosytFileSystem();