// Base types for Moor Hall Restaurant Admin System

export type ID = string;

export type Status = 'new' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'failed' | 'cancelled';

export type BackendOrderStatus = 'PENDING' | 'PAYMENT_WAITING' | 'PAYMENT_UNDER_REVIEW' | 'APPROVED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';

export type BackendPaymentStatus = 'NOT_REQUIRED' | 'WAITING_PAYMENT' | 'UNDER_REVIEW' | 'PARTIALLY_PAID' | 'PAID' | 'REJECTED' | 'FAILED' | 'CANCELLED';

export type PaymentMethod = 'cash' | 'card' | 'online' | 'pay_on_delivery' | 'custom' | 'mobile_money';
export type GuestPaymentSelection = 'partial' | 'paid';

export type OrderType = 'pickup' | 'delivery';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'no_show';

export type CateringStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type NotificationType = string;

export type NotificationStatus = 'sent' | 'failed' | 'pending' | 'cancelled' | 'delivered' | 'read';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export interface Customer {
  id: ID;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}

export interface OrderItem {
  id: ID;
  menuItemId: ID;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  specialInstructions?: string;
}

export interface Order {
  id: ID;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  orderType: OrderType;
  deliveryAddress?: Address;
  pickupTime?: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: Status;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Payment {
  id: ID;
  orderId: ID;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: ID;
  orderId: ID;
  amount: number;
  method: PaymentMethod;
  type: 'full' | 'partial' | 'deposit';
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  createdAt: string;
}

export interface StatusHistory {
  id: ID;
  orderId: ID;
  previousStatus: Status;
  newStatus: Status;
  timestamp: string;
  notificationSent: boolean;
  notificationId?: string;
  updatedBy?: string;
}

export interface Reservation {
  id: ID;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CateringRequest {
  id: ID;
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  location: string;
  date: string;
  time: string;
  guests: number;
  budget?: number;
  status: CateringStatus;
  notes?: string;
  requirements?: string;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: ID;
  categoryId: ID;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  productType: 'FOOD' | 'COFFEE' | 'DRINK' | 'BAKERY';
  price: number;
  image?: string;
  images?: string[]; // Additional image URLs
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime?: number;
  createdAt: string;
  updatedAt: string;
}

export type CategoryType = 'FOOD' | 'COFFEE' | 'DRINK' | 'BAKERY' | 'SPECIAL';

export interface MenuCategory {
  id: ID;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  type: CategoryType;
  createdAt: string;
}

export interface NotificationLog {
  id: ID;
  phoneNumber: string;
  type: NotificationType;
  message: string;
  status: NotificationStatus;
  orderId?: ID;
  reservationId?: ID;
  cateringId?: ID;
  sentAt: string;
  read?: boolean;
  error?: string;
}

export interface AdminActionLog {
  id: ID;
  adminId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface DashboardMetrics {
  totalOrders: number;
  ordersByStatus: Record<Status, number>;
  totalRevenue: number;
  paymentSummary: Record<PaymentStatus, number>;
  totalReservations: number;
  totalCateringRequests: number;
  popularItems: Array<{name: string; count: number}>;
  recentOrders: Order[];
  revenueByDay: Array<{date: string; amount: number}>;
}

export interface ReportData {
  period: {
    start: string;
    end: string;
  };
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: Record<Status, number>;
  paymentBreakdown: Record<PaymentStatus, number>;
  popularItems: Array<{name: string; count: number; revenue: number}>;
  reservationsCount: number;
  cateringRequestsCount: number;
  averageOrderValue: number;
}

export interface ContentBlock {
  id: ID;
  key: string;
  title?: string;
  body?: string;
  dataJson?: any;
  isPublished: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface PromoBanner {
  id: ID;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: ID;
  name: string;
  slug: string;
  type: 'CATERING' | 'EVENT' | 'OTHER';
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSetting {
  id: ID;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  admin: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    role: string;
    status: string;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
