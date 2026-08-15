import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/modules/auth/auth.schema.js';
import { hashPassword, verifyPassword } from '@/utils/password.js';

describe('Auth Module: Validation & Security', () => {
  describe('Zod Validation Schemas', () => {
    it('should validate a correct registration payload', () => {
      const payload = {
        name: 'Sharad Chandel',
        email: 'sharad@chowkspot.com',
        password: 'SecurePassword123!',
        phone: '+917590889608',
        city: 'Parwanoo',
        role: 'USER',
      };

      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject registration with weak passwords (< 8 chars)', () => {
      const payload = {
        name: 'Sharad Chandel',
        email: 'sharad@chowkspot.com',
        password: 'short',
        phone: '+917590889608',
        city: 'Parwanoo',
        role: 'USER',
      };

      const result = registerSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          'Password must be at least 8 characters',
        );
      }
    });

    it('should reject malformed email strings on login', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email-format',
        password: 'SecurePassword123!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Argon2 Hashing Utilities', () => {
    it('should successfully hash and verify a plain text password', async () => {
      const plainPassword = 'MySuperSecretPassword@2026';
      const hashed = await hashPassword(plainPassword);

      expect(hashed).toBeTypeOf('string');
      expect(hashed).not.toBe(plainPassword);

      const isValid = await verifyPassword(hashed, plainPassword);
      expect(isValid).toBe(true);
    });

    it('should fail verification for an incorrect password', async () => {
      const hashed = await hashPassword('CorrectPassword123!');
      const isValid = await verifyPassword(hashed, 'WrongPassword999!');
      expect(isValid).toBe(false);
    });
  });
});
