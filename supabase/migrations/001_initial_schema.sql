-- Initial database schema for NosytLabs production setup
-- This migration creates all necessary tables, indexes, and security policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact forms table
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    service VARCHAR(100),
    phone VARCHAR(50),
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'new',
    responded_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    source VARCHAR(100)
);

-- Project inquiries
CREATE TABLE project_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    project_type VARCHAR(100),
    budget VARCHAR(100),
    timeline VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'new'
);

-- Indexes for performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);

CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_created_at ON newsletter_subscribers(subscribed_at DESC);

CREATE INDEX idx_project_inquiries_created_at ON project_inquiries(created_at DESC);
CREATE INDEX idx_project_inquiries_status ON project_inquiries(status);
CREATE INDEX idx_project_inquiries_email ON project_inquiries(email);

-- Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (admin access)
CREATE POLICY "Admin can view all contact submissions" ON contact_submissions
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can view all newsletter subscribers" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can view all project inquiries" ON project_inquiries
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow anonymous inserts for forms
CREATE POLICY "Allow anonymous contact form submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous newsletter subscriptions" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous project inquiries" ON project_inquiries
    FOR INSERT WITH CHECK (true);

-- Grant permissions to anon and authenticated roles
GRANT SELECT, INSERT ON contact_submissions TO anon;
GRANT ALL PRIVILEGES ON contact_submissions TO authenticated;

GRANT SELECT, INSERT ON newsletter_subscribers TO anon;
GRANT ALL PRIVILEGES ON newsletter_subscribers TO authenticated;

GRANT SELECT, INSERT ON project_inquiries TO anon;
GRANT ALL PRIVILEGES ON project_inquiries TO authenticated;

-- Comments for documentation
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website';
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription data';
COMMENT ON TABLE project_inquiries IS 'Stores project inquiry submissions';

COMMENT ON COLUMN contact_submissions.status IS 'Status: new, in_progress, responded, closed';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Status: active, unsubscribed, bounced';
COMMENT ON COLUMN project_inquiries.status IS 'Status: new, reviewing, quoted, accepted, declined';