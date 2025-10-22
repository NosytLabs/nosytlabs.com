import { useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@heroui/react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
}

export function HeroUIContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Import form service dynamically
      const { submitContactForm } = await import(
        "../../lib/forms/form-service"
      );
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          service: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardBody className="p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Get Technical Assessment
          </h3>
          <p className="text-muted-foreground">
            Tell us about your project. We'll respond with actionable insights
            within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <Input
            label="Name"
            placeholder="Your full name"
            value={formData.name}
            onValueChange={(value) => handleChange("name", value)}
            isRequired
            variant="bordered"
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
            }}
          />

          {/* Email */}
          <Input
            type="email"
            label="Email"
            placeholder="your.email@example.com"
            value={formData.email}
            onValueChange={(value) => handleChange("email", value)}
            isRequired
            variant="bordered"
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
            }}
          />

          {/* Subject */}
          <Input
            label="Subject"
            placeholder="Brief description of your project"
            value={formData.subject}
            onValueChange={(value) => handleChange("subject", value)}
            isRequired
            variant="bordered"
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
            }}
          />

          {/* Service */}
          <Select
            label="Service Interested In"
            placeholder="Select a service"
            selectedKeys={formData.service ? [formData.service] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange("service", value);
            }}
            variant="bordered"
            classNames={{
              label: "text-sm font-medium",
            }}
          >
            {services.map((service) => (
              <SelectItem key={service.value}>{service.label}</SelectItem>
            ))}
          </Select>

          {/* Message */}
          <Textarea
            label="Message"
            placeholder="Tell us about your project requirements, timeline, and goals..."
            value={formData.message}
            onValueChange={(value) => handleChange("message", value)}
            isRequired
            variant="bordered"
            minRows={6}
            classNames={{
              input: "text-base",
              label: "text-sm font-medium",
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full font-semibold"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-success">
              <p className="font-medium">Message sent successfully!</p>
              <p className="text-sm mt-1">
                We'll get back to you within 24 hours.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <p className="font-medium">Failed to send message</p>
              <p className="text-sm mt-1">
                Please try again or email us directly at hello@nosytlabs.com
              </p>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}

export default HeroUIContactForm;
