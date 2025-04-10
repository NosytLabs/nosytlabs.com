/**
 * Shared AdminAuth class for authentication
 * Used by middleware and admin panel
 */
class AdminAuth {
  constructor() {
    this.tokenKey = 'admin_token';
  }

  get isLoggedIn() {
    return Boolean(localStorage.getItem(this.tokenKey));
  }

  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  get user() {
    // Dummy user object for now
    return this.isLoggedIn ? { role: 'admin', name: 'Admin User' } : null;
  }

  login(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  // Placeholder for future API key validation
  async validateToken() {
    if (!this.token) return false;
    try {
      const res = await fetch('/api/radiation-zones', {
        headers: { 'Authorization': this.token }
      });
      return res.status === 200;
    } catch {
      return false;
    }
  }
}

window.AdminAuth = AdminAuth;