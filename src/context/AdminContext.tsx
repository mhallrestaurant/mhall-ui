import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  Order,
  Payment,
  PaymentRecord,
  StatusHistory,
  Reservation,
  CateringRequest,
  MenuItem,
  MenuCategory,
  NotificationLog,
  AdminActionLog,
  DashboardMetrics,
  ContentBlock,
  PromoBanner,
  Status,
  PaymentStatus,
  ReservationStatus,
  CateringStatus,
  NotificationType,
  NotificationStatus,
  PaymentMethod,
  OrderType,
  Address,
  Customer,
  OrderItem,
} from '../types';
import apiService from '../services/api';

interface AdminContextType {
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: Status) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus) => void;
  getOrderById: (id: string) => Order | undefined;

  // Payments
  payments: Payment[];
  paymentRecords: PaymentRecord[];
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addPaymentRecord: (record: Omit<PaymentRecord, 'id' | 'createdAt'>) => void;

  // Status History
  statusHistory: StatusHistory[];
  addStatusHistory: (history: Omit<StatusHistory, 'id'>) => void;

  // Reservations
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;

  // Catering Requests
  cateringRequests: CateringRequest[];
  addCateringRequest: (request: Omit<CateringRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCateringStatus: (id: string, status: CateringStatus) => void;

  // Menu
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addMenuCategory: (category: Omit<MenuCategory, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;

  // Notifications
  notifications: NotificationLog[];
  addNotification: (notification: Omit<NotificationLog, 'id' | 'sentAt'>) => void;
  resendNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendCustomEmail: (orderId: string, message: string) => Promise<boolean>;

  // Admin Actions
  adminActions: AdminActionLog[];
  logAdminAction: (action: Omit<AdminActionLog, 'id' | 'timestamp'>) => void;

  // Content Management
  contentBlocks: ContentBlock[];
  updateContentBlock: (id: string, updates: Partial<ContentBlock>) => void;

  // Promo Banners
  promoBanners: PromoBanner[];
  updatePromoBanner: (id: string, updates: Partial<PromoBanner>) => void;

  // Dashboard Metrics
  getDashboardMetrics: () => DashboardMetrics;

  // Reports
  generateReport: (startDate: string, endDate: string) => any;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  // Initialize state
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cateringRequests, setCateringRequests] = useState<CateringRequest[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [adminActions, setAdminActions] = useState<AdminActionLog[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API on mount
  const normalizeApiResponse = (response: any): any[] => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    return Array.isArray(response.data?.data?.data) ? response.data.data.data : [];
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load from localStorage first for immediate display
        const savedOrders = localStorage.getItem('mh_orders');
        const savedPayments = localStorage.getItem('mh_payments');
        const savedReservations = localStorage.getItem('mh_reservations');
        const savedCatering = localStorage.getItem('mh_catering');
        const savedMenuItems = localStorage.getItem('mh_menuItems');
        const savedCategories = localStorage.getItem('mh_menuCategories');
        const savedNotifications = localStorage.getItem('mh_notifications');
        const savedStatusHistory = localStorage.getItem('mh_statusHistory');
        const savedContentBlocks = localStorage.getItem('mh_contentBlocks');
        const savedPromoBanners = localStorage.getItem('mh_promoBanners');
        const savedPaymentRecords = localStorage.getItem('mh_paymentRecords');
        const savedAdminActions = localStorage.getItem('mh_adminActions');

        if (savedOrders) setOrders(JSON.parse(savedOrders));
        if (savedPayments) setPayments(JSON.parse(savedPayments));
        if (savedReservations) setReservations(JSON.parse(savedReservations));
        if (savedCatering) setCateringRequests(JSON.parse(savedCatering));
        if (savedMenuItems) setMenuItems(JSON.parse(savedMenuItems));
        if (savedCategories) setMenuCategories(JSON.parse(savedCategories));
        if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
        if (savedStatusHistory) setStatusHistory(JSON.parse(savedStatusHistory));
        if (savedContentBlocks) setContentBlocks(JSON.parse(savedContentBlocks));
        if (savedPromoBanners) setPromoBanners(JSON.parse(savedPromoBanners));
        if (savedPaymentRecords) setPaymentRecords(JSON.parse(savedPaymentRecords));
        if (savedAdminActions) setAdminActions(JSON.parse(savedAdminActions));

        // Fetch from API
        const [
          menuItemsRes,
          categoriesRes,
          reservationsRes,
          ordersRes,
          paymentsRes,
          cateringRes,
          notificationsRes,
        ] = await Promise.all([
          apiService.getMenuItems({ includeUnavailable: true }).catch((error) => {
            console.error('Failed to load menu items:', error);
            return { data: { data: [] } };
          }),
          apiService.getCategories({ includeInactive: true }).catch((error) => {
            console.error('Failed to load categories:', error);
            return { data: { data: [] } };
          }),
          apiService.getReservations().catch((error) => {
            console.error('Failed to load reservations:', error);
            return { data: { data: [] } };
          }),
          apiService.getOrders().catch((error) => {
            console.error('Failed to load orders:', error);
            return { data: { data: [] } };
          }),
          apiService.getPayments().catch((error) => {
            console.error('Failed to load payments:', error);
            return { data: { data: [] } };
          }),
          apiService.getCateringRequests().catch((error) => {
            console.error('Failed to load catering requests:', error);
            return { data: { data: [] } };
          }),
          apiService.getNotifications().catch((error) => {
            console.error('Failed to load notifications:', error);
            return { data: { data: [] } };
          }),
        ]);

        const menuItemsData = normalizeApiResponse(menuItemsRes);
        const transformedItems = menuItemsData.map((item: any) => ({
          ...item,
          image: item.imageUrl,
          images: item.images || [],
          shortDescription: item.shortDescription || undefined,
          productType: item.productType || 'FOOD',
        }));
        setMenuItems(transformedItems);

        const categoriesData = normalizeApiResponse(categoriesRes);
        const transformedCategories = categoriesData.map((cat: any) => ({
          ...cat,
          order: cat.displayOrder,
        }));
        setMenuCategories(transformedCategories);
        if (reservationsRes.data?.data) {
          const transformedReservations = reservationsRes.data.data.map((res: any) => ({
            ...res,
            id: String(res.id),
            name: res.customerName,
            phone: res.phoneNumber,
            date: res.reservationDate ? new Date(res.reservationDate).toISOString().split('T')[0] : res.reservationDate,
            time: res.reservationTime,
            guests: res.guestCount,
            notes: res.notes || undefined,
            specialRequests: res.notes || undefined,
            status: normalizeReservationStatus(res.status),
          }));
          setReservations(transformedReservations);
        }
        if (ordersRes.data?.data) {
          const transformedOrders = ordersRes.data.data.map((order: any) => ({
            ...order,
            id: String(order.id),
            customer: {
              id: String(order.id),
              name: order.customerName,
              phone: order.customerPhone,
              email: order.customerEmail || undefined,
              createdAt: order.createdAt,
            },
            items: order.items?.map((item: any) => ({
              id: String(item.id),
              menuItemId: String(item.menuItemId || item.menuItem?.id || ''),
              name: item.itemNameSnapshot || item.menuItem?.name || 'Unknown',
              quantity: item.quantity,
              price: Number(item.unitPriceSnapshot || item.menuItem?.price || 0),
              notes: item.specialInstructions || undefined,
              specialInstructions: item.specialInstructions || undefined,
            })) || [],
            orderType: (order.orderType || 'PICKUP').toLowerCase(),
            deliveryAddress: order.deliveryAddress ? {
              street: order.deliveryAddress,
              city: '',
              postalCode: '',
              country: '',
              notes: order.locationNotes || undefined,
            } : undefined,
            subtotal: Number(order.subtotal || 0),
            deliveryFee: Number(order.deliveryFee || 0),
            tax: 0,
            total: Number(order.totalAmount || order.total || 0),
            status: normalizeOrderStatus(order.status),
            paymentStatus: normalizePaymentStatus(order.paymentStatus),
          }));
          setOrders(transformedOrders);
        }
        if (paymentsRes.data?.data) {
          const transformedPayments = paymentsRes.data.data.map((payment: any) => ({
            ...payment,
            orderId: String(payment.orderId),
            amount: Number(payment.expectedAmount || payment.amountPaid || 0),
            method: (payment.method || 'MOMO_MANUAL').toLowerCase(),
            status: (payment.status || 'WAITING_PAYMENT').toLowerCase(),
          }));
          setPayments(transformedPayments);
        }
        if (cateringRes.data?.data) {
          const transformedCatering = cateringRes.data.data.map((cat: any) => ({
            ...cat,
            id: String(cat.id),
            name: cat.customerName,
            phone: cat.phoneNumber,
            email: cat.email || undefined,
            eventType: cat.eventType,
            location: cat.eventLocation,
            date: cat.preferredDate ? new Date(cat.preferredDate).toISOString().split('T')[0] : cat.preferredDate,
            time: cat.preferredDate ? new Date(cat.preferredDate).toISOString().split('T')[1]?.substring(0,5) : '',
            guests: cat.guestCount,
            budget: cat.budgetRange ? Number(cat.budgetRange) : undefined,
            status: normalizeCateringStatus(cat.status),
            notes: cat.notes || undefined,
            requirements: cat.notes || undefined,
            followUpNotes: cat.notes || undefined,
          }));
          setCateringRequests(transformedCatering);
        }
        if (notificationsRes.data?.data) {
          const transformedNotifications = notificationsRes.data.data.map((notif: any) => ({
            ...notif,
            id: String(notif.id),
            message: notif.message || notif.messageSummary || notif.providerMessageId || 'Notification received',
            orderId: notif.orderId ? String(notif.orderId) : undefined,
            reservationId: notif.reservationId ? String(notif.reservationId) : undefined,
            cateringId: notif.cateringRequestId ? String(notif.cateringRequestId) : undefined,
            status: (notif.sentStatus || 'PENDING').toLowerCase(),
            sentAt: notif.sentAt || notif.createdAt || new Date().toISOString(),
          }));
          setNotifications(transformedNotifications);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const normalizeOrderStatus = useCallback((value?: string): Status => {
    const normalized = (value || 'PENDING').toUpperCase();
    const map: Record<string, Status> = {
      PENDING: 'new',
      PAYMENT_WAITING: 'new',
      PAYMENT_UNDER_REVIEW: 'confirmed',
      APPROVED: 'confirmed',
      CONFIRMED: 'confirmed',
      PREPARING: 'preparing',
      READY: 'ready',
      OUT_FOR_DELIVERY: 'out_for_delivery',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
    };
    return map[normalized] || 'new';
  }, []);

  const normalizePaymentStatus = useCallback((value?: string): PaymentStatus => {
    const normalized = (value || 'WAITING_PAYMENT').toUpperCase();
    const map: Record<string, PaymentStatus> = {
      NOT_REQUIRED: 'paid',
      WAITING_PAYMENT: 'pending',
      UNDER_REVIEW: 'pending',
      PARTIALLY_PAID: 'partial',
      PAID: 'paid',
      REJECTED: 'failed',
      FAILED: 'failed',
      CANCELLED: 'cancelled',
    };
    return map[normalized] || 'pending';
  }, []);

  const normalizeReservationStatus = useCallback((value?: string): ReservationStatus => {
    const normalized = (value || 'PENDING').toUpperCase();
    const map: Record<string, ReservationStatus> = {
      PENDING: 'pending',
      APPROVED: 'confirmed',
      REJECTED: 'cancelled',
      COMPLETED: 'confirmed',
      CANCELLED: 'cancelled',
    };
    return map[normalized] || 'pending';
  }, []);

  const normalizeCateringStatus = useCallback((value?: string): CateringStatus => {
    const normalized = (value || 'PENDING').toUpperCase();
    const map: Record<string, CateringStatus> = {
      PENDING: 'pending',
      REVIEWING: 'confirmed',
      APPROVED: 'confirmed',
      REJECTED: 'cancelled',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
    };
    return map[normalized] || 'pending';
  }, []);

  const mapReservationStatusToBackend = useCallback((value: ReservationStatus) => {
    const map: Record<ReservationStatus, string> = {
      pending: 'PENDING',
      confirmed: 'APPROVED',
      cancelled: 'CANCELLED',
      no_show: 'CANCELLED',
    };
    return map[value] || 'PENDING';
  }, []);

  const mapCateringStatusToBackend = useCallback((value: CateringStatus) => {
    const map: Record<CateringStatus, string> = {
      pending: 'PENDING',
      confirmed: 'APPROVED',
      in_progress: 'REVIEWING',
      completed: 'COMPLETED',
      cancelled: 'CANCELLED',
    };
    return map[value] || 'PENDING';
  }, []);

  // Save to localStorage helper
  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, []);

  // Admin Actions - declared first so it can be used by others
  const logAdminAction = useCallback((actionData: Omit<AdminActionLog, 'id' | 'timestamp'>) => {
    const newAction: AdminActionLog = {
      ...actionData,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setAdminActions(prev => {
      const updated = [newAction, ...prev];
      saveToStorage('mh_adminActions', updated);
      return updated;
    });
  }, [saveToStorage]);

  // Notifications - declared early
  const addNotification = useCallback((notificationData: Omit<NotificationLog, 'id' | 'sentAt'>) => {
    const newNotification: NotificationLog = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      saveToStorage('mh_notifications', updated);
      return updated;
    });
  }, [saveToStorage]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }));
      saveToStorage('mh_notifications', updated);
      return updated;
    });
  }, [saveToStorage]);

  const resendNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification) {
        const resentNotification: NotificationLog = {
          ...notification,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sentAt: new Date().toISOString(),
          status: 'sent',
        };
        const updated = [resentNotification, ...prev];
        saveToStorage('mh_notifications', updated);
        logAdminAction({
          action: 'Resend Notification',
          entityType: 'Notification',
          entityId: id,
          details: `Resent ${notification.type} notification`,
        });
        return updated;
      }
      return prev;
    });
  }, [saveToStorage, logAdminAction]);

  const sendCustomEmail = useCallback(async (orderId: string, message: string) => {
    try {
      const currentOrder = orders.find(order => String(order.id) === String(orderId));
      const response = await apiService.sendCustomEmail(parseInt(orderId, 10), message, currentOrder?.customer?.email);
      if (response.data?.data) {
        addNotification({
          phoneNumber: currentOrder?.customer?.email || '',
          type: 'order_update',
          message: message,
          status: 'sent',
          orderId,
        });
        logAdminAction({
          action: 'Send Email',
          entityType: 'Order',
          entityId: orderId,
          details: 'Custom email message sent for order',
        });
        return true;
      }
    } catch (error) {
      console.error('Error sending custom email:', error);
      addNotification({
        phoneNumber: '',
        type: 'order_update',
        message: message,
        status: 'failed',
        orderId,
      });
    }
    return false;
  }, [addNotification, logAdminAction, orders]);

  // Status History
  const addStatusHistory = useCallback((historyData: Omit<StatusHistory, 'id'>) => {
    const newHistory: StatusHistory = {
      ...historyData,
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setStatusHistory(prev => {
      const updated = [newHistory, ...prev];
      saveToStorage('mh_statusHistory', updated);
      return updated;
    });
  }, [saveToStorage]);

  // Orders
  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => {
      const updated = [...prev, newOrder];
      saveToStorage('mh_orders', updated);
      return updated;
    });
    logAdminAction({
      action: 'Create Order',
      entityType: 'Order',
      entityId: newOrder.id,
      details: `Order #${newOrder.orderNumber} created for ${newOrder.customer.name}`,
    });
    addNotification({
      phoneNumber: newOrder.customer.phone,
      type: 'new_order',
      message: `New order received from ${newOrder.customer.name}`,
      status: 'pending',
      orderId: newOrder.id,
    });
  }, [saveToStorage, logAdminAction, addNotification]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: Status) => {
    try {
      const currentOrder = orders.find(order => String(order.id) === String(orderId));
      const response = await apiService.updateOrderStatus(parseInt(orderId, 10), newStatus, undefined, undefined, currentOrder?.customer?.email);
      if (response.data?.data) {
        const updatedOrder = response.data.data;
        setOrders(prev => {
          const updated = prev.map(order => {
            if (String(order.id) === String(orderId)) {
              const oldStatus = order.status;
              const orderUpdate = {
                ...order,
                status: normalizeOrderStatus(updatedOrder.status || newStatus),
                updatedAt: new Date().toISOString(),
                ...(newStatus === 'completed' && { completedAt: new Date().toISOString() }),
              };
              addStatusHistory({
                orderId: String(order.id),
                previousStatus: oldStatus,
                newStatus,
                timestamp: new Date().toISOString(),
                notificationSent: false,
              });
              return orderUpdate;
            }
            return order;
          });
          saveToStorage('mh_orders', updated);
          return updated;
        });
        logAdminAction({
          action: 'Update Order Status',
          entityType: 'Order',
          entityId: orderId,
          details: `Status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating order status via API:', error);
    }
  }, [saveToStorage, addStatusHistory, logAdminAction, normalizeOrderStatus, orders]);

  const updateOrderPaymentStatus = useCallback(async (orderId: string, newStatus: PaymentStatus) => {
    try {
      const currentOrder = orders.find(order => String(order.id) === String(orderId));
      const response = await apiService.updateOrderStatus(parseInt(orderId, 10), undefined, undefined, newStatus, currentOrder?.customer?.email);
      if (response.data?.data) {
        setOrders(prev => {
          const updated = prev.map(order => {
            if (String(order.id) === String(orderId)) {
              return {
                ...order,
                paymentStatus: normalizePaymentStatus(newStatus),
                updatedAt: new Date().toISOString(),
              };
            }
            return order;
          });
          saveToStorage('mh_orders', updated);
          return updated;
        });
        logAdminAction({
          action: 'Update Payment Status',
          entityType: 'Order',
          entityId: orderId,
          details: `Payment status updated to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating payment status via API:', error);
    }
  }, [saveToStorage, logAdminAction, normalizePaymentStatus, orders]);

  const getOrderById = useCallback((id: string) => {
    return orders.find(o => o.id === id);
  }, [orders]);

  // Payments
  const addPayment = useCallback((paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPayments(prev => {
      const updated = [...prev, newPayment];
      saveToStorage('mh_payments', updated);
      return updated;
    });
  }, [saveToStorage]);

  const addPaymentRecord = useCallback((recordData: Omit<PaymentRecord, 'id' | 'createdAt'>) => {
    const newRecord: PaymentRecord = {
      ...recordData,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setPaymentRecords(prev => {
      const updated = [...prev, newRecord];
      saveToStorage('mh_paymentRecords', updated);
      return updated;
    });
  }, [saveToStorage]);

  // Reservations
  const addReservation = useCallback((reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReservations(prev => {
      const updated = [...prev, newReservation];
      saveToStorage('mh_reservations', updated);
      return updated;
    });
    logAdminAction({
      action: 'Create Reservation',
      entityType: 'Reservation',
      entityId: newReservation.id,
      details: `Reservation for ${newReservation.name} - ${newReservation.guests} guests`,
    });
    addNotification({
      phoneNumber: newReservation.phone,
      type: 'new_reservation',
      message: `New table booking from ${newReservation.name}`,
      status: 'pending',
      reservationId: newReservation.id,
    });
  }, [saveToStorage, logAdminAction, addNotification]);

  const updateReservationStatus = useCallback(async (id: string, newStatus: ReservationStatus) => {
    const backendStatus = mapReservationStatusToBackend(newStatus);
    try {
      const existingReservation = reservations.find((reservation) => String(reservation.id) === String(id));
      const response = await apiService.updateReservationStatus(
        parseInt(id, 10),
        backendStatus,
        existingReservation?.email
      );
      if (response.data?.data) {
        const updatedReservation = response.data.data;
        setReservations(prev => {
          const updated = prev.map(reservation => {
            if (String(reservation.id) === String(id)) {
              const updatedRes = {
                ...reservation,
                status: normalizeReservationStatus(updatedReservation.status || backendStatus),
                updatedAt: new Date().toISOString(),
              };
              addNotification({
                phoneNumber: reservation.phone,
                type: 'reservation_update',
                message: `Your reservation for ${reservation.date} at ${reservation.time} has been ${newStatus}`,
                status: 'pending',
                reservationId: String(reservation.id),
              });
              logAdminAction({
                action: 'Update Reservation Status',
                entityType: 'Reservation',
                entityId: String(id),
                details: `Status changed to ${newStatus}`,
              });
              return updatedRes;
            }
            return reservation;
          });
          saveToStorage('mh_reservations', updated);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error updating reservation status via API:', error);
    }
  }, [saveToStorage, addNotification, logAdminAction, normalizeReservationStatus, reservations]);

  // Catering Requests
  const addCateringRequest = useCallback((requestData: Omit<CateringRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: CateringRequest = {
      ...requestData,
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCateringRequests(prev => {
      const updated = [...prev, newRequest];
      saveToStorage('mh_catering', updated);
      return updated;
    });
    logAdminAction({
      action: 'Create Catering Request',
      entityType: 'Catering',
      entityId: newRequest.id,
      details: `Catering request for ${newRequest.eventType} - ${newRequest.guests} guests`,
    });
    addNotification({
      phoneNumber: newRequest.phone,
      type: 'new_catering',
      message: `New catering request from ${newRequest.name}`,
      status: 'pending',
      cateringId: newRequest.id,
    });
  }, [saveToStorage, logAdminAction, addNotification]);

  const updateCateringStatus = useCallback(async (id: string, newStatus: CateringStatus) => {
    const backendStatus = mapCateringStatusToBackend(newStatus);
    try {
      const existingRequest = cateringRequests.find((request) => String(request.id) === String(id));
      const response = await apiService.updateCateringStatus(
        parseInt(id, 10),
        backendStatus,
        existingRequest?.email
      );
      if (response.data?.data) {
        const updatedRequest = response.data.data;
        setCateringRequests(prev => {
          const updated = prev.map(request => {
            if (String(request.id) === String(id)) {
              const updatedReq = {
                ...request,
                status: normalizeCateringStatus(updatedRequest.status || backendStatus),
                updatedAt: new Date().toISOString(),
              };
              addNotification({
                phoneNumber: request.phone,
                type: 'catering_update',
                message: `Your catering request for ${request.eventType} has been ${newStatus}`,
                status: 'pending',
                cateringId: String(request.id),
              });
              logAdminAction({
                action: 'Update Catering Status',
                entityType: 'Catering',
                entityId: String(id),
                details: `Status changed to ${newStatus}`,
              });
              return updatedReq;
            }
            return request;
          });
          saveToStorage('mh_catering', updated);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error updating catering status via API:', error);
    }
  }, [saveToStorage, addNotification, logAdminAction, normalizeCateringStatus, cateringRequests]);

  // Menu
  const addMenuItem = useCallback(async (itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => {
    try {
      // Transform frontend data to match backend schema and generate slug from name
      const backendData = {
        name: itemData.name,
        slug: itemData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        categoryId: Number(itemData.categoryId),
        shortDescription: itemData.shortDescription || undefined,
        description: itemData.description || undefined,
        productType: itemData.productType || 'FOOD',
        price: Number(itemData.price),
        imageUrl: itemData.image || undefined,
        images: itemData.images || [],
      };
      const response = await apiService.createMenuItem(backendData);
      const newItem = {
        ...response.data.data,
        image: response.data.data.imageUrl,
        images: response.data.data.images || [],
        shortDescription: response.data.data.shortDescription || undefined,
        productType: response.data.data.productType || 'FOOD',
      };
      setMenuItems(prev => {
        const updated = [...prev, newItem];
        saveToStorage('mh_menuItems', updated);
        return updated;
      });
      logAdminAction({
        action: 'Add Menu Item',
        entityType: 'MenuItem',
        entityId: newItem.id,
        details: `Added ${newItem.name} to ${menuCategories.find(c => c.id === newItem.categoryId)?.name}`,
      });
      addNotification({
        phoneNumber: '',
        type: 'new_menu_item',
        message: `New menu item added: ${newItem.name}`,
        status: 'sent',
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  }, [menuCategories, saveToStorage, logAdminAction, addNotification]);

  const updateMenuItem = useCallback(async (id: string, updates: Partial<MenuItem>) => {
    try {
      // Transform frontend data to match backend schema
      const backendData: any = {};
      if (updates.name !== undefined) {
        backendData.name = updates.name;
      }
      if (updates.shortDescription !== undefined) {
        backendData.shortDescription = updates.shortDescription;
      }
      if (updates.description !== undefined) {
        backendData.description = updates.description;
      }
      if (updates.productType !== undefined) {
        backendData.productType = updates.productType;
      }
      if (updates.price !== undefined) {
        backendData.price = Number(updates.price);
      }
      if (updates.image !== undefined) {
        backendData.imageUrl = updates.image;
        if (!updates.image) {
          backendData.imagePublicId = null;
        }
      }
      if (updates.images !== undefined) {
        backendData.images = updates.images;
      }
      if (updates.categoryId !== undefined) {
        backendData.categoryId = Number(updates.categoryId);
      }
      if (updates.isAvailable !== undefined) {
        backendData.isAvailable = updates.isAvailable;
      }
      if (updates.isFeatured !== undefined) {
        backendData.isFeatured = updates.isFeatured;
      }
      const response = await apiService.updateMenuItem(parseInt(id), backendData);
      const updatedItem = {
        ...response.data.data,
        image: response.data.data.imageUrl,
        images: response.data.data.images || [],
        shortDescription: response.data.data.shortDescription || undefined,
        productType: response.data.data.productType || 'FOOD',
      };
      setMenuItems(prev => {
        const updated = prev.map(item => item.id === Number(id) ? updatedItem : item);
        saveToStorage('mh_menuItems', updated);
        return updated;
      });
      logAdminAction({
        action: 'Update Menu Item',
        entityType: 'MenuItem',
        entityId: id,
        details: `Updated ${updatedItem.name}`,
      });
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  }, [saveToStorage, logAdminAction]);

  const deleteMenuItem = useCallback(async (id: string) => {
    try {
      await apiService.deleteMenuItem(parseInt(id));
      setMenuItems(prev => {
        const updated = prev.filter(item => item.id !== Number(id));
        saveToStorage('mh_menuItems', updated);
        logAdminAction({
          action: 'Delete Menu Item',
          entityType: 'MenuItem',
          entityId: id,
          details: 'Menu item deleted',
        });
        return updated;
      });
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  }, [saveToStorage, logAdminAction]);

  const addMenuCategory = useCallback(async (categoryData: Omit<MenuCategory, 'id' | 'createdAt'>) => {
    try {
      // Transform frontend data to match backend schema
      const backendData = {
        name: categoryData.name,
        slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: categoryData.description,
        type: categoryData.type || 'FOOD',
        displayOrder: categoryData.order,
        isActive: categoryData.isActive,
      };
      const response = await apiService.createCategory(backendData);
      const newCategory = response.data.data;
      // Transform backend response to frontend format (displayOrder -> order)
      const transformedCategory = {
        ...newCategory,
        order: newCategory.displayOrder,
      };
      setMenuCategories(prev => {
        const updated = [...prev, transformedCategory];
        saveToStorage('mh_menuCategories', updated);
        return updated;
      });
      logAdminAction({
        action: 'Add Menu Category',
        entityType: 'MenuCategory',
        entityId: transformedCategory.id,
        details: `Added category: ${transformedCategory.name}`,
      });
      addNotification({
        phoneNumber: '',
        type: 'new_category',
        message: `New category created: ${transformedCategory.name}`,
        status: 'sent',
      });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  }, [saveToStorage, logAdminAction, addNotification]);

  const updateCategory = useCallback(async (id: string, updates: Partial<MenuCategory>) => {
    try {
      // Transform frontend data to match backend schema
      const backendData: any = {};
      if (updates.name) {
        backendData.name = updates.name;
        backendData.slug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      if (updates.description !== undefined) {
        backendData.description = updates.description;
      }
      if (updates.type) {
        backendData.type = updates.type;
      }
      if (updates.order !== undefined) {
        backendData.displayOrder = updates.order;
      }
      if (updates.isActive !== undefined) {
        backendData.isActive = updates.isActive;
      }
      const response = await apiService.updateCategory(parseInt(id), backendData);
      const updatedCategory = response.data.data;
      // Transform backend response to frontend format (displayOrder -> order)
      const transformedCategory = {
        ...updatedCategory,
        order: updatedCategory.displayOrder,
      };
      setMenuCategories(prev => {
        const updated = prev.map(category => category.id === id ? transformedCategory : category);
        saveToStorage('mh_menuCategories', updated);
        return updated;
      });
      logAdminAction({
        action: 'Update Menu Category',
        entityType: 'MenuCategory',
        entityId: id,
        details: `Updated category: ${updates.name || id}`,
      });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  }, [saveToStorage, logAdminAction]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      const category = menuCategories.find(c => c.id === id);
      await apiService.deleteCategory(parseInt(id));
      setMenuCategories(prev => {
        const updated = prev.filter(c => c.id !== id);
        saveToStorage('mh_menuCategories', updated);
        logAdminAction({
          action: 'Delete Menu Category',
          entityType: 'MenuCategory',
          entityId: id,
          details: `Deleted category: ${category?.name || id}`,
        });
        return updated;
      });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }, [menuCategories, saveToStorage, logAdminAction]);

  // Content Management
  const updateContentBlock = useCallback((id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(prev => {
      const updated = prev.map(block => {
        if (block.id === id) {
          return {
            ...block,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return block;
      });
      saveToStorage('mh_contentBlocks', updated);
      return updated;
    });
  }, [saveToStorage]);

  // Promo Banners
  const updatePromoBanner = useCallback((id: string, updates: Partial<PromoBanner>) => {
    setPromoBanners(prev => {
      const updated = prev.map(banner => {
        if (banner.id === id) {
          return {
            ...banner,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return banner;
      });
      saveToStorage('mh_promoBanners', updated);
      return updated;
    });
  }, [saveToStorage]);

  // Dashboard Metrics
  const getDashboardMetrics = useCallback((): DashboardMetrics => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const ordersByStatus: Record<Status, number> = {
      new: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      out_for_delivery: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      ordersByStatus[order.status]++;
    });

    const paymentSummary: Record<PaymentStatus, number> = {
      pending: 0,
      partial: 0,
      paid: 0,
      failed: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      paymentSummary[order.paymentStatus]++;
    });

    // Calculate popular items
    const itemCount: Record<string, { name: string; count: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCount[item.name]) {
          itemCount[item.name] = { name: item.name, count: 0 };
        }
        itemCount[item.name].count += item.quantity;
      });
    });

    const popularItems = Object.values(itemCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue by day for last 7 days
    const revenueByDay: Array<{ date: string; amount: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr && order.status === 'completed';
        })
        .reduce((sum, order) => sum + order.total, 0);
      revenueByDay.push({ date: dateStr, amount: Math.round(dayRevenue) });
    }

    return {
      totalOrders: orders.length,
      ordersByStatus,
      totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0),
      paymentSummary,
      totalReservations: reservations.length,
      totalCateringRequests: cateringRequests.length,
      popularItems,
      recentOrders: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10),
      revenueByDay,
    };
  }, [orders, reservations, cateringRequests]);

  // Reports
  const generateReport = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const reportOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    const ordersByStatus: Record<Status, number> = {
      new: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      out_for_delivery: 0,
      completed: 0,
      cancelled: 0,
    };

    const paymentBreakdown: Record<PaymentStatus, number> = {
      pending: 0,
      partial: 0,
      paid: 0,
      failed: 0,
      cancelled: 0,
    };

    const itemCount: Record<string, { name: string; count: number; revenue: number }> = {};

    reportOrders.forEach(order => {
      ordersByStatus[order.status]++;
      paymentBreakdown[order.paymentStatus]++;
      order.items.forEach(item => {
        if (!itemCount[item.name]) {
          itemCount[item.name] = { name: item.name, count: 0, revenue: 0 };
        }
        itemCount[item.name].count += item.quantity;
        itemCount[item.name].revenue += item.price * item.quantity;
      });
    });

    const popularItems = Object.values(itemCount)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const totalRevenue = reportOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
    const reservationsCount = reservations.filter(r => {
      const resDate = new Date(r.createdAt);
      return resDate >= start && resDate <= end;
    }).length;
    const cateringRequestsCount = cateringRequests.filter(c => {
      const catDate = new Date(c.createdAt);
      return catDate >= start && catDate <= end;
    }).length;

    const report: any = {
      period: { start: startDate, end: endDate },
      totalRevenue,
      totalOrders: reportOrders.length,
      ordersByStatus,
      paymentBreakdown,
      popularItems,
      reservationsCount,
      cateringRequestsCount,
      averageOrderValue: reportOrders.length > 0 ? Math.round(totalRevenue / reportOrders.length) : 0,
    };

    return report;
  }, [orders, reservations, cateringRequests]);

  return (
    <AdminContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        getOrderById,
        payments,
        paymentRecords,
        addPayment,
        addPaymentRecord,
        statusHistory,
        addStatusHistory,
        reservations,
        addReservation,
        updateReservationStatus,
        cateringRequests,
        addCateringRequest,
        updateCateringStatus,
        menuItems,
        menuCategories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addMenuCategory,
        updateCategory,
        deleteCategory,
        notifications,
        addNotification,
        resendNotification,
        markAllNotificationsRead,
        sendCustomEmail,
        adminActions,
        logAdminAction,
        contentBlocks,
        updateContentBlock,
        promoBanners,
        updatePromoBanner,
        getDashboardMetrics,
        generateReport,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
