/**
 * Supabase Configuration for NosytLabs
 * Uses the official Supabase client for database operations
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://jvorgukgexezucwxygdi.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2b3JndWtnZXhlenVjd3h5Z2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODg1MjksImV4cCI6MjA2MTM2NDUyOX0.XjaK_jo1f3MbkgHy7rlD8Vr-_x61vO1uRBRGCmDrXEo';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2b3JndWtnZXhlenVjd3h5Z2RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTc4ODUyOSwiZXhwIjoyMDYxMzY0NTI5fQ.N00v7ZnO8qP1jC7n_aB0KxufHw6PA-dpyA2Wweclw-Y';

// Create Supabase client for public operations (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Create Supabase client for admin operations (service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database operations using Supabase client
export class SupabaseOperations {
  
  // Contact form submission
  static async submitContact(contactData: {
    name: string;
    email: string;
    company?: string;
    message: string;
    services?: string[];
    budget?: string;
    timeline?: string;
  }) {
    try {
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .insert([{
          name: contactData.name,
          email: contactData.email,
          company: contactData.company,
          message: contactData.message,
          services: contactData.services,
          budget: contactData.budget,
          timeline: contactData.timeline,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Contact submission error:', error);
        throw new Error(`Failed to submit contact: ${error.message}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Contact submission failed:', error);
      throw error;
    }
  }

  // Newsletter subscription
  static async subscribeNewsletter(email: string, name?: string, source?: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert([{
          email,
          name,
          source,
          status: 'active',
          subscribed_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Newsletter subscription error:', error);
        throw new Error(`Failed to subscribe: ${error.message}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      throw error;
    }
  }

  // Analytics tracking
  static async trackEvent(eventData: {
    event_type: string;
    page_url?: string;
    user_agent?: string;
    ip_address?: string;
    session_id?: string;
    metadata?: any;
  }) {
    try {
      const { data, error } = await supabaseAdmin
        .from('analytics')
        .insert([{
          event_type: eventData.event_type,
          page_url: eventData.page_url,
          user_agent: eventData.user_agent,
          ip_address: eventData.ip_address,
          session_id: eventData.session_id,
          metadata: eventData.metadata,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Analytics tracking error:', error);
        throw new Error(`Failed to track event: ${error.message}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      throw error;
    }
  }

  // Get analytics data
  static async getAnalytics(limit = 100) {
    try {
      const { data, error } = await supabaseAdmin
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get analytics error:', error);
        throw new Error(`Failed to get analytics: ${error.message}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Get analytics failed:', error);
      throw error;
    }
  }

  // Test database connection
  static async testConnection() {
    try {
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .select('count(*)')
        .limit(1);

      if (error) {
        console.error('Connection test error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Database connection successful' };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export configuration
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  serviceKey: supabaseServiceKey
};

export default supabase;
