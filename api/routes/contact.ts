/**
 * Contact API routes for handling contact forms, newsletter signup, and project inquiries
 */
import { Router, type Request, type Response } from 'express';
import { 
  contactLimiter, 
  newsletterLimiter
} from '../../src/lib/rateLimiter';
import { 
  contactFormSchema, 
  newsletterSchema, 
  projectInquirySchema,
  validateAndSanitize 
} from '../../src/lib/validation';
import { createError, ErrorTypes, asyncErrorHandler } from '../middleware/error-handler';

// Import Supabase client and EmailService
import { supabase, supabaseAdmin } from '../../src/lib/supabase';
import { EmailService } from '../../src/lib/EmailService';
// Initialize services
const emailService = new EmailService();

const router = Router();

/**
 * Contact Form Submission
 * POST /api/contact/form
 */
router.post('/form', contactLimiter, asyncErrorHandler(async (req: Request, res: Response): Promise<void> => {
  // Validate and sanitize input
  let validatedData;
  try {
    validatedData = validateAndSanitize(req.body, contactFormSchema);
  } catch (error) {
    throw createError(
      'Invalid contact form data',
      400,
      ErrorTypes.VALIDATION_ERROR
    );
  }

  const { name, email, message, subject, service, company } = validatedData;
  
  try {
    // Save to Supabase database
    const { data: savedContact, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
        service: service || null,
        company: company || null,
        status: 'new',
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      })
      .select()
      .single();

    if (dbError) {
      throw createError(
        'Failed to save contact form',
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }

    console.log('Contact form submission saved:', savedContact.id);

    // Send confirmation email to user
    await emailService.sendContactConfirmation({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      ...(service && { service }),
      ...(company && { company }),
      timestamp: new Date().toISOString()
    });

    // Send notification to admin
    await emailService.sendAdminContactNotification({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      ...(service && { service }),
      ...(company && { company }),
      timestamp: new Date().toISOString(),
      submissionId: savedContact.id
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Contact form submitted successfully',
      id: savedContact.id
    });
  } catch (error) {
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

/**
 * Newsletter Subscription
 * POST /api/contact/newsletter
 */
router.post('/newsletter', newsletterLimiter, asyncErrorHandler(async (req: Request, res: Response): Promise<void> => {
  // Validate and sanitize input
  let validatedData;
  try {
    validatedData = validateAndSanitize(req.body, newsletterSchema);
  } catch (error) {
    throw createError(
      'Invalid newsletter subscription data',
      400,
      ErrorTypes.VALIDATION_ERROR
    );
  }

  const { email, name, interests } = validatedData;
  
  try {
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        throw createError(
          'Email already subscribed to newsletter',
          400,
          ErrorTypes.VALIDATION_ERROR
        );
      } else {
        // Reactivate subscription
        const { data: reactivatedSubscriber, error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            name: name || null,
            preferences: interests || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id)
          .select()
          .single();

        if (updateError) {
          throw createError(
            'Failed to reactivate newsletter subscription',
            500,
            ErrorTypes.DATABASE_ERROR
          );
        }

        console.log('Newsletter subscription reactivated:', reactivatedSubscriber.id);

        // Send welcome back email
        await emailService.sendNewsletterWelcome({
          email,
          name: name || 'Subscriber',
          preferences: interests || [],
          isReturning: true,
          timestamp: new Date().toISOString()
        });

        res.status(200).json({ 
          success: true,
          message: 'Newsletter subscription reactivated successfully',
          id: reactivatedSubscriber.id
        });
        return;
      }
    }
    
    // Create new subscription
    const { data: savedSubscriber, error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name: name || null,
        preferences: interests || null,
        status: 'active',
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      })
      .select()
      .single();

    if (dbError) {
      throw createError(
        'Failed to save newsletter subscription',
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }
    
    console.log('Newsletter subscription saved:', savedSubscriber.id);

    // Send welcome email
    await emailService.sendNewsletterWelcome({
      email,
      name: name || 'Subscriber',
      preferences: interests || [],
      isReturning: false,
      timestamp: new Date().toISOString()
    });

    // Send admin notification
    await emailService.sendAdminNewsletterNotification({
      email,
      name: name || 'Anonymous',
      preferences: interests || [],
      timestamp: new Date().toISOString(),
      subscriptionId: savedSubscriber.id
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Successfully subscribed to newsletter',
      id: savedSubscriber.id
    });
  } catch (error) {
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

/**
 * Project Inquiry Submission
 * POST /api/contact/project
 */
router.post('/project', contactLimiter, asyncErrorHandler(async (req: Request, res: Response): Promise<void> => {
  // Validate and sanitize input
  let validatedData;
  try {
    validatedData = validateAndSanitize(req.body, projectInquirySchema);
  } catch (error) {
    throw createError(
      'Invalid project inquiry data',
      400,
      ErrorTypes.VALIDATION_ERROR
    );
  }

  const { 
    name, 
    email, 
    company, 
    projectType, 
    budget, 
    timeline, 
    projectDescription,
    features,
    attachments
  } = validatedData;
  
  try {
    // Save to Supabase database
    const { data: savedInquiry, error: dbError } = await supabase
      .from('project_inquiries')
      .insert({
        name,
        email,
        company: company || null,
        project_type: projectType,
        budget,
        timeline,
        description: projectDescription,
        features: features ? JSON.stringify(features) : null,
        attachments: attachments ? JSON.stringify(attachments) : null,
        status: 'new',
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      })
      .select()
      .single();

    if (dbError) {
      throw createError(
        'Failed to save project inquiry',
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }
    
    console.log('Project inquiry saved:', savedInquiry.id);

    // Send confirmation email to user
    await emailService.sendProjectInquiryConfirmation({
      name,
      email,
      company,
      projectType,
      budget,
      timeline,
      description: projectDescription,
      features,
      attachments,
      timestamp: new Date().toISOString()
    });

    // Send notification to admin
    await emailService.sendAdminProjectNotification({
      name,
      email,
      company,
      projectType,
      budget,
      timeline,
      description: projectDescription,
      features,
      attachments,
      timestamp: new Date().toISOString(),
      inquiryId: savedInquiry.id
    });
    
    res.status(200).json({ 
      success: true,
      message: 'Project inquiry submitted successfully',
      id: savedInquiry.id
    });
  } catch (error) {
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

/**
 * Get CSRF Token
 * GET /api/contact/csrf-token
 * Note: CSRF protection is handled at the app level
 */
router.get('/csrf-token', (_req: Request, res: Response): void => {
  // CSRF token is handled by the app-level middleware
  res.status(200).json({ csrfToken: 'csrf-token-placeholder' });
});

/**
 * Get Contact Statistics (Admin only)
 * GET /api/contact/stats
 */
router.get('/stats', asyncErrorHandler(async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get contact form submissions count
    const { count: contactCount, error: contactError } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });

    if (contactError) {
      throw createError(
        'Failed to get contact statistics',
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }

    // Get newsletter subscribers count
    const { count: newsletterCount, error: newsletterError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (newsletterError) {
      throw createError(
        'Failed to get newsletter statistics',
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }

    // Get project inquiries count
    const { count: projectCount, error: projectError } = await supabaseAdmin
      .from('project_inquiries')
      .select('*', { count: 'exact', head: true });

    if (projectError) {
      throw createError(
        'Failed to get project statistics',
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }

    // Get recent submissions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentContactCount, error: recentContactError } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (recentContactError) {
      throw createError(
        'Failed to get recent contact statistics',
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }

    const stats = {
      total: {
        contacts: (contactCount as number) || 0,
        newsletter: (newsletterCount as number) || 0,
        projects: (projectCount as number) || 0
      },
      recent: {
        contacts: (recentContactCount as number) || 0
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

export default router;