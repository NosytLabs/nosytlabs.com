/**
 * Contact API routes - simplified for EmailJS client-side integration
 * These routes now return success responses for preview/testing purposes
 * Actual email sending is handled by EmailJS on the client side
 */
import { Router, type Request, type Response } from 'express';
import { 
  contactLimiter, 
  newsletterLimiter
} from '../../src/lib/rateLimiter';
import { 
  contactFormSchema, 
  newsletterSchema,
  validateAndSanitize 
} from '../../src/lib/validation';
import { ErrorFactory, asyncHandler } from '../../src/utils/unified-error-handler';
import { setCSRFToken } from '../../src/lib/csrf';

const router = Router();

/**
 * Contact Form Submission
 * POST /api/contact/form
 */
router.post('/form', contactLimiter, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  
  // Validate and sanitize input
  let validatedData;
  try {
    validatedData = validateAndSanitize(req.body, contactFormSchema);
  } catch (error) {
    throw ErrorFactory.validation('Invalid contact form data');
  }

  // Generate a simple ID for tracking
  const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('Contact form submission received (EmailJS mode):', submissionId);

  // In EmailJS mode, we just return success - actual email sending happens client-side
  res.status(200).json({ 
    success: true,
    message: 'Contact form submitted successfully',
    id: submissionId
  });
}));

/**
 * Newsletter Subscription
 * POST /api/contact/newsletter
 */
router.post('/newsletter', newsletterLimiter, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  
  // Validate and sanitize input
  let validatedData;
  try {
    validatedData = validateAndSanitize(req.body, newsletterSchema);
  } catch (error) {
    throw ErrorFactory.validation('Invalid newsletter subscription data');
  }

  const { email, name, interests } = validatedData;
  
  // Generate a simple ID for tracking
  const subscriptionId = `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('Newsletter subscription received (EmailJS mode):', subscriptionId);

  // In EmailJS mode, we just return success - actual email sending happens client-side
  res.status(200).json({ 
    success: true,
    message: 'Successfully subscribed to newsletter',
    id: subscriptionId
  });
}));



/**
 * Get CSRF Token
 * GET /api/contact/csrf-token
 */
router.get('/csrf-token', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Generate and set CSRF token using shared middleware util
    const csrfToken = await setCSRFToken(req, res);

    res.status(200).json({ 
      success: true,
      csrfToken 
    });
  } catch (error) {
    throw ErrorFactory.internal('Failed to generate CSRF token');
  }
}));

/**
 * Get Contact Statistics (Admin only)
 * GET /api/contact/stats
 */
router.get('/stats', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  try {
    // Since we removed the database, return placeholder stats
    const stats = {
      total: {
        contacts: 0,
        newsletter: 0,
        projects: 0
      },
      recent: {
        contacts: 0
      },
      timestamp: new Date().toISOString(),
      note: 'Statistics tracking disabled - using email-only mode'
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

/**
 * Booking Consultation Endpoint
 * POST /api/contact/booking
 */
router.post('/booking', contactLimiter, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  
  // Validate and sanitize input
  let validatedData;
  try {
    validatedData = validateAndSanitize(req.body, compositeBookingSchema);
  } catch (error) {
    throw ErrorFactory.validation('Invalid booking inquiry data');
  }

  if (process.env.NODE_ENV === 'production' && process.env.SERVE_STATIC === 'true') {
    res.status(200).json({ 
      success: true,
      message: 'Booking inquiry submitted successfully (preview mode)',
      id: 'preview-id'
    });
    return;
  }

  const { 
    name, 
    email, 
    phone,
    company, 
    timezone,
    consultationType,
    businessSize,
    currentChallenges,
    goals,
    projectGoals,
    preferredDate,
    preferredTime,
    meetingType,
    duration,
    additionalNotes
  } = validatedData as any;
  
  try {
    // Generate a simple ID for tracking
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Processing booking inquiry:', bookingId);

    // Send confirmation email to user
    await emailService.sendBookingConfirmation({
      name,
      email,
      consultationType,
      preferredDate,
      preferredTime,
      meetingType,
      duration,
      timestamp: new Date().toISOString()
    });

    // Send notification to admin
    await emailService.sendAdminBookingNotification({
      name,
      email,
      phone,
      company,
      consultationType,
      businessSize,
      currentChallenges,
      goals, // pass through as-is; may be undefined
      projectGoals, // include projectGoals as well; downstream can decide display
      preferredDate,
      preferredTime,
      meetingType,
      duration,
      additionalNotes,
      timestamp: new Date().toISOString(),
      bookingId: bookingId
    });
  
    res.status(200).json({ 
      success: true,
      message: 'Booking inquiry submitted successfully',
      id: bookingId
    });
  } catch (error) {
    // Re-throw to be handled by error middleware
    throw error;
  }
}));

export default router;