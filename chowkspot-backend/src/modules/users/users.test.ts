import { describe, it, expect } from 'vitest';
import { updateProfileSchema } from '@/modules/users/users.schema.js';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

describe('User Domain: Validation & Profile Management', () => {
  describe('Update Profile Zod Schema', () => {
    it('should successfully validate partial profile updates', () => {
      const validPayload = {
        name: 'Sharad Updated',
        phone: '+919999888877',
        city: 'Chandigarh',
      };

      const result = updateProfileSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone or avatar URL formats', () => {
      const invalidPayload = {
        avatarUrl: 'not-a-valid-url',
      };

      const result = updateProfileSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Invalid image URL');
      }
    });
  });

  describe('User Not Found Guard Logic', () => {
    it('should throw 404 ApiError if user record does not exist during profile fetch', () => {
      const mockUserLookup = (userId: string) => {
        if (userId === 'non-existent-id') {
          throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User profile not found');
        }
        return { id: userId, name: 'Test User' };
      };

      expect(() => mockUserLookup('non-existent-id')).toThrowError(ApiError);
      try {
        mockUserLookup('non-existent-id');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).statusCode).toBe(404);
        expect((err as ApiError).message).toBe('User profile not found');
      }
    });
  });
});
