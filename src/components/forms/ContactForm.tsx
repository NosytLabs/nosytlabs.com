import React, { useState } from "react";
import { User, Mail, MessageSquare, Briefcase, Send, Loader2, X } from "lucide-react";
import {
  validateContactForm,
  type ContactFormData,
} from "@/lib/forms/form-validator";
import { useToast } from "@/hooks/use-toast";
import type { BaseComponentProps } from "@/types";

interface ContactFormProps extends BaseComponentProps {
  onSubmit?: (data: ContactFormData) => void;
}

const MAX_MESSAGE_LENGTH = 2000;
const MIN_MESSAGE_LENGTH = 10;

const serviceOptions = [
  { value: "", label: "Select a service (optional)" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app", label: "Mobile App Development" },
  { value: "ai-integration", label: "AI Integration & Automation" },
  { value: "consulting", label: "Tech Consulting & SEO" },
  { value: "rapid-prototype", label: "Rapid Prototype Development" },
  { value: "3d-printing", label: "3D Printing Services" },
  { value: "other", label: "Other" },
];

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    subject: "",
    service: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleInputChange =
    (field: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      
      if (field === "message" && value.length > MAX_MESSAGE_LENGTH) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { submitContactForm } = await import("@/lib/forms/form-service");
      const result = await submitContactForm(formData);

      if (result.success) {
        setShowSuccess(true);
        toast({
          title: "Message sent successfully!",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });

        setFormData({
          name: "",
          email: "",
          message: "",
          subject: "",
          service: "",
        });

        onSubmit?.(formData);
      } else {
        toast({
          title: "Failed to send message",
          description: result.message || "Please try again or contact us directly.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description:
          "Failed to send message. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
      subject: "",
      service: "",
    });
    setErrors({});
    setShowSuccess(false);
  };

  const messageLength = formData.message.length;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-muted/20 shadow-2xl border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative p-8 md:p-12">
          {showSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-green-600 dark:text-green-400">Message sent successfully!</h3>
                  <p className="mt-1 text-sm text-green-600/80 dark:text-green-400/80">We'll get back to you as soon as possible.</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${errors.name ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    placeholder="John Doe"
                    autoComplete="name"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 ${
                      errors.name
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                    <X className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 ${
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                    <X className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-semibold text-foreground">
                  Subject <span className="text-destructive">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className={`h-5 w-5 transition-colors ${errors.subject ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                  </div>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange("subject")}
                    placeholder="Project inquiry"
                    autoComplete="off"
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border-2 bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 ${
                      errors.subject
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    }`}
                  />
                </div>
                {errors.subject && (
                  <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                    <X className="h-3 w-3" />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="block text-sm font-semibold text-foreground">
                  Service Interest
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={handleInputChange("service")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-border bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
                  >
                    {serviceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                Message <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange("message")}
                  rows={8}
                  placeholder="Tell us about your project, goals, and timeline..."
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-background transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 resize-vertical ${
                    errors.message
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                />
                <div className={`absolute bottom-3 right-3 text-xs font-medium transition-colors ${
                  messageLength > MAX_MESSAGE_LENGTH * 0.9 ? 'text-destructive' : 
                  messageLength >= MIN_MESSAGE_LENGTH ? 'text-primary' : 
                  'text-muted-foreground'
                }`}>
                  {messageLength}/{MAX_MESSAGE_LENGTH}
                </div>
              </div>
              {errors.message && (
                <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
                  <X className="h-3 w-3" />
                  {errors.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum {MIN_MESSAGE_LENGTH} characters required
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 group relative overflow-hidden px-8 py-4 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isSubmitting
                    ? "bg-primary/70 text-primary-foreground cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="px-8 py-4 rounded-lg font-semibold border-2 border-border bg-background text-foreground hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
