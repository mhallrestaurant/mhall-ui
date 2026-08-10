import { Order, Payment, Reservation, CateringRequest, MenuItem, MenuCategory, NotificationLog, StatusHistory, PaymentRecord, ContentBlock, PromoBanner } from '../types';

export const sampleOrders: Order[] = [
  {
    id: 'order_1',
    orderNumber: 'ORD-001',
    customer: {
      id: 'cust_1',
      name: 'John Mugisha',
      phone: '+250 788 123 456',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
    },
    items: [
      { id: 'item_1', menuItemId: 'm1', name: 'Grilled Tilapia', quantity: 2, price: 12000, notes: 'No onions' },
      { id: 'item_2', menuItemId: 'm2', name: 'Isombe', quantity: 1, price: 8000, notes: '' },
    ],
    orderType: 'delivery',
    deliveryAddress: {
      street: 'KG 7 Ave',
      city: 'Kigali',
      postalCode: '00000',
      country: 'Rwanda',
      notes: 'Leave at door',
    },
    subtotal: 32000,
    deliveryFee: 2000,
    tax: 2880,
    total: 36880,
    status: 'preparing',
    paymentStatus: 'partial',
    paymentMethod: 'card',
    customerNotes: 'Please deliver after 7 PM',
    adminNotes: 'VIP customer',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order_2',
    orderNumber: 'ORD-002',
    customer: {
      id: 'cust_2',
      name: 'Marie Uwimana',
      phone: '+250 788 234 567',
      email: 'marie@example.com',
      createdAt: new Date().toISOString(),
    },
    items: [
      { id: 'item_3', menuItemId: 'm3', name: 'Brochette', quantity: 1, price: 3500, notes: 'Extra spicy' },
      { id: 'item_4', menuItemId: 'm4', name: 'Ugali', quantity: 2, price: 2000, notes: '' },
    ],
    orderType: 'pickup',
    pickupTime: '2026-05-01T19:00:00',
    subtotal: 5500,
    deliveryFee: 0,
    tax: 495,
    total: 5995,
    status: 'ready',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    customerNotes: '',
    adminNotes: '',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'order_3',
    orderNumber: 'ORD-003',
    customer: {
      id: 'cust_3',
      name: 'Jean Baptiste',
      phone: '+250 788 345 678',
      email: 'jean@example.com',
      createdAt: new Date().toISOString(),
    },
    items: [
      { id: 'item_5', menuItemId: 'm5', name: 'Sambaza', quantity: 1, price: 8000, notes: '' },
      { id: 'item_6', menuItemId: 'm6', name: 'Mandazi', quantity: 2, price: 1500, notes: '' },
    ],
    orderType: 'delivery',
    deliveryAddress: {
      street: 'KN 4 Road',
      city: 'Kigali',
      postalCode: '00000',
      country: 'Rwanda',
      notes: '',
    },
    subtotal: 11000,
    deliveryFee: 2000,
    tax: 990,
    total: 13990,
    status: 'out_for_delivery',
    paymentStatus: 'paid',
    paymentMethod: 'mobile_money',
    customerNotes: '',
    adminNotes: 'Use back entrance',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export const sampleReservations: Reservation[] = [
  {
    id: 'res_1',
    name: 'Sarah Niyigena',
    phone: '+250 788 111 222',
    email: 'sarah@example.com',
    date: '2026-05-02',
    time: '19:00',
    guests: 4,
    status: 'confirmed',
    notes: 'Wedding anniversary dinner',
    specialRequests: 'Table by the window',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'res_2',
    name: 'David Hakizimana',
    phone: '+250 788 333 444',
    email: 'david@example.com',
    date: '2026-05-03',
    time: '20:00',
    guests: 2,
    status: 'pending',
    notes: '',
    specialRequests: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sampleCateringRequests: CateringRequest[] = [
  {
    id: 'cat_1',
    name: 'Bank of Kigali',
    phone: '+250 788 555 666',
    email: 'events@bk.com',
    eventType: 'Corporate Lunch',
    location: 'KN 5 Road, Kigali',
    date: '2026-05-10',
    time: '12:00',
    guests: 50,
    budget: 1500000,
    status: 'confirmed',
    notes: 'Need vegetarian and vegan options',
    requirements: 'Buffet style service with Rwandan traditional dishes',
    followUpNotes: 'Deposit received via mobile money',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sampleMenuCategories: MenuCategory[] = [
  { id: 'cat_1', name: 'Traditional', description: 'Authentic Rwandan dishes', order: 1, isActive: true, createdAt: new Date().toISOString() },
  { id: 'cat_2', name: 'Grill & BBQ', description: 'Fresh grilled meats and fish', order: 2, isActive: true, createdAt: new Date().toISOString() },
  { id: 'cat_3', name: 'Desserts', description: 'Sweet Rwandan treats', order: 3, isActive: true, createdAt: new Date().toISOString() },
  { id: 'cat_4', name: 'Drinks', description: 'Local and international beverages', order: 4, isActive: true, createdAt: new Date().toISOString() },
];

export const sampleMenuItems: MenuItem[] = [
  { id: 'm1', categoryId: 'cat_2', name: 'Grilled Tilapia', description: 'Fresh Lake Kivu tilapia with lemon and herbs', price: 12000, image: '', isAvailable: true, isFeatured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm2', categoryId: 'cat_1', name: 'Isombe', description: 'Cassava leaves with eggplant and smoked fish', price: 8000, image: '', isAvailable: true, isFeatured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm3', categoryId: 'cat_2', name: 'Brochette', description: 'Marinated beef skewers with spicy sauce', price: 3500, image: '', isAvailable: true, isFeatured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm4', categoryId: 'cat_1', name: 'Ugali', description: 'Traditional maize porridge', price: 2000, image: '', isAvailable: true, isFeatured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm5', categoryId: 'cat_2', name: 'Sambaza', description: 'Small Lake Kivu fish, fried and seasoned', price: 8000, image: '', isAvailable: true, isFeatured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'm6', categoryId: 'cat_3', name: 'Mandazi', description: 'Sweet Rwandan coconut donuts', price: 1500, image: '', isAvailable: true, isFeatured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const sampleContentBlocks: ContentBlock[] = [
  { id: 'cb_1', key: 'hero_title', title: 'Hero Title', content: 'Welcome to Moor Hall Restaurant - Kigali', image: '', link: '', isActive: true, order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cb_2', key: 'hero_subtitle', title: 'Hero Subtitle', content: 'Experience authentic Rwandan cuisine at its finest', image: '', link: '', isActive: true, order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const samplePromoBanners: PromoBanner[] = [
  { id: 'pb_1', title: 'Weekend Special', subtitle: '15% off all traditional dishes', image: '/promo1.jpg', link: '/menu', isActive: true, startDate: '2026-05-01', endDate: '2026-05-31', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
