/**
 * Simple JSON-based database utility for contact management
 * In production, this would be replaced with a proper database like PostgreSQL, MongoDB, etc.
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file paths
const DB_DIR = path.join(__dirname, '../data');
const CONTACTS_DB = path.join(DB_DIR, 'contacts.json');
const NEWSLETTER_DB = path.join(DB_DIR, 'newsletter.json');
const PROJECTS_DB = path.join(DB_DIR, 'projects.json');

// Data interfaces
export interface ContactForm {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  timestamp: string;
  status: 'active' | 'unsubscribed';
}

export interface ProjectInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  description: string;
  timestamp: string;
  status: 'new' | 'reviewing' | 'quoted' | 'accepted' | 'declined';
}

// Ensure database directory exists
async function ensureDbDir(): Promise<void> {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
}

// Generic database operations
async function readDb<T>(filePath: string): Promise<T[]> {
  try {
    await ensureDbDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeDb<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDbDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Contact form operations
export async function saveContactForm(contact: Omit<ContactForm, 'id' | 'timestamp' | 'status'>): Promise<ContactForm> {
  const contacts = await readDb<ContactForm>(CONTACTS_DB);
  
  const newContact: ContactForm = {
    ...contact,
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'new'
  };
  
  contacts.push(newContact);
  await writeDb(CONTACTS_DB, contacts);
  
  return newContact;
}

export async function getContactForms(): Promise<ContactForm[]> {
  return readDb<ContactForm>(CONTACTS_DB);
}

export async function updateContactStatus(id: string, status: ContactForm['status']): Promise<boolean> {
  const contacts = await readDb<ContactForm>(CONTACTS_DB);
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1 || !contacts[contactIndex]) return false;
  
  contacts[contactIndex].status = status;
  await writeDb(CONTACTS_DB, contacts);
  
  return true;
}

// Newsletter operations
export async function saveNewsletterSubscriber(subscriber: Omit<NewsletterSubscriber, 'id' | 'timestamp' | 'status'>): Promise<NewsletterSubscriber> {
  const subscribers = await readDb<NewsletterSubscriber>(NEWSLETTER_DB);
  
  // Check if email already exists
  const existingSubscriber = subscribers.find(s => s.email === subscriber.email && s.status === 'active');
  if (existingSubscriber) {
    throw new Error('Email already subscribed');
  }
  
  const newSubscriber: NewsletterSubscriber = {
    ...subscriber,
    id: `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  
  subscribers.push(newSubscriber);
  await writeDb(NEWSLETTER_DB, subscribers);
  
  return newSubscriber;
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  return readDb<NewsletterSubscriber>(NEWSLETTER_DB);
}

export async function unsubscribeNewsletter(email: string): Promise<boolean> {
  const subscribers = await readDb<NewsletterSubscriber>(NEWSLETTER_DB);
  const subscriberIndex = subscribers.findIndex(s => s.email === email && s.status === 'active');
  
  if (subscriberIndex === -1 || !subscribers[subscriberIndex]) return false;
  
  subscribers[subscriberIndex].status = 'unsubscribed';
  await writeDb(NEWSLETTER_DB, subscribers);
  
  return true;
}

// Project inquiry operations
export async function saveProjectInquiry(project: Omit<ProjectInquiry, 'id' | 'timestamp' | 'status'>): Promise<ProjectInquiry> {
  const projects = await readDb<ProjectInquiry>(PROJECTS_DB);
  
  const newProject: ProjectInquiry = {
    ...project,
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'new'
  };
  
  projects.push(newProject);
  await writeDb(PROJECTS_DB, projects);
  
  return newProject;
}

export async function getProjectInquiries(): Promise<ProjectInquiry[]> {
  return readDb<ProjectInquiry>(PROJECTS_DB);
}

export async function updateProjectStatus(id: string, status: ProjectInquiry['status']): Promise<boolean> {
  const projects = await readDb<ProjectInquiry>(PROJECTS_DB);
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1 || !projects[projectIndex]) return false;
  
  projects[projectIndex].status = status;
  await writeDb(PROJECTS_DB, projects);
  
  return true;
}

// Statistics
export async function getContactStats() {
  const [contacts, subscribers, projects] = await Promise.all([
    getContactForms(),
    getNewsletterSubscribers(),
    getProjectInquiries()
  ]);
  
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  return {
    totalContacts: contacts.length,
    newsletterSubscribers: subscribers.filter(s => s.status === 'active').length,
    projectInquiries: projects.length,
    lastWeekContacts: contacts.filter(c => new Date(c.timestamp) > lastWeek).length,
    lastWeekSubscribers: subscribers.filter(s => new Date(s.timestamp) > lastWeek && s.status === 'active').length,
    lastWeekProjects: projects.filter(p => new Date(p.timestamp) > lastWeek).length
  };
}