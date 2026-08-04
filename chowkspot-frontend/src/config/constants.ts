// Booking status maps, roles, rate types (matching backend)

export const APP_CONSTANTS = {
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

  // --- Service Categories ---
  CATEGORIES: [
    'Electrician',
    'Plumber',
    'Carpenter',
    'AC & Appliance Technician',
    'Painter',
    'Mechanic & Auto Expert',
    'Industrial Electrician',
    'CCTV & Security Specialist',
    'Solar & Inverter Technician',
    'Home Cleaning & Pest Control',
    'Welder & Fabrication Expert',
    'Mason & Tiler',
  ] as const,

  // --- Region Presets ---
  CITIES: [
    'Parwanoo',
    'Chandigarh',
    'Mohali',
    'Panchkula',
    'Kalka',
    'Pinjore',
    'Solan',
    'Shimla',
    'Baddi',
    'Nalagarh',
    'Zirakpur',
    'Dharampur',
  ] as const,

  // --- UI Badge Color Maps for Booking Statuses ---
  STATUS_BADGE_VARIANTS: {
    PENDING: 'warning',
    ACCEPTED: 'info',
    REJECTED: 'danger',
    COUNTER_PROPOSED: 'purple',
    IN_PROGRESS: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'muted',
  } as const,
} as const;
