// Token payloads and AuthState types

import { APP_CONSTANTS } from '@/config/constants';

export type Role = (typeof APP_CONSTANTS.ROLES)[keyof typeof APP_CONSTANTS.ROLES];

export interface TokenPayload {
  userId: string;
  role: Role;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  city: string;
  isVerified: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: AuthUser;
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  role?: 'USER' | 'WORKER';
  avatarUrl?: string;
}
