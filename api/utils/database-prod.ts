import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export interface ContactForm {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
  createdAt: string;
  respondedAt?: string;
  status: 'new' | 'read' | 'responded';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  status: 'active' | 'unsubscribed';
}

export interface ProjectInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  description?: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'quoted' | 'accepted' | 'rejected';
}

// Contact Forms
export async function saveContactForm(data: Omit<ContactForm, 'id' | 'createdAt' | 'status'>) {
  const query = `
    INSERT INTO contact_forms (name, email, subject, message, service)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  
  const values = [data.name, data.email, data.subject, data.message, data.service];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getContactForms() {
  const query = 'SELECT * FROM contact_forms ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
}

// Newsletter Subscribers
export async function saveNewsletterSubscriber(data: Omit<NewsletterSubscriber, 'id' | 'subscribedAt' | 'status'>) {
  const query = `
    INSERT INTO newsletter_subscribers (email)
    VALUES ($1)
    ON CONFLICT (email) DO UPDATE SET
      status = 'active',
      unsubscribed_at = NULL
    RETURNING *
  `;
  
  const values = [data.email];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getNewsletterSubscribers() {
  const query = "SELECT * FROM newsletter_subscribers WHERE status = 'active' ORDER BY subscribed_at DESC";
  const result = await pool.query(query);
  return result.rows;
}

// Project Inquiries
export async function saveProjectInquiry(data: Omit<ProjectInquiry, 'id' | 'createdAt' | 'status'>) {
  const query = `
    INSERT INTO project_inquiries (name, email, company, project_type, budget, timeline, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  
  const values = [
    data.name,
    data.email,
    data.company,
    data.projectType,
    data.budget,
    data.timeline,
    data.description
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getProjectInquiries() {
  const query = 'SELECT * FROM project_inquiries ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
}

// Statistics
export async function getContactStats() {
  const queries = [
    "SELECT COUNT(*) as count FROM contact_forms",
    "SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'active'",
    "SELECT COUNT(*) as count FROM project_inquiries",
    "SELECT COUNT(*) as count FROM contact_forms WHERE created_at >= NOW() - INTERVAL '30 days'",
    "SELECT COUNT(*) as count FROM newsletter_subscribers WHERE subscribed_at >= NOW() - INTERVAL '30 days'",
    "SELECT COUNT(*) as count FROM project_inquiries WHERE created_at >= NOW() - INTERVAL '30 days'"
  ];

  const results = await Promise.all(queries.map(query => pool.query(query)));
  
  return {
    totalContacts: parseInt(results[0]?.rows?.[0]?.count || '0'),
    totalNewsletter: parseInt(results[1]?.rows?.[0]?.count || '0'),
    totalProjects: parseInt(results[2]?.rows?.[0]?.count || '0'),
    recentContacts: parseInt(results[3]?.rows?.[0]?.count || '0'),
    recentNewsletter: parseInt(results[4]?.rows?.[0]?.count || '0'),
    recentProjects: parseInt(results[5]?.rows?.[0]?.count || '0'),
    lastUpdated: new Date().toISOString()
  };
}

// Database initialization
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_forms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        message TEXT NOT NULL,
        service VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'new'
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'active'
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        project_type VARCHAR(100),
        budget VARCHAR(100),
        timeline VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'new'
      )
    `);
    
    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_contact_forms_email ON contact_forms(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_contact_forms_created_at ON contact_forms(created_at)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_project_inquiries_email ON project_inquiries(email)');
    
    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Health check
export async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    return { connected: true, timestamp: result.rows[0].now };
  } catch (error: unknown) {
    console.error('Database connection error:', error);
    return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export { pool };
export default pool;