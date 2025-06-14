/**
 * Neon Database Utility
 * Provides serverless database connections and utilities for NosytLabs
 */

import { neon } from '@neondatabase/serverless';

// Get the database URL from environment variables
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    console.warn('DATABASE_URL or POSTGRES_URL environment variable not found - database features will be disabled');
    return null;
  }
  return url;
};

// Create the SQL function for database queries (with fallback)
const databaseUrl = getDatabaseUrl();
export const sql = databaseUrl ? neon(databaseUrl) : null;

// Database connection test
export async function testConnection() {
  try {
    if (!sql) {
      console.warn('⚠️ Database not configured - skipping connection test');
      return { success: false, error: 'Database not configured' };
    }
    const result = await sql`SELECT version()`;
    console.log('✅ Database connected successfully');
    return { success: true, version: result[0]?.version };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Common database operations
export class DatabaseOperations {
  
  // Create tables for NosytLabs features
  static async createTables() {
    try {
      if (!sql) {
        console.warn('⚠️ Database not configured - skipping table creation');
        return { success: false, error: 'Database not configured' };
      }
      // Contact form submissions table
      await sql`
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          service_type VARCHAR(100),
          budget_range VARCHAR(50),
          timeline VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'new'
        )
      `;

      // Blog analytics table
      await sql`
        CREATE TABLE IF NOT EXISTS blog_analytics (
          id SERIAL PRIMARY KEY,
          post_slug VARCHAR(255) NOT NULL,
          views INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          shares INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Project inquiries table
      await sql`
        CREATE TABLE IF NOT EXISTS project_inquiries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          project_type VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          budget_range VARCHAR(50),
          timeline VARCHAR(50),
          priority VARCHAR(20) DEFAULT 'medium',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'pending'
        )
      `;

      // Newsletter subscriptions table
      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(20) DEFAULT 'active',
          preferences JSONB DEFAULT '{}'
        )
      `;

      console.log('✅ All tables created successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error creating tables:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Contact form operations
  static async saveContactSubmission(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    serviceType?: string;
    budgetRange?: string;
    timeline?: string;
  }) {
    try {
      if (!sql) {
        console.warn('⚠️ Database not configured - contact submission not saved');
        return { success: false, error: 'Database not configured' };
      }
      const result = await sql`
        INSERT INTO contact_submissions (name, email, subject, message, service_type, budget_range, timeline)
        VALUES (${data.name}, ${data.email}, ${data.subject || ''}, ${data.message}, 
                ${data.serviceType || ''}, ${data.budgetRange || ''}, ${data.timeline || ''})
        RETURNING id, created_at
      `;
      
      console.log('✅ Contact submission saved:', result[0]);
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('❌ Error saving contact submission:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Blog analytics operations
  static async incrementBlogViews(postSlug: string) {
    try {
      if (!sql) {
        return { success: false, error: 'Database not configured' };
      }
      await sql`
        INSERT INTO blog_analytics (post_slug, views)
        VALUES (${postSlug}, 1)
        ON CONFLICT (post_slug) 
        DO UPDATE SET views = blog_analytics.views + 1, updated_at = CURRENT_TIMESTAMP
      `;
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error incrementing blog views:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Newsletter operations
  static async subscribeToNewsletter(email: string, name?: string) {
    try {
      if (!sql) {
        return { success: false, error: 'Database not configured' };
      }
      const result = await sql`
        INSERT INTO newsletter_subscriptions (email, name)
        VALUES (${email}, ${name || ''})
        ON CONFLICT (email) 
        DO UPDATE SET status = 'active', subscribed_at = CURRENT_TIMESTAMP
        RETURNING id, subscribed_at
      `;
      
      console.log('✅ Newsletter subscription saved:', result[0]);
      return { success: true, data: result[0] };
    } catch (error) {
      console.error('❌ Error saving newsletter subscription:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get analytics data
  static async getAnalytics() {
    try {
      if (!sql) {
        return { success: false, error: 'Database not configured' };
      }
      const [contactCount, blogViews, newsletterCount] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM contact_submissions`,
        sql`SELECT SUM(views) as total_views FROM blog_analytics`,
        sql`SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE status = 'active'`
      ]);

      return {
        success: true,
        data: {
          totalContacts: parseInt(contactCount[0]?.count || '0'),
          totalBlogViews: parseInt(blogViews[0]?.total_views || '0'),
          totalSubscribers: parseInt(newsletterCount[0]?.count || '0')
        }
      };
    } catch (error) {
      console.error('❌ Error getting analytics:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export default connection for direct SQL queries
export default sql;
