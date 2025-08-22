/**
 * Environment-Aware Logging System
 *
 * This utility provides a centralized logging system that:
 * - Only outputs logs in development environments
 * - Prevents console clutter in production
 * - Maintains consistent log formatting
 * - Supports different log levels (info, warn, error, debug)
 */

// Environment detection
const isDevelopment = (): boolean => {
  // Check for Node.js environment first
  if (typeof process !== 'undefined' && process.env) {
    const nodeEnv = process.env.NODE_ENV;
    return nodeEnv === 'development' || nodeEnv === 'test';
  }

  // Check for browser environment
  if (typeof window !== 'undefined' && window.location) {
    // Check for development hostname patterns
    const hostname = window.location.hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.includes('.local') ||
      hostname.includes('dev.') ||
      hostname.includes('staging.')
    );
  }

  // Default to false for safety (production)
  return false;
};

// Log level type
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// Log group type for grouping related logs
type LogGroup = string | null;

// Logger interface
interface Logger {
  info(message: string | object, metaOrGroup?: object | LogGroup, group?: LogGroup): void;
  warn(message: string | object, metaOrGroup?: object | LogGroup, group?: LogGroup): void;
  error(message: string | object, errOrMeta?: Error | object | LogGroup, group?: LogGroup): void;
  debug(message: string | object, metaOrGroup?: object | LogGroup, group?: LogGroup): void;
  group(groupName: string): void;
  groupEnd(): void;
  table(data: unknown[], columns?: string[]): void;
}

/**
 * Main logger implementation
 */
class LoggerImplementation implements Logger {
  private formatMessage(
    message: string | object,
    level: LogLevel,
    group: LogGroup = null
  ): string | object {
    if (typeof message === 'string') {
      const prefix = group ? `[${group}]` : '';
      return `[${level.toUpperCase()}]${prefix} ${message}`;
    }

    // For objects, we'll keep them as is for better console display
    return message;
  }

  public log(level: LogLevel, message: string | object, group?: LogGroup): void;
  public log(message: string | object, group?: LogGroup): void;
  public log(
    levelOrMessage: LogLevel | string | object,
    messageOrGroup?: string | object | LogGroup,
    group?: LogGroup
  ): void {
    // Handle overloaded signatures
    let level: LogLevel;
    let message: string | object;
    let logGroup: LogGroup = null;

    if (
      typeof levelOrMessage === 'string' &&
      ['info', 'warn', 'error', 'debug'].includes(levelOrMessage)
    ) {
      // First signature: log(level, message, group)
      level = levelOrMessage as LogLevel;
      message = messageOrGroup as string | object;
      logGroup = group || null;
    } else {
      // Second signature: log(message, group) - defaults to 'info'
      level = 'info';
      message = levelOrMessage;
      logGroup = (messageOrGroup as LogGroup) || null;
    }

    if (!isDevelopment() && level !== 'error') return;

    const formattedMessage = this.formatMessage(message, level, logGroup);

    switch (level) {
      case 'info':
        console.log(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
    }
  }

  public info(message: string | object, metaOrGroup?: object | LogGroup, group?: LogGroup): void {
    if (metaOrGroup && typeof metaOrGroup !== 'string') {
      const payload =
        typeof message === 'string' ? { message, ...(metaOrGroup as object) } : { ...(message as object), ...(metaOrGroup as object) };
      this.log('info', payload, group);
      return;
    }
    this.log('info', message, (metaOrGroup as LogGroup) || group);
  }

  public warn(message: string | object, metaOrGroup?: object | LogGroup, group?: LogGroup): void {
    if (metaOrGroup && typeof metaOrGroup !== 'string') {
      const payload =
        typeof message === 'string' ? { message, ...(metaOrGroup as object) } : { ...(message as object), ...(metaOrGroup as object) };
      this.log('warn', payload, group);
      return;
    }
    this.log('warn', message, (metaOrGroup as LogGroup) || group);
  }

  public error(message: string | object, errOrMeta?: Error | object | LogGroup, group?: LogGroup): void {
    // Determine if second arg is meta object, error instance, or group string
    const isGroupString = typeof errOrMeta === 'string';
    const isMetaObject = !!errOrMeta && typeof errOrMeta === 'object' && !(errOrMeta instanceof Error);
    const finalGroup: LogGroup = (isGroupString ? (errOrMeta as LogGroup) : group) || null;

    if (isMetaObject) {
      const payload = typeof message === 'string' ? { message, ...(errOrMeta as object) } : { ...(message as object), ...(errOrMeta as object) };
      // Always log errors, even in production
      const formattedMessage = this.formatMessage(payload, 'error', finalGroup);
      console.error(formattedMessage);
      return;
    }

    // Original behavior
    const formattedMessage = this.formatMessage(message, 'error', finalGroup);
    console.error(formattedMessage);

    if (errOrMeta instanceof Error && isDevelopment()) {
      console.error(errOrMeta);
    }
  }

  public debug(message: string | object, metaOrGroup?: object | LogGroup, group?: LogGroup): void {
    if (metaOrGroup && typeof metaOrGroup !== 'string') {
      const payload =
        typeof message === 'string' ? { message, ...(metaOrGroup as object) } : { ...(message as object), ...(metaOrGroup as object) };
      this.log('debug', payload, group);
      return;
    }
    this.log('debug', message, (metaOrGroup as LogGroup) || group);
  }

  public group(groupName: string): void {
    if (!isDevelopment()) return;
    console.group(groupName);
  }

  public groupEnd(): void {
    if (!isDevelopment()) return;
    console.groupEnd();
  }

  public table(data: unknown[], columns?: string[]): void {
    if (!isDevelopment()) return;
    console.table(data, columns);
  }
}

// Create and export singleton instance
const loggerInstance = new LoggerImplementation();

export const logger = loggerInstance;
export default loggerInstance;
