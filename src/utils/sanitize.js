// Frontend input sanitization helpers (basic XSS/SQLi hardening)

const stripControl = (s) => String(s).replace(/[\u0000-\u001F\u007F]/g, '');

export const sanitizeString = (s, maxLen = 200) => {
  if (s == null) return '';
  let v = stripControl(s).trim();
  // Remove common SQL meta chars and quotes that are unneeded in usernames/emails
  v = v.replace(/["'`;]/g, '');
  // Collapse whitespace
  v = v.replace(/\s+/g, ' ');
  if (v.length > maxLen) v = v.slice(0, maxLen);
  return v;
};

export const sanitizeUsername = (s, maxLen = 30) => {
  let v = sanitizeString(s, maxLen).toLowerCase();
  // Allow letters, numbers, underscore, dot, hyphen
  v = v.replace(/[^a-z0-9._-]/g, '');
  return v;
};

export const sanitizeEmail = (s, maxLen = 120) => {
  let v = sanitizeString(s, maxLen).toLowerCase();
  // Very basic email cleanup
  v = v.replace(/[^a-z0-9@._+-]/g, '');
  return v;
};

export const sanitizeUrl = (s, maxLen = 500) => {
  let v = sanitizeString(s, maxLen);
  // Only allow http/https drive links
  if (!/^https?:\/\//i.test(v)) return '';
  return v;
};

export const isGmail = (email) => /@gmail\.com$/i.test(email || '');




