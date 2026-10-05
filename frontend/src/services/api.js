const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Central helper: every backend request in the app goes through here.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = 'Bearer ' + token;
  }

  let response;
  try {
    response = await fetch(API_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error('Cannot reach the server. Is the backend running on port 5000?');
  }

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && data.message) || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

export function registerUser({ name, email, password }) {
  return request('/auth/register', { method: 'POST', body: { name, email, password } });
}

export function loginUser({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export async function getNotes() {
  const data = await request('/notes', { auth: true });
  return data.notes;
}

export async function getNote(id) {
  const data = await request('/notes/' + id, { auth: true });
  return data.note;
}

export async function createNote({ title, content }) {
  const data = await request('/notes', { method: 'POST', body: { title, content }, auth: true });
  return data.note;
}

export async function updateNote(id, { title, content }) {
  const data = await request('/notes/' + id, { method: 'PUT', body: { title, content }, auth: true });
  return data.note;
}

export function deleteNote(id) {
  return request('/notes/' + id, { method: 'DELETE', auth: true });
}
