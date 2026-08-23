import { apiFetch } from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function saveSession(token, user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function registerUser({ name, email, password }) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  saveSession(data.token, data.user);
  return data.user;
}

export async function loginUser({ email, password }) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession(data.token, data.user);
  return data.user;
}

export async function registerMentor({ name, email, password, telegram_chat_id }) {
  const data = await apiFetch('/auth/mentor/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, telegram_chat_id }),
  });
  saveSession(data.token, data.user);
  return data.user;
}

export async function loginMentor({ email, password }) {
  const data = await apiFetch('/auth/mentor/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession(data.token, data.user);
  return data.user;
}

export async function fetchMe() {
  return apiFetch('/auth/me');
}

export function logout() {
  clearSession();
  if (typeof window !== 'undefined') window.location.reload();
}
