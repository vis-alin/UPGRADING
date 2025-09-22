// Simple auth storage using localStorage

import secureStorage from './secureStorage';

const USERS_KEY = 'upsc-portal-users';
const AUTH_KEY = 'upsc-portal-auth';

const loadUsers = () => {
  try {
    const data = secureStorage.getItem(USERS_KEY);
    return data || [];
  } catch (e) {
    console.error('Failed to load users', e);
    return [];
  }
};

const saveUsers = (users) => {
  try {
    secureStorage.setItem(USERS_KEY, users);
    return true;
  } catch (e) {
    console.error('Failed to save users', e);
    return false;
  }
};

const findUserByEmail = (email) => {
  const users = loadUsers();
  return users.find(u => (u.email || '').toLowerCase() === String(email).toLowerCase());
};

const findUserByUsername = (username) => {
  const users = loadUsers();
  return users.find(u => (u.username || '').toLowerCase() === String(username).toLowerCase());
};

const createUser = ({ name, email, password, username, gmailVerified = false }) => {
  const users = loadUsers();
  const existsEmail = email ? users.some(u => (u.email || '').toLowerCase() === String(email).toLowerCase()) : false;
  const existsUsername = username ? users.some(u => (u.username || '').toLowerCase() === String(username).toLowerCase()) : false;
  if (existsEmail) {
    return { ok: false, error: 'Email already registered' };
  }
  if (existsUsername) {
    return { ok: false, error: 'Username already taken' };
  }
  const user = {
    id: Date.now(),
    name: name || 'User',
    email: email || null,
    username: username || null,
    // NOTE: For demo purposes only; do not store plaintext passwords in production
    password,
    role: 'owner',
    gmailVerified: !!gmailVerified,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
};

const validateLogin = ({ email, password }) => {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, error: 'User not found' };
  if (user.password !== password) return { ok: false, error: 'Invalid password' };
  return { ok: true, user };
};

const validateLoginByUsername = ({ username, password }) => {
  const user = findUserByUsername(username);
  if (!user) return { ok: false, error: 'User not found' };
  if (user.password !== password) return { ok: false, error: 'Invalid password' };
  return { ok: true, user };
};

const createUserWithGmail = ({ gmailEmail, name, username, password }) => {
  if (!gmailEmail) return { ok: false, error: 'Gmail verification required' };
  return createUser({ name, email: gmailEmail, username, password, gmailVerified: true });
};

const setAuthSession = (user) => {
  secureStorage.setItem(AUTH_KEY, {
    isAuthenticated: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    loginTime: new Date().toISOString()
  });
};

export default {
  loadUsers,
  saveUsers,
  createUser,
  validateLogin,
  validateLoginByUsername,
  setAuthSession,
  findUserByEmail,
  findUserByUsername,
  createUserWithGmail
};


