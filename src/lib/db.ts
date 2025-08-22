/**
 * Secure Database Connection Utility
 *
 * This utility provides a secure connection to the database with connection pooling,
 * prepared statements, and error handling.
 */

import { Pool } from '@neondatabase/serverless';
import { getApiKey, logApiKeyUsage } from '../utils/api-key-manager';
import { logger } from '../utils/logger';

// Connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
  ssl: true, // Enable SSL for secure connections
};

// Create a connection pool with atomic initialization
let pool: Pool | null = null;
let poolInitialization: Promise<Pool> | null = null;

/**
 * Get a database connection pool with atomic initialization
 */
export function getPool(): Pool {
  if (pool) {
    return pool;
  }

  // If pool is being initialized, wait for it
  if (poolInitialization) {
    throw new Error('Pool is being initialized. Use getPoolAsync() for concurrent access.');
  }

  // Get database URL from environment variables
  const databaseUrl = process.env.DATABASE_URL || getApiKey('Database URL');

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Create a new pool atomically
  pool = new Pool({
    ...poolConfig,
    connectionString: databaseUrl,
  });

  // Log API key usage
  logApiKeyUsage('Database URL', 'Database Connection');

  return pool;
}

/**
 * Get a database connection pool asynchronously (for concurrent access)
 */
export async function getPoolAsync(): Promise<Pool> {
  if (pool) {
    return pool;
  }

  // If already initializing, wait for completion
  if (poolInitialization) {
    return poolInitialization;
  }

  // Start initialization
  poolInitialization = initializePool();

  try {
    const newPool = await poolInitialization;
    // eslint-disable-next-line require-atomic-updates
    pool = newPool;
    return newPool;
  } finally {
    // eslint-disable-next-line require-atomic-updates
    poolInitialization = null;
  }
}

/**
 * Initialize the connection pool
 */
async function initializePool(): Promise<Pool> {
  // Get database URL from environment variables
  const databaseUrl = process.env.DATABASE_URL || getApiKey('Database URL');

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Create a new pool
  const newPool = new Pool({
    ...poolConfig,
    connectionString: databaseUrl,
  });

  // Log API key usage
  logApiKeyUsage('Database URL', 'Database Connection');

  return newPool;
}

/**
 * Execute a database query with parameters
 */
export async function query<T>(text: string, params: any[] = []): Promise<T[]> {
  const pool = getPool();

  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries in development
    if (import.meta.env.DEV && duration > 100) {
      logger.warn(`Slow query detected: ${duration}ms`, 'database');
    }

    return result.rows as T[];
  } catch (error) {
    logger.error('Database query error:', error as Error, 'database');
    throw error;
  }
}

/**
 * Execute a single-row query
 */
export async function queryOne<T>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] || null : null;
}

/**
 * Execute a transaction
 */
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
  const currentPool = pool;
  if (currentPool) {
    pool = null;
    await currentPool.end();
  }
}
