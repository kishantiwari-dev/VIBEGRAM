import { request } from './api';

/**
 * POST /api/auth/login
 * identifier: email or username
 */
export async function loginUser(identifier, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

/**
 * POST /api/auth/register
 */
export async function registerUser(name, username, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, username, email, password }),
  });
}
