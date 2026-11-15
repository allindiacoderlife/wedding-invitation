import fs from 'fs';
import path from 'path';
import { User } from '@/types/auth';
import { hashPassword, verifyPassword } from './auth-crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users_store.json');

export interface StoredUser extends User {
  passwordHash: string;
}

const SEED_USERS: StoredUser[] = [
  {
    id: 'user_demo_01',
    name: 'Priya & Rohan',
    email: 'demo@vaishnovision.com',
    phone: '+91 98765 43210',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    passwordHash: hashPassword('password123'),
    createdAt: '2026-11-01T10:00:00Z',
  },
  {
    id: 'user_admin_01',
    name: 'Vaishno Video Vision Admin',
    email: 'admin@vaishnovision.com',
    phone: '+91 99887 76655',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    passwordHash: hashPassword('admin123'),
    createdAt: '2026-11-01T08:00:00Z',
  },
];

function ensureUsersFile(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(SEED_USERS, null, 2), 'utf-8');
      return SEED_USERS;
    }

    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(content) as StoredUser[];
  } catch (err) {
    console.error('Error reading users store, returning seed:', err);
    return SEED_USERS;
  }
}

function writeUsersFile(users: StoredUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing users store:', err);
  }
}

export const userStore = {
  getAllUsers(): User[] {
    const users = ensureUsersFile();
    return users.map(({ passwordHash, ...user }) => user);
  },

  findUserByEmail(email: string): StoredUser | undefined {
    const users = ensureUsersFile();
    const cleanEmail = (email || '').trim().toLowerCase();
    return users.find((u) => u.email.toLowerCase() === cleanEmail);
  },

  findUserById(id: string): User | undefined {
    const users = ensureUsersFile();
    const found = users.find((u) => u.id === id);
    if (!found) return undefined;
    const { passwordHash, ...user } = found;
    return user;
  },

  createUser(params: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = ensureUsersFile();
    const cleanEmail = params.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: params.name.trim(),
      email: cleanEmail,
      phone: params.phone?.trim(),
      role: 'user',
      passwordHash: hashPassword(params.password),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsersFile(users);

    const { passwordHash, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  },

  authenticate(
    email: string,
    password: string
  ): { success: boolean; user?: User; error?: string } {
    const stored = this.findUserByEmail(email);
    if (!stored) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isValid = verifyPassword(password, stored.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    const { passwordHash, ...safeUser } = stored;
    return { success: true, user: safeUser };
  },
};
