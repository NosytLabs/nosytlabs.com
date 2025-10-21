// Security Headers Middleware
// Implements essential HTTP security headers to protect against common vulnerabilities

export interface SecurityHeadersConfig {
  contentSecurityPolicy?: string;
  frameOptions?: "DENY" | "SAMEORIGIN" | "ALLOW-FROM";
  contentTypeOptions?: boolean;
  xssProtection?: boolean;
  referrerPolicy?: string;
  permissionsPolicy?: string;
  hsts?: {
    maxAge: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
}

const DEFAULT_SECURITY_HEADERS: SecurityHeadersConfig = {
  contentSecurityPolicy:
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';",
  frameOptions: "DENY",
  contentTypeOptions: true,
  xssProtection: true,
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: "camera=(), microphone=(), geolocation=()",
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
};

export function getSecurityHeaders(
  config: SecurityHeadersConfig = {},
): Record<string, string> {
  const mergedConfig = { ...DEFAULT_SECURITY_HEADERS, ...config };
  const headers: Record<string, string> = {};

  if (mergedConfig.contentSecurityPolicy) {
    headers["Content-Security-Policy"] = mergedConfig.contentSecurityPolicy;
  }

  if (mergedConfig.frameOptions) {
    headers["X-Frame-Options"] = mergedConfig.frameOptions;
  }

  if (mergedConfig.contentTypeOptions) {
    headers["X-Content-Type-Options"] = "nosniff";
  }

  if (mergedConfig.xssProtection) {
    headers["X-XSS-Protection"] = "1; mode=block";
  }

  if (mergedConfig.referrerPolicy) {
    headers["Referrer-Policy"] = mergedConfig.referrerPolicy;
  }

  if (mergedConfig.permissionsPolicy) {
    headers["Permissions-Policy"] = mergedConfig.permissionsPolicy;
  }

  if (mergedConfig.hsts) {
    const { maxAge, includeSubDomains, preload } = mergedConfig.hsts;
    let hstsValue = `max-age=${maxAge}`;
    if (includeSubDomains) hstsValue += "; includeSubDomains";
    if (preload) hstsValue += "; preload";
    headers["Strict-Transport-Security"] = hstsValue;
  }

  return headers;
}

// Astro middleware function
export function securityHeadersMiddleware() {
  return (_context: unknown, next: () => Promise<Response>) => {
    return next().then((response) => {
      const headers = getSecurityHeaders();

      // Apply security headers to the response
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    });
  };
}
