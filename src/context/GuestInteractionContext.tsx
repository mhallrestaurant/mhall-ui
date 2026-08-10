import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderItem, OrderType, GuestPaymentSelection } from '../types';

interface CartItem extends OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isPromotionOffer?: boolean;
}

interface CheckoutFormData {
  // Step 1-2: Review Order (auto-filled from cart)
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  
  // Step 3: Order Type
  orderType: OrderType;
  
  // Step 4: Customer Info
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  
  // Step 5: Delivery Details (conditional)
  deliveryAddress: string;
  deliveryNotes: string;
  
  // Step 6: Extra Notes
  specialInstructions: string;
  preferredTime: string;
  
  // Step 7: Payment
  paymentMethod: GuestPaymentSelection;
}

interface ReservationFormData {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
}

interface CateringFormData {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventLocation: string;
  guests: number;
  preferredDate: string;
  notes: string;
}

interface EventFormData {
  name: string;
  phone: string;
  eventType: string;
  guests: number;
  eventDate: string;
  eventLocation: string;
  notes: string;
}

interface SuccessModalData {
  type: 'order' | 'reservation' | 'catering' | 'event';
  orderId?: string;
  title: string;
  message: string;
  momoNumber?: string;
  bankAccount?: string;
  showPaymentInfo?: boolean;
  hasPromotionOffer?: boolean;
}

interface GuestInteractionContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Quick Checkout (add item and open checkout in one operation)
  quickCheckout: (item: CartItem) => void;
  
  // Checkout Modal
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  checkoutData: CheckoutFormData;
  updateCheckoutData: (data: Partial<CheckoutFormData>) => void;
  resetCheckoutData: () => void;
  
  // Reservation Modal
  isReservationOpen: boolean;
  openReservation: () => void;
  closeReservation: () => void;
  reservationData: ReservationFormData;
  updateReservationData: (data: Partial<ReservationFormData>) => void;
  resetReservationData: () => void;
  
  // Catering Modal
  isCateringOpen: boolean;
  openCatering: () => void;
  closeCatering: () => void;
  cateringData: CateringFormData;
  updateCateringData: (data: Partial<CateringFormData>) => void;
  resetCateringData: () => void;
  
  // Event Modal
  isEventOpen: boolean;
  openEvent: () => void;
  closeEvent: () => void;
  eventData: EventFormData;
  updateEventData: (data: Partial<EventFormData>) => void;
  resetEventData: () => void;
  
  // Success Modal
  isSuccessOpen: boolean;
  successData: SuccessModalData | null;
  showSuccess: (data: SuccessModalData) => void;
  closeSuccess: () => void;
}

const defaultCheckoutData: CheckoutFormData = {
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  total: 0,
  orderType: 'delivery',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  deliveryAddress: '',
  deliveryNotes: '',
  specialInstructions: '',
  preferredTime: '',
  paymentMethod: 'paid',
};

const defaultReservationData: ReservationFormData = {
  name: '',
  phone: '',
  email: '',
  date: new Date().toISOString().split('T')[0],
  time: '18:00',
  guests: 2,
  notes: '',
};

const defaultCateringData: CateringFormData = {
  name: '',
  phone: '',
  email: '',
  eventType: '',
  eventLocation: '',
  guests: 50,
  preferredDate: '',
  notes: '',
};

const defaultEventData: EventFormData = {
  name: '',
  phone: '',
  eventType: '',
  guests: 50,
  eventDate: '',
  eventLocation: '',
  notes: '',
};

const GuestInteractionContext = createContext<GuestInteractionContextType | undefined>(undefined);

export const useGuestInteraction = () => {
  const context = useContext(GuestInteractionContext);
  if (!context) {
    throw new Error('useGuestInteraction must be used within GuestInteractionProvider');
  }
  return context;
};

interface GuestInteractionProviderProps {
  children: ReactNode;
}

export const GuestInteractionProvider: React.FC<GuestInteractionProviderProps> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutFormData>(defaultCheckoutData);
  
  // Reservation state
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationFormData>(defaultReservationData);
  
  // Catering state
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [cateringData, setCateringData] = useState<CateringFormData>(defaultCateringData);
  
  // Event state
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [eventData, setEventData] = useState<EventFormData>(defaultEventData);
  
  // Success state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState<SuccessModalData | null>(null);
  
  // Cart functions
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };
  
  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };
  
  const clearCart = () => setCart([]);
  
  // Quick Checkout function - clears cart, adds only this item and opens checkout
  const quickCheckout = (item: CartItem) => {
    const newCart = [item]; // Only the selected item, ignore existing cart
    const subtotal = item.price * item.quantity;
    const deliveryFee = 0;
    setCart(newCart);
    setCheckoutData({
      ...defaultCheckoutData,
      items: newCart,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    });
    setIsCheckoutOpen(true);
  };
  
  // Checkout functions
  const openCheckout = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 0; // Will be calculated based on order type
    setCheckoutData({
      ...defaultCheckoutData,
      items: [...cart],
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    });
    setIsCheckoutOpen(true);
  };
  
  const closeCheckout = () => setIsCheckoutOpen(false);
  
  const updateCheckoutData = (data: Partial<CheckoutFormData>) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
  };
  
  const resetCheckoutData = () => setCheckoutData(defaultCheckoutData);
  
  // Reservation functions
  const openReservation = () => setIsReservationOpen(true);
  const closeReservation = () => setIsReservationOpen(false);
  
  const updateReservationData = (data: Partial<ReservationFormData>) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };
  
  const resetReservationData = () => setReservationData(defaultReservationData);
  
  // Catering functions
  const openCatering = () => setIsCateringOpen(true);
  const closeCatering = () => setIsCateringOpen(false);
  
  const updateCateringData = (data: Partial<CateringFormData>) => {
    setCateringData(prev => ({ ...prev, ...data }));
  };
  
  const resetCateringData = () => setCateringData(defaultCateringData);
  
  // Event functions
  const openEvent = () => setIsEventOpen(true);
  const closeEvent = () => setIsEventOpen(false);
  
  const updateEventData = (data: Partial<EventFormData>) => {
    setEventData(prev => ({ ...prev, ...data }));
  };
  
  const resetEventData = () => setEventData(defaultEventData);
  
  // Success modal functions
  const showSuccess = (data: SuccessModalData) => {
    setSuccessData(data);
    setIsSuccessOpen(true);
  };
  
  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessData(null);
  };
  
  return (
    <GuestInteractionContext.Provider
      value={{
        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        // Quick checkout
        quickCheckout,
        // Checkout
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        checkoutData,
        updateCheckoutData,
        resetCheckoutData,
        // Reservation
        isReservationOpen,
        openReservation,
        closeReservation,
        reservationData,
        updateReservationData,
        resetReservationData,
        // Catering
        isCateringOpen,
        openCatering,
        closeCatering,
        cateringData,
        updateCateringData,
        resetCateringData,
        // Event
        isEventOpen,
        openEvent,
        closeEvent,
        eventData,
        updateEventData,
        resetEventData,
        // Success
        isSuccessOpen,
        successData,
        showSuccess,
        closeSuccess,
      }}
    >
      {children}
    </GuestInteractionContext.Provider>
  );
};
