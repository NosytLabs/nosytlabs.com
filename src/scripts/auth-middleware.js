/**
 * Auth Middleware Script
 * Redirects to /secure/admin/login if not authenticated
 * To be included in all protected /secure/admin/* pages (except login)
 */
import '/src/scripts/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.location.pathname === '/secure/admin/login') return;

    const auth = new window.AdminAuth();

    if (!auth.isLoggedIn) {
      window.location.href = '/secure/admin/login';
      return;
    }

    const userRole = auth.user?.role || null;
    if (userRole !== 'admin') {
      console.warn('Access denied: user lacks admin role');
      window.location.href = '/secure/admin/login';
      return;
    }
  } catch (e) {
    console.error('Auth middleware error:', e);
    window.location.href = '/secure/admin/login';
  }
});