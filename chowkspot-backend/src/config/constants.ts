export const CONSTANTS = {
  // --- JWT & Cookie Security Settings ---
  JWT: {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    REFRESH_TOKEN_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    COOKIE_NAME: 'jid',
  },

  // --- API Rate Limiting Thresholds ---
  RATE_LIMIT: {
    GLOBAL_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    GLOBAL_MAX_REQUESTS: 100,
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    AUTH_MAX_REQUESTS: 10,
  },

  // --- Pagination & Query Defaults ---
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 50,
  },

  // --- User Roles ---
  ROLES: {
    USER: 'USER',
    WORKER: 'WORKER',
    ADMIN: 'ADMIN',
  },

  // --- Booking State Machine Statuses ---
  BOOKING_STATUS: {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    COUNTER_PROPOSED: 'COUNTER_PROPOSED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  },

  // --- Worker Rate Types ---
  RATE_TYPES: {
    HOURLY: 'HOURLY',
    FIXED: 'FIXED',
    INSPECTION_FIRST: 'INSPECTION_FIRST',
  },

  // --- HTTP Status Codes ---
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    PAYLOAD_TOO_LARGE: 413,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  },
} as const;

export type Role = (typeof CONSTANTS.ROLES)[keyof typeof CONSTANTS.ROLES];
export type BookingStatus = (typeof CONSTANTS.BOOKING_STATUS)[keyof typeof CONSTANTS.BOOKING_STATUS];
export type RateType = (typeof CONSTANTS.RATE_TYPES)[keyof typeof CONSTANTS.RATE_TYPES];
