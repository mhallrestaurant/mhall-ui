import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const API_URL = (import.meta.env && import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:3005/api/v1') as string;

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    // Request interceptor to add auth token (from localStorage or cookies)
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Check localStorage first, then cookies (for auto-login)
        const token = localStorage.getItem('adminToken') || this.getCookie('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        } else if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json';
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          // Don't attempt to refresh login/register endpoints
          if (originalRequest.url === '/auth/login' || originalRequest.url === '/auth/register') {
            return Promise.reject(error);
          }

          // Prevent infinite loop if the refresh request itself fails
          if (originalRequest.url === '/auth/refresh') {
            // Refresh failed, clear auth and set flag
            localStorage.removeItem('adminToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('adminUser');
            // Signal to components that auth has expired
            sessionStorage.setItem('authExpired', 'true');
            return Promise.reject(error);
          }

          // Check for refresh token in localStorage or cookies (for auto-login)
          const refreshToken = localStorage.getItem('refreshToken') || this.getCookie('refreshToken');
          
          if (refreshToken) {
            originalRequest._retry = true;
            
            try {
              const response = await this.client.post('/auth/refresh', { refreshToken });
              const responseData = response.data.data || response.data;
              const { accessToken, refreshToken: newRefreshToken } = responseData;
              
              if (!accessToken) {
                throw new Error('No access token in refresh response');
              }
              
              localStorage.setItem('adminToken', accessToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            } catch (refreshError) {
              // Refresh failed, clear auth
              localStorage.removeItem('adminToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('isAdminLoggedIn');
              localStorage.removeItem('adminUser');
              // Signal to components that auth has expired
              sessionStorage.setItem('authExpired', 'true');
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token available, clear auth
            localStorage.removeItem('adminToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('adminUser');
            sessionStorage.setItem('authExpired', 'true');
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Helper to get cookie value (handles SSR)
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  // Auth
   async login(data: { email: string; password: string; rememberMe?: boolean }) {
     return this.client.post('/auth/login', { ...data, rememberMe: data.rememberMe ?? true });
   }

   async register(data: { 
     fullName: string;
     email: string; 
     password: string; 
     phoneNumber?: string;
     rememberMe?: boolean;
   }) {
     return this.client.post('/auth/register', { ...data, rememberMe: data.rememberMe ?? false });
   }

  async refreshToken(refreshToken: string) {
    return this.client.post('/auth/refresh', { refreshToken });
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
    return response;
  }

  async getMe() {
    return this.client.get('/auth/me');
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.client.patch('/auth/change-password', data);
  }

  async updateProfile(data: { fullName?: string; phoneNumber?: string }) {
    return this.client.patch('/auth/profile', data);
  }

  // Password reset
  async forgotPassword(data: { email: string }) {
    return this.client.post('/auth/forgot-password', data);
  }

  async resetPassword(data: { resetToken: string; newPassword: string; confirmPassword: string }) {
    return this.client.post('/auth/reset-password', data);
  }

  // Menu Items
  async getMenuItems(params?: { categoryId?: number; includeUnavailable?: boolean }) {
    return this.client.get('/admin/menu-items', { params });
  }

  async getMenuItem(id: number) {
    return this.client.get(`/admin/menu-items/${id}`);
  }

  async createMenuItem(data: any) {
    return this.client.post('/admin/menu-items', data);
  }

  // PDF Upload - Bulk Menu Item Processing from PDF
  async uploadPdfFile(file: File) {
    const formData = new FormData();
    formData.append('pdf', file);
    return this.client.post('/admin/menu-items/upload-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

   async updateMenuItem(id: number, data: any) {
    return this.client.patch(`/admin/menu-items/${id}`, data);
  }

  async uploadMenuItemImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return this.client.post('/admin/menu-items/images', formData);
  }

  async toggleMenuItemAvailability(id: number) {
    return this.client.patch(`/admin/menu-items/${id}/availability`);
  }

  async deleteMenuItem(id: number) {
    return this.client.delete(`/admin/menu-items/${id}`);
  }

  // Categories
  async getCategories(params?: { includeInactive?: boolean }) {
    return this.client.get('/admin/categories', { params });
  }

  async getCategory(id: number) {
    return this.client.get(`/admin/categories/${id}`);
  }

  async createCategory(data: any) {
    return this.client.post('/admin/categories', data);
  }

  async updateCategory(id: number, data: any) {
    return this.client.patch(`/admin/categories/${id}`, data);
  }

  async deleteCategory(id: number) {
    return this.client.delete(`/admin/categories/${id}`);
  }

  // Orders
  async getOrders(params?: { status?: string; paymentStatus?: string; page?: number; limit?: number }) {
    return this.client.get('/orders', { params });
  }

  async getOrder(id: number) {
    return this.client.get(`/orders/${id}`);
  }

  async deleteOrder(id: number) {
    return this.client.delete(`/orders/${id}`);
  }

  async updateOrderStatus(id: number, status?: string, note?: string, paymentStatus?: string, customerEmail?: string) {
    return this.client.patch(`/orders/${id}/status`, { status, note, paymentStatus, customerEmail });
  }

  async reviewPayment(id: number, action: 'approve' | 'reject', note?: string) {
    return this.client.patch(`/orders/${id}/payment-review`, { action, note });
  }

  async sendCustomEmail(orderId: number, message: string, customerEmail?: string) {
    return this.client.post(`/orders/${orderId}/email/send`, { message, customerEmail });
  }

  async sendCustomWhatsApp(orderId: number, message: string) {
    return this.client.post(`/orders/${orderId}/whatsapp/send`, { message });
  }

  // Dashboard
  async getDashboardStats() {
    return this.client.get('/admin/dashboard');
  }

  async resetRevenue() {
    return this.client.post('/admin/dashboard/reset-revenue');
  }

  // Service Items
  async getServiceItems() {
    return this.client.get('/admin/service-items');
  }

  async createServiceItem(data: any) {
    return this.client.post('/admin/service-items', data);
  }

  async updateServiceItem(id: number, data: any) {
    return this.client.patch(`/admin/service-items/${id}`, data);
  }

  async deleteServiceItem(id: number) {
    return this.client.delete(`/admin/service-items/${id}`);
  }

  // Reservations
  async getReservations(params?: { status?: string; page?: number; limit?: number }) {
    return this.client.get('/admin/reservations', { params });
  }

  async updateReservationStatus(id: number, status: string, email?: string) {
    return this.client.patch(`/admin/reservations/${id}/status`, { status, email });
  }

  // Catering
  async getCateringRequests(params?: { status?: string; page?: number; limit?: number }) {
    return this.client.get('/catering', { params });
  }

  async updateCateringStatus(id: number, status: string, email?: string) {
    return this.client.patch(`/catering/${id}/status`, { status, email });
  }

  // Payments
  async getPayments(params?: { orderId?: number; page?: number; limit?: number }) {
    return this.client.get('/admin/payments', { params });
  }

  async verifyPayment(id: number, status: 'VERIFIED' | 'REJECTED', note?: string) {
    return this.client.post(`/admin/payments/${id}/verify`, { status, note });
  }

  // Notifications
  async getNotifications(params?: { type?: string; sentStatus?: string; orderId?: number; page?: number; limit?: number }) {
    return this.client.get('/admin/notifications', { params });
  }

  // Content
  async getContentBlocks() {
    return this.client.get('/admin/content/blocks');
  }

  async updateContentBlock(id: number, data: any) {
    return this.client.patch(`/admin/content/blocks/${id}`, data);
  }

  async getPromoBanners() {
    return this.client.get('/admin/content/promo-banners');
  }

  async updatePromoBanner(id: number, data: any) {
    return this.client.patch(`/admin/content/promo-banners/${id}`, data);
  }

  // Settings
  async getSettings() {
    return this.client.get('/admin/settings');
  }

  async updateSetting(id: number, data: any) {
    return this.client.patch(`/admin/settings/${id}`, data);
  }

  // Reports
  async getReports(params: { startDate: string; endDate: string }) {
    return this.client.get('/admin/reports', { params });
  }

  async getRevenueStats(params?: { period?: 'daily' | 'weekly' | 'monthly' }) {
    return this.client.get('/admin/reports/revenue', { params });
  }

  // ─── Public endpoints (no auth required) ─────────────────────────────────────

  async getPublicMenuItems(params?: { categoryId?: number; productType?: string }) {
    return this.client.get('/menu-items', { params });
  }

  async getPublicMenuItemById(id: number) {
    return this.client.get(`/menu-items/${id}`);
  }

  // Guest Order - Public endpoint
  async createGuestOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAltPhone?: string;
    deliveryAddress?: string;
    locationNotes?: string;
    orderType: 'pickup' | 'delivery';
    paymentSelection?: 'partial' | 'paid';
    items: Array<{
      menuItemId: number;
      quantity: number;
      notes?: string;
    }>;
    notes?: string;
  }) {
    return this.client.post('/orders/guest', data);
  }

  // Guest Reservation - Public endpoint
  async createGuestReservation(data: {
    name: string;
    phone: string;
    email?: string;
    date: string;
    time: string;
    guests?: number;
    notes?: string;
  }) {
    return this.client.post('/reservations/guest', data);
  }

  // Guest Catering Request - Public endpoint
  async createGuestCateringRequest(data: {
    name: string;
    phone: string;
    email?: string;
    eventType: string;
    eventLocation: string;
    preferredDate: string;
    guests?: number;
    notes?: string;
  }) {
    return this.client.post('/catering/guest', data);
  }

  // Guest Event Booking - Public endpoint
  async createGuestEvent(data: {
    name: string;
    phone: string;
    eventType: string;
    eventDate: string;
    guests: number;
    eventLocation?: string;
    notes?: string;
  }) {
    return this.client.post('/events/guest', data);
  }
}

export const apiService = new ApiService();
export default apiService;