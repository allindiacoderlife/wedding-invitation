export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  createdAt: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  exp: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}
