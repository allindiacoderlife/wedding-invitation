// Centralized API configuration for client frontend
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.BACKEND_URL ||
  'http://localhost:8000'
).replace(/\/$/, '');

export default API_BASE_URL;
