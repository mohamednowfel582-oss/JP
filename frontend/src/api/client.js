// API Client for Complaint Management System
const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('cms_token');
}

export function getCurrentUser() {
  const user = localStorage.getItem('cms_user');
  const role = localStorage.getItem('cms_role');
  if (!user || !role) return null;
  try {
    return { ...JSON.parse(user), role };
  } catch (e) {
    return null;
  }
}

export function setAuthSession(token, user, role) {
  localStorage.setItem('cms_token', token);
  localStorage.setItem('cms_user', JSON.stringify(user));
  localStorage.setItem('cms_role', role);
}

export function clearAuthSession() {
  localStorage.removeItem('cms_token');
  localStorage.removeItem('cms_user');
  localStorage.removeItem('cms_role');
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.error) || (data && data.message) || `HTTP error ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
