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
    // --- Everyday Local Trades & Skilled Services ---
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Masonry & Brickwork',
    'Welder & Fabricator',
    'Key Maker & Locksmith',
    'Cobbler & Shoe Repair',
    'Tailor & Alterations',
    'Ironing & Pressing',
    'Handyman & Odd Jobs',
    'Glass & Window Repair',
    'Roofing & Waterproofing',
    'Flooring & Tiling',
    'Furniture Renovation',
    'Gutter & Drain Cleaner',

    // --- Daily Essentials, Utilities & Supplies ---
    'Milk Delivery Service',
    'Water Tanker Supplier',
    'Gas Cylinder Delivery',
    'Gas Stove Mechanic',
    'Newspaper Vendor',
    'Grocery Delivery Boy',
    'Vegetable & Fruit Vendor',
    'Tiffin & Home Food Service',
    'Waste & Scrap Collector (Raddiwalas)',

    // --- Home Maintenance, Appliance & Tech ---
    'Home Appliance Repair',
    'Bike & Scooter Mechanic',
    'Car Mechanic',
    'Car Wash & Detailing',
    'Cycle Mechanic',
    'Home Automation Tech',
    'Generator Mechanic',
    'HVAC & AC Service',
    'Mobile & Tablet Repair',
    'IT & Computer Support',
    'CCTV & Security Tech',
    'Solar Panel Installer',
    'Drone Operator & Tech',
    'Fire Safety Tech',
    'Web Development',
    'Graphic Design',
    'Social Media Helper',

    // --- Cleaning, Hygiene & Facility Services ---
    'Home Cleaning',
    'Carpet Cleaning',
    'Sofa Cleaning',
    'Curtain Cleaning',
    'Window Cleaning',
    'Water Tank Cleaning',
    'Pest Control Specialist',
    'Pressure Washing Specialist',
    'Laundry & Dry Cleaning',

    // --- Gardening, Landscaping & Agriculture ---
    'Gardener & Plant Care',
    'Landscaping Specialist',
    'Tree Pruning & Cutting',
    'Rooftop Garden Setup',

    // --- Caregiving, Wellness & Personal Grooming ---
    'Child Care & Nanny',
    'Elderly Care Assistant',
    'Pet Sitting & Dog Walker',
    'Pet Grooming Specialist',
    'Veterinary Assistant',
    'Fitness Trainer',
    'Yoga Instructor',
    'Dietician & Nutritionist',
    'Ayurveda Practitioner',
    'Massage Therapist',
    'Makeup Artist & Beautician',
    'Mehndi Artist',

    // --- Events, Ceremonies & Traditional Services ---
    'Pandit & Puja Specialist',
    'Vastu Consultant',
    'Astrologer',
    'Tent House Provider',
    'Catering Service',
    'Event Decorator',
    'Party & DJ Manager',
    'Wedding Planner Helper',
    'Photographer',
    'Videographer',

    // --- Education, Advisory & Moving ---
    'Home Tutor',
    'Career Counselor',
    'Legal Advisor',
    'Tax & GST Accountant',
    'Packers & Movers',
    'Car Transport Helper',
  ] as const,

  // --- Region Presets ---
  CITIES: [
    // --- Loved Immediate Belt (Parwanoo & Nearby) ---
    'Parwanoo',
    'Chandigarh',
    'Mohali',
    'Panchkula',
    'Kalka',
    'Pinjore',
    'Baddi',
    'Shimla',

    // --- Himachal Pradesh Belt ---
    'Solan',
    'Nalagarh',
    'Dharampur',
    'Kandaghat',
    'Barotiwala',
    'Waknaghat',
    'Subathu',
    'Dagshai',
    'Kasauli',
    'Chail',
    'Bilaspur',
    'Mandi',
    'Kullu',
    'Manali',
    'Dharamshala',
    'Kangra',
    'Palampur',
    'Hamirpur',
    'Una',
    'Nahan',
    'Paonta Sahib',
    'Sundernagar',
    'Chamba',

    // --- Tricity Satellites & Punjab Belt ---
    'Zirakpur',
    'Dera Bassi',
    'Kharar',
    'Landran',
    'New Chandigarh',
    'Kurali',
    'Ropar (Rupnagar)',
    'Patiala',
    'Ludhiana',
    'Jalandhar',
    'Amritsar',
    'Bathinda',
    'Pathankot',
    'Hoshiarpur',
    'Phagwara',
    'Rajpura',
    'Fatehgarh Sahib',
    'Mandi Gobindgarh',
    'Khanna',

    // --- Haryana Belt ---
    'Ambala Cantt',
    'Ambala City',
    'Yamunanagar',
    'Jagadhri',
    'Kurukshetra',
    'Karnal',
    'Panipat',
    'Sonipat',
    'Rohtak',
    'Hisar',
    'Sirsa',
    'Gurugram',
    'Faridabad',
    'Rewari',
    'Bahadurgarh',

    // --- Uttarakhand Belt ---
    'Dehradun',
    'Haridwar',
    'Rishikesh',
    'Roorkee',
    'Haldwani',
    'Rudrapur',
    'Kashipur',
    'Mussoorie',

    // --- Jammu & NCR North ---
    'Jammu',
    'Samba',
    'Kathua',
    'Udhampur',
    'Noida',
    'Greater Noida',
    'Ghaziabad',
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
