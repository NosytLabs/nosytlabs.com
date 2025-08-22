// Supabase client configuration for NosytLabs production setup
import { createClient } from '@supabase/supabase-js';

// Environment variables validation (temporarily relaxed for development)
if (!process.env.SUPABASE_URL && process.env.NODE_ENV === 'production') {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_ANON_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Client-side Supabase client (uses anon key)
// Only create client if we have real credentials
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && 
    !process.env.SUPABASE_URL.includes('placeholder') && 
    !process.env.SUPABASE_ANON_KEY.includes('placeholder')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'nosytlabs-website'
      }
    }
  });
} else {
  // Mock client for development
  supabase = {
    from: () => ({
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }) }),
      select: () => ({ eq: () => ({ order: () => ({ range: () => Promise.resolve({ data: [], error: null }) }) }) })
    })
  };
}

export { supabase };

// Server-side Supabase client with service role key (admin privileges)
let supabaseAdmin = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && 
    !process.env.SUPABASE_URL.includes('placeholder') && 
    process.env.SUPABASE_SERVICE_ROLE_KEY.length > 10) {
  supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'X-Client-Info': 'nosytlabs-website-admin'
        }
      }
    }
  );
} else {
  // Mock admin client for development
  supabaseAdmin = {
    from: () => ({
      select: () => ({ order: () => ({ range: () => Promise.resolve({ data: [], error: null }) }) })
    })
  };
}

export { supabaseAdmin };

// Database helper functions
export const db = {
  // Contact submissions
  async createContactSubmission(data) {
    const { data: submission, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        service: data.service,
        phone: data.phone,
        company: data.company
      })
      .select()
      .single();
    
    if (error) throw error;
    return submission;
  },

  // Newsletter subscriptions
  async createNewsletterSubscription(email, source = 'website') {
    const { data: subscription, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        source
      })
      .select()
      .single();
    
    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        throw new Error('Email already subscribed to newsletter');
      }
      throw error;
    }
    return subscription;
  },

  // Project inquiries
  async createProjectInquiry(data) {
    const { data: inquiry, error } = await supabase
      .from('project_inquiries')
      .insert({
        name: data.name,
        email: data.email,
        company: data.company,
        project_type: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        description: data.description
      })
      .select()
      .single();
    
    if (error) throw error;
    return inquiry;
  },

  // Admin functions (using service role)
  async getContactSubmissions(limit = 50, offset = 0) {
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  async getNewsletterSubscribers(limit = 50, offset = 0) {
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .order('subscribed_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  async getProjectInquiries(limit = 50, offset = 0) {
    const { data, error } = await supabaseAdmin
      .from('project_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  }
};

// Connection test function
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return { success: true, message: 'Supabase connection successful' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}