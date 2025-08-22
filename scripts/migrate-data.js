#!/usr/bin/env node
/**
 * Data Migration Script for NosytLabs Production Setup
 * Migrates existing JSON data to Supabase database
 * 
 * Usage: node scripts/migrate-data.js [--dry-run] [--force]
 * 
 * Options:
 *   --dry-run    Show what would be migrated without actually doing it
 *   --force      Force migration even if data already exists
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../src/lib/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DATA_DIR = path.join(__dirname, '../api/data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

// Logging utilities
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  debug: (msg) => console.log(`🔍 ${msg}`)
};

// Check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Read JSON file safely
async function readJsonFile(filePath) {
  try {
    if (!(await fileExists(filePath))) {
      log.warning(`File not found: ${filePath}`);
      return [];
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    log.error(`Failed to read ${filePath}: ${error.message}`);
    return [];
  }
}

// Test database connection
async function testConnection() {
  try {
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    log.success('Database connection successful');
    return true;
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`);
    return false;
  }
}

// Check if tables already have data
async function checkExistingData() {
  const checks = {
    contacts: 0,
    newsletter: 0,
    projects: 0
  };

  try {
    // Check contact submissions
    const { count: contactCount } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    checks.contacts = contactCount || 0;

    // Check newsletter subscribers
    const { count: newsletterCount } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });
    checks.newsletter = newsletterCount || 0;

    // Check project inquiries
    const { count: projectCount } = await supabaseAdmin
      .from('project_inquiries')
      .select('*', { count: 'exact', head: true });
    checks.projects = projectCount || 0;

    return checks;
  } catch (error) {
    log.error(`Failed to check existing data: ${error.message}`);
    return checks;
  }
}

// Migrate contact submissions
async function migrateContacts(contacts) {
  if (!contacts.length) {
    log.info('No contact submissions to migrate');
    return { success: 0, failed: 0 };
  }

  log.info(`Migrating ${contacts.length} contact submissions...`);
  let success = 0;
  let failed = 0;

  for (const contact of contacts) {
    try {
      if (isDryRun) {
        log.debug(`Would migrate contact: ${contact.name} (${contact.email})`);
        success++;
        continue;
      }

      const { error } = await supabaseAdmin
        .from('contact_submissions')
        .insert({
          name: contact.name,
          email: contact.email,
          subject: contact.subject || 'General Inquiry',
          message: contact.message,
          service: contact.service || null,
          phone: contact.phone || null,
          company: contact.company || null,
          status: contact.status || 'new',
          created_at: contact.timestamp || new Date().toISOString()
        });

      if (error) {
        log.error(`Failed to migrate contact ${contact.email}: ${error.message}`);
        failed++;
      } else {
        success++;
      }
    } catch (error) {
      log.error(`Error migrating contact ${contact.email}: ${error.message}`);
      failed++;
    }
  }

  return { success, failed };
}

// Migrate newsletter subscribers
async function migrateNewsletter(subscribers) {
  if (!subscribers.length) {
    log.info('No newsletter subscribers to migrate');
    return { success: 0, failed: 0 };
  }

  log.info(`Migrating ${subscribers.length} newsletter subscribers...`);
  let success = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      if (isDryRun) {
        log.debug(`Would migrate subscriber: ${subscriber.email}`);
        success++;
        continue;
      }

      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert({
          email: subscriber.email,
          source: 'migration',
          status: subscriber.status || 'active',
          subscribed_at: subscriber.timestamp || new Date().toISOString()
        });

      if (error) {
        // Handle duplicate emails gracefully
        if (error.code === '23505') {
          log.warning(`Subscriber ${subscriber.email} already exists, skipping`);
        } else {
          log.error(`Failed to migrate subscriber ${subscriber.email}: ${error.message}`);
          failed++;
        }
      } else {
        success++;
      }
    } catch (error) {
      log.error(`Error migrating subscriber ${subscriber.email}: ${error.message}`);
      failed++;
    }
  }

  return { success, failed };
}

// Migrate project inquiries
async function migrateProjects(projects) {
  if (!projects.length) {
    log.info('No project inquiries to migrate');
    return { success: 0, failed: 0 };
  }

  log.info(`Migrating ${projects.length} project inquiries...`);
  let success = 0;
  let failed = 0;

  for (const project of projects) {
    try {
      if (isDryRun) {
        log.debug(`Would migrate project inquiry: ${project.name} (${project.email})`);
        success++;
        continue;
      }

      const { error } = await supabaseAdmin
        .from('project_inquiries')
        .insert({
          name: project.name,
          email: project.email,
          company: project.company || null,
          project_type: project.projectType || project.project_type || 'other',
          budget: project.budget || null,
          timeline: project.timeline || null,
          description: project.description || project.message,
          status: project.status || 'new',
          created_at: project.timestamp || project.createdAt || new Date().toISOString()
        });

      if (error) {
        log.error(`Failed to migrate project inquiry ${project.email}: ${error.message}`);
        failed++;
      } else {
        success++;
      }
    } catch (error) {
      log.error(`Error migrating project inquiry ${project.email}: ${error.message}`);
      failed++;
    }
  }

  return { success, failed };
}

// Create backup of existing data
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  
  try {
    await fs.mkdir(backupDir, { recursive: true });
    
    const files = [CONTACTS_FILE, NEWSLETTER_FILE, PROJECTS_FILE];
    const backupFiles = [];
    
    for (const file of files) {
      if (await fileExists(file)) {
        const filename = path.basename(file, '.json');
        const backupFile = path.join(backupDir, `${filename}-backup-${timestamp}.json`);
        await fs.copyFile(file, backupFile);
        backupFiles.push(backupFile);
      }
    }
    
    if (backupFiles.length > 0) {
      log.success(`Created backup files: ${backupFiles.map(f => path.basename(f)).join(', ')}`);
    }
  } catch (error) {
    log.warning(`Failed to create backup: ${error.message}`);
  }
}

// Main migration function
async function migrate() {
  log.info('🚀 Starting NosytLabs data migration...');
  
  if (isDryRun) {
    log.info('🔍 DRY RUN MODE - No actual changes will be made');
  }

  // Test database connection
  if (!(await testConnection())) {
    process.exit(1);
  }

  // Check existing data
  const existingData = await checkExistingData();
  const hasExistingData = Object.values(existingData).some(count => count > 0);
  
  if (hasExistingData && !isForce && !isDryRun) {
    log.warning('Database already contains data:');
    log.warning(`  - Contact submissions: ${existingData.contacts}`);
    log.warning(`  - Newsletter subscribers: ${existingData.newsletter}`);
    log.warning(`  - Project inquiries: ${existingData.projects}`);
    log.warning('Use --force to proceed anyway or --dry-run to preview changes');
    process.exit(1);
  }

  // Create backup before migration
  if (!isDryRun) {
    await createBackup();
  }

  // Read JSON data files
  const [contacts, newsletter, projects] = await Promise.all([
    readJsonFile(CONTACTS_FILE),
    readJsonFile(NEWSLETTER_FILE),
    readJsonFile(PROJECTS_FILE)
  ]);

  log.info(`Found data to migrate:`);
  log.info(`  - Contact submissions: ${contacts.length}`);
  log.info(`  - Newsletter subscribers: ${newsletter.length}`);
  log.info(`  - Project inquiries: ${projects.length}`);

  if (contacts.length === 0 && newsletter.length === 0 && projects.length === 0) {
    log.info('No data to migrate. Exiting.');
    return;
  }

  // Perform migrations
  const results = {
    contacts: await migrateContacts(contacts),
    newsletter: await migrateNewsletter(newsletter),
    projects: await migrateProjects(projects)
  };

  // Summary
  log.info('\n📊 Migration Summary:');
  log.info(`Contact submissions: ${results.contacts.success} success, ${results.contacts.failed} failed`);
  log.info(`Newsletter subscribers: ${results.newsletter.success} success, ${results.newsletter.failed} failed`);
  log.info(`Project inquiries: ${results.projects.success} success, ${results.projects.failed} failed`);

  const totalSuccess = results.contacts.success + results.newsletter.success + results.projects.success;
  const totalFailed = results.contacts.failed + results.newsletter.failed + results.projects.failed;

  if (totalFailed === 0) {
    log.success(`\n🎉 Migration completed successfully! ${totalSuccess} records migrated.`);
  } else {
    log.warning(`\n⚠️  Migration completed with ${totalFailed} failures and ${totalSuccess} successes.`);
  }

  if (!isDryRun && totalSuccess > 0) {
    log.info('\n💡 Next steps:');
    log.info('1. Verify the migrated data in your Supabase dashboard');
    log.info('2. Update your API endpoints to use the new database');
    log.info('3. Test all forms and functionality');
    log.info('4. Consider archiving the JSON files once everything is working');
  }
}

// Run migration
migrate().catch((error) => {
  log.error(`Migration failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});