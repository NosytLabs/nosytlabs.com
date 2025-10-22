import { useState } from "react";
import type { FormEvent } from "react";
import {
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
  Card,
  CardBody,
  Chip,
  type Selection,
} from "@heroui/react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  service?: string;
  message?: string;
}

export function HeroUIContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ContactFormData, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const services = [
    { value: "web-development", label: "Web Application Development" },
    { value: "mobile-app", label: "Mobile App Development" },
    { value: "ai-integration", label: "AI Integration & Automation" },
    { value: "rapid-prototype", label: "Rapid Prototype/MVP Development" },
    { value: "3d-printing", label: "3D Printing Services" },
    { value: "ai-music", label: "AI Music & Jingles" },
    { value: "consulting", label: "Tech Consulting & SEO Audits" },
    { value: "general", label: "General Inquiry" },
    { value: "other", label: "Other" },
  ];

  const messageCharLimit = 1500;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field: keyof ContactFormData, value: string) => {
    const trimmedValue = value.trim();

    switch (field) {
      case "name":
        if (!trimmedValue) return "Name is required.";
        if (trimmedValue.length < 2)
          return "Name must be at least 2 characters.";
        if (trimmedValue.length > 100)
          return "Name must be less than 100 characters.";
        return undefined;
      case "email":
        if (!trimmedValue) return "Email is required.";
        if (!emailRegex.test(trimmedValue))
          return "Please enter a valid email address.";
        return undefined;
      case "subject":
        if (!trimmedValue) return "Subject is required.";
        if (trimmedValue.length < 5)
          return "Subject must be at least 5 characters.";
        if (trimmedValue.length > 150)
          return "Subject must be less than 150 characters.";
        return undefined;
      case "service":
        if (!trimmedValue) return "Please select a service.";
        return undefined;
      case "message":
        if (!trimmedValue) return "Message is required.";
        if (trimmedValue.length < 20)
          return "Message must be at least 20 characters.";
        if (trimmedValue.length > messageCharLimit)
          return "Message is too long.";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (data: ContactFormData) => {
    const validationErrors: FieldErrors = {};

    (Object.keys(data) as Array<keyof ContactFormData>).forEach((field) => {
      const error = validateField(field, data[field]);
      if (error) {
        validationErrors[field] = error;
      }
    });

    return validationErrors;
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitStatus("idle");
    setFeedbackMessage(null);

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleServiceSelection = (keys: Selection) => {
    const value =
      typeof keys === "string"
        ? keys
        : (Array.from(keys)[0] as string | undefined);
    const nextValue = value ?? "";

    setTouched((prev) => ({ ...prev, service: true }));
    handleChange("service", nextValue);

    const error = validateField("service", nextValue);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next.service = error;
      } else {
        delete next.service;
      }
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("idle");
    setFeedbackMessage(null);
    setIsSubmitting(true);

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        email: true,
        subject: true,
        service: true,
        message: true,
      });
      setIsSubmitting(false);
      setSubmitStatus("error");
      setFeedbackMessage("Please review the highlighted fields and try again.");
      return;
    }

    try {
      const { submitContactForm } = await import(
        "../../lib/forms/form-service"
      );
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus("success");
        setFeedbackMessage(
          result.message ||
            "Message sent successfully! We'll get back to you soon.",
        );
        setFormData({
          name: "",
          email: "",
          subject: "",
          service: "",
          message: "",
        });
        setErrors({});
        setTouched({});
      } else {
        setSubmitStatus("error");
        setFeedbackMessage(
          result.message || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setFeedbackMessage(
        "An unexpected error occurred. Please try again or email hello@nosytlabs.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageCharCount = formData.message.length;
  const messageRemainingChars = messageCharLimit - messageCharCount;
  const showMessageHint = messageRemainingChars <= messageCharLimit * 0.2;
  const feedbackRole = submitStatus === "success" ? "status" : "alert";
  const feedbackAriaLive = submitStatus === "success" ? "polite" : "assertive";

  return (
    <Card className="w-full shadow-lg">
      <CardBody className="p-6 md:p-8">
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">
              Get Technical Assessment
            </h3>
            <Chip
              size="sm"
              color="primary"
              variant="flat"
              className="font-medium"
              startContent={
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 011 1v3h3a1 1 0 110 2h-4a1 1 0 01-1-1V6a1 1 0 011-1z" />
                </svg>
              }
            >
              24-hr reply
            </Chip>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tell us about your project and we'll respond with actionable
            insights and honest estimates.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
          aria-busy={isSubmitting}
        >
          {/* Name */}
          <Input
            label="Name *"
            placeholder="Your full name"
            value={formData.name}
            onValueChange={(value) => handleChange("name", value)}
            onBlur={() => handleBlur("name")}
            autoComplete="name"
            isRequired
            variant="bordered"
            isInvalid={touched.name && !!errors.name}
            errorMessage={touched.name && errors.name}
            description={
              !errors.name ? "Your full name (2-100 characters)" : undefined
            }
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
              errorMessage: "text-xs",
            }}
          />

          {/* Email */}
          <Input
            type="email"
            label="Email *"
            placeholder="your.email@example.com"
            value={formData.email}
            onValueChange={(value) => handleChange("email", value)}
            onBlur={() => handleBlur("email")}
            autoComplete="email"
            isRequired
            variant="bordered"
            isInvalid={touched.email && !!errors.email}
            errorMessage={touched.email && errors.email}
            description={
              !errors.email ? "We'll never share your email" : undefined
            }
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
              errorMessage: "text-xs",
            }}
          />

          {/* Subject */}
          <Input
            label="Subject *"
            placeholder="Brief description of your project"
            value={formData.subject}
            onValueChange={(value) => handleChange("subject", value)}
            onBlur={() => handleBlur("subject")}
            autoComplete="off"
            maxLength={150}
            isRequired
            variant="bordered"
            isInvalid={touched.subject && !!errors.subject}
            errorMessage={touched.subject && errors.subject}
            description={
              !errors.subject
                ? "What's this about? (5-150 characters)"
                : undefined
            }
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
              errorMessage: "text-xs",
            }}
          />

          {/* Service */}
          <Select
            label="Service Interested In *"
            placeholder="Select a service"
            selectedKeys={
              formData.service ? new Set([formData.service]) : new Set()
            }
            onSelectionChange={handleServiceSelection}
            onBlur={() => handleBlur("service")}
            isRequired
            variant="bordered"
            isInvalid={touched.service && !!errors.service}
            errorMessage={touched.service && errors.service}
            description={
              !errors.service
                ? "Which service are you interested in?"
                : undefined
            }
            classNames={{
              label: "text-sm font-medium",
              errorMessage: "text-xs",
            }}
          >
            {services.map((service) => (
              <SelectItem key={service.value}>{service.label}</SelectItem>
            ))}
          </Select>

          {/* Message */}
          <div className="space-y-2">
            <Textarea
              label="Message *"
              placeholder="Tell us about your project requirements, timeline, and goals..."
              value={formData.message}
              onValueChange={(value) => handleChange("message", value)}
              onBlur={() => handleBlur("message")}
              autoComplete="off"
              isRequired
              variant="bordered"
              minRows={6}
              maxRows={10}
              maxLength={messageCharLimit}
              isInvalid={touched.message && !!errors.message}
              errorMessage={touched.message && errors.message}
              description={
                !errors.message
                  ? "Share details about your project (min. 20 chars)"
                  : undefined
              }
              classNames={{
                input: "text-base",
                label: "text-sm font-medium",
                errorMessage: "text-xs",
              }}
            />
            <div className="flex justify-between items-center text-xs px-1">
              <span className="text-muted-foreground">
                {messageCharCount} / {messageCharLimit} characters
              </span>
              {showMessageHint && (
                <Chip
                  size="sm"
                  color={
                    messageCharCount > messageCharLimit ? "danger" : "warning"
                  }
                  variant="flat"
                  className="text-xs"
                >
                  {messageCharCount > messageCharLimit
                    ? `${Math.abs(messageRemainingChars)} over limit`
                    : `${messageRemainingChars} left`}
                </Chip>
              )}
            </div>
          </div>

          {/* Feedback Message */}
          {feedbackMessage && (
            <div
              role={feedbackRole}
              aria-live={feedbackAriaLive}
              aria-atomic="true"
              className={`p-4 rounded-lg border ${
                submitStatus === "success"
                  ? "bg-success/10 border-success/30 text-success"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              <div className="flex items-start gap-3">
                {submitStatus === "success" ? (
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{feedbackMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold shadow-lg hover:shadow-xl transition-all"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {/* Additional Help */}
        <div className="mt-6 pt-6 border-t border-default-200">
          <p className="text-xs text-muted-foreground text-center">
            Prefer email?{" "}
            <a
              href="mailto:hello@nosytlabs.com"
              className="text-primary hover:underline font-medium"
            >
              hello@nosytlabs.com
            </a>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default HeroUIContactForm;
