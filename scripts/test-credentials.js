#!/usr/bin/env node

/**
 * Credential Testing Script for NosytLabs
 * Tests all API connections and credentials
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class CredentialTester {
  constructor() {
    this.results = {
      supabase: { status: 'pending', message: '' },
      resend: { status: 'pending', message: '' },
      overall: { status: 'pending', message: '' }
    };
  }

  // Test Supabase connection
  async testSupabase() {
    console.log('🔍 Testing Supabase connection...');
    
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection by trying to query a table
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .limit(1);

      if (error) {
        throw new Error(`Supabase query failed: ${error.message}`);
      }

      this.results.supabase = {
        status: 'success',
        message: '✅ Supabase connection successful'
      };
      
      console.log('✅ Supabase: Connected successfully');
      return true;
    } catch (error) {
      this.results.supabase = {
        status: 'error',
        message: `❌ Supabase error: ${error.message}`
      };
      
      console.error('❌ Supabase:', error.message);
      return false;
    }
  }

  // Test Resend email service
  async testResend() {
    console.log('📧 Testing Resend email service...');
    
    try {
      const resendKey = process.env.RESEND_API_KEY;
      
      if (!resendKey) {
        throw new Error('Missing Resend API key');
      }

      const resend = new Resend(resendKey);
      
      // Test by getting domain information (doesn't send email)
      const domains = await resend.domains.list();
      
      this.results.resend = {
        status: 'success',
        message: '✅ Resend API connection successful'
      };
      
      console.log('✅ Resend: API key valid and connected');
      return true;
    } catch (error) {
      this.results.resend = {
        status: 'error',
        message: `❌ Resend error: ${error.message}`
      };
      
      console.error('❌ Resend:', error.message);
      return false;
    }
  }

  // Test email sending (optional)
  async testEmailSending(testEmail = 'test@nosytlabs.com') {
    console.log('📨 Testing email sending...');
    
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const resend = new Resend(resendKey);
      
      const { data, error } = await resend.emails.send({
        from: 'NosytLabs <noreply@nosytlabs.com>',
        to: [testEmail],
        subject: 'NosytLabs - Test Email',
        html: `
          <h1>Test Email from NosytLabs</h1>
          <p>This is a test email to verify the email system is working correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        `
      });

      if (error) {
        throw new Error(`Email sending failed: ${error.message}`);
      }

      console.log('✅ Email: Test email sent successfully');
      console.log('📧 Email ID:', data.id);
      return true;
    } catch (error) {
      console.error('❌ Email sending:', error.message);
      return false;
    }
  }

  // Generate summary report
  generateReport() {
    console.log('\n📊 CREDENTIAL TEST SUMMARY');
    console.log('================================');
    
    const supabaseStatus = this.results.supabase.status === 'success' ? '✅' : '❌';
    const resendStatus = this.results.resend.status === 'success' ? '✅' : '❌';
    
    console.log(`${supabaseStatus} Supabase Database: ${this.results.supabase.message}`);
    console.log(`${resendStatus} Resend Email: ${this.results.resend.message}`);
    
    const allSuccess = this.results.supabase.status === 'success' && 
                      this.results.resend.status === 'success';
    
    if (allSuccess) {
      console.log('\n🎉 ALL CREDENTIALS WORKING!');
      console.log('✅ Your NosytLabs site is ready for production');
      this.results.overall = {
        status: 'success',
        message: 'All systems operational'
      };
    } else {
      console.log('\n⚠️  SOME CREDENTIALS NEED ATTENTION');
      console.log('❌ Please fix the issues above before deploying');
      this.results.overall = {
        status: 'error',
        message: 'Some credentials need fixing'
      };
    }
    
    return allSuccess;
  }

  // Main test runner
  async runAllTests() {
    console.log('🚀 NosytLabs Credential Testing');
    console.log('================================\n');
    
    try {
      // Test all services
      await this.testSupabase();
      await this.testResend();
      
      // Generate final report
      const success = this.generateReport();
      
      // Exit with appropriate code
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error('❌ Test runner failed:', error.message);
      process.exit(1);
    }
  }
}

// Run tests if called directly
const tester = new CredentialTester();
tester.runAllTests();

export default CredentialTester;
