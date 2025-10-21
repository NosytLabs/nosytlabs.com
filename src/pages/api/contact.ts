import type { APIRoute } from "astro";
import { sanitizeInput } from "@/lib/utils/validation";
import {
  validateContactForm,
  type ContactFormData,
} from "@/lib/forms/form-validator";
import { SITE_CONFIG } from "../../lib/constants";
import {
  createErrorResponse,
  createSuccessResponse,
  createHealthCheck,
  withAPIMiddleware,
  parseRequestData,
} from "@/lib/api/api-helpers";

// NOTE: For static builds, this API endpoint is disabled
// For production, use a serverless function (Vercel, Netlify) or form service (Formspree, Netlify Forms)
export const prerender = true;

// Contact API endpoint loaded in development mode

// Sanitize contact data helper
function sanitizeContactData(data: ContactFormData): ContactFormData {
  return {
    name: sanitizeInput(String(data.name || "")),
    email: sanitizeInput(String(data.email || "")),
    subject: sanitizeInput(String(data.subject || "")),
    service: sanitizeInput(String(data.service || "")),
    message: sanitizeInput(String(data.message || "")),
  };
}

// Server-side validation now uses unified form validator
// validateContactForm function is imported from @/utils/form-validator

// Email notification service using Resend
async function sendEmailNotification(data: ContactFormData): Promise<void> {
  // Check if we have the required environment variables
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || SITE_CONFIG.EMAILS.HI;
  const toEmail = process.env.CONTACT_TO_EMAIL || SITE_CONFIG.EMAILS.HI;

  // In development or if no API key, log the email data
  if (process.env.NODE_ENV === "development" || !resendApiKey) {
    // Email notification (development mode)
    // To: ${toEmail}
    // From: ${fromEmail}
    // Reply-To: ${data.email}
    // Subject: [Contact Form] ${data.subject}
    // Content: ${JSON.stringify({
    //   name: data.name,
    //   email: data.email,
    //   subject: data.subject,
    //   message: data.message
    // }, null, 2)}
    // End email
    return;
  }

  // Production email sending with Resend
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    const emailHtml = `
      <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>

        <div>
          <h3>Contact Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Service:</strong> ${data.service}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
        </div>

        <div>
          <h3>Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>

        <div style="margin-top: 16px; font-size: 12px;">
          <p>This email was sent from the NOSYT Labs contact form.</p>
          <p>Reply directly to this email to respond to ${data.name}.</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `[Contact Form] ${data.subject}`,
      html: emailHtml,
    });

    // Email sent successfully via Resend
  } catch (error) {
    // Failed to send email via Resend
    throw error;
  }
}

// GET endpoint for testing API availability
export const GET: APIRoute = createHealthCheck("Contact");

export const POST: APIRoute = withAPIMiddleware(async (request) => {
  const isDev = process.env.NODE_ENV === "development";

  // Debug logging removed for production readiness

  // Use the parseRequestData helper to handle different content types
  const data = await parseRequestData<ContactFormData>(request, "contact_form");

  if (!data) {
    if (isDev) {
      let headers = {};
      try {
        headers = request.headers
          ? Object.fromEntries(request.headers.entries())
          : {};
      } catch (_e) {
        // Error converting headers to object
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid form data format",
          debug: {
            contentType: request.headers?.get("content-type") || "unknown",
            headers,
            hasHeaders: !!request.headers,
            requestConstructor: request.constructor.name,
            data,
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    return createErrorResponse(
      "Invalid form data format",
      400,
      "contact_parse_null",
    );
  }

  // Sanitize the data
  const sanitizedData = sanitizeContactData(data);
  if (process.env.NODE_ENV === "development") {
    // Parsed fields
  }

  // Validate the form data
  const validation = validateContactForm(sanitizedData);
  if (!validation.isValid) {
    return createErrorResponse(Object.values(validation.errors).join(", "));
  }

  // Send email notification (simulated)
  try {
    await sendEmailNotification(sanitizedData);
    return createSuccessResponse(
      {
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
      },
      "Message sent successfully! We'll get back to you soon.",
    );
  } catch (error) {
    throw error;
  }
});
