import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuestInteraction } from '../../context/GuestInteractionContext';
import { OrderType, GuestPaymentSelection } from '../../types';
import apiService from '../../services/api';

const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    checkoutData, 
    updateCheckoutData,
    resetCheckoutData,
    clearCart,
    showSuccess
  } = useGuestInteraction();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset step when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setCurrentStep(1);
      setErrors({});
    }
  }, [isCheckoutOpen]);
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 3) {
      if (!checkoutData.customerName.trim()) {
        newErrors.customerName = 'Name is required';
      }
      if (!checkoutData.customerPhone.trim()) {
        newErrors.customerPhone = 'Phone number is required';
      } else if (!/^[\+]?([\d\s\-\(\)]){10,}$/.test(checkoutData.customerPhone)) {
        newErrors.customerPhone = 'Please enter a valid phone number';
      }
      if (checkoutData.customerEmail.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(checkoutData.customerEmail.trim())) {
          newErrors.customerEmail = 'Please enter a valid email address';
        }
      }
    }
    
    if (step === 4 && checkoutData.orderType === 'delivery') {
      if (!checkoutData.deliveryAddress.trim()) {
        newErrors.deliveryAddress = 'Delivery address is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 8));
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = checkoutData.items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0);
    
    const subtotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = checkoutData.orderType === 'delivery' ? 2000 : 0;
    const total = subtotal + deliveryFee;
    
    updateCheckoutData({ 
      items: updatedItems,
      subtotal,
      deliveryFee,
      total
    });
  };
  
    const handleSubmit = async () => {
      if (!validateStep(3) || (checkoutData.orderType === 'delivery' && !validateStep(4))) {
        return;
      }
      
      setIsSubmitting(true);
      
      // Compute payment message
      const isPartial = checkoutData.paymentMethod === 'partial';
      const amountToPay = isPartial ? checkoutData.total / 2 : checkoutData.total;
      const paymentMessage = isPartial 
        ? `Your package will start being prepared. Please pay the half of your full payment (${amountToPay.toLocaleString()} RWF). We'll send updates to your email.`
        : `Your package will start being prepared. Please pay ${amountToPay.toLocaleString()} RWF. We'll send updates to your email.`;
      
      // Prepare guest order data
      const guestOrderData = {
        customerName: checkoutData.customerName,
        customerPhone: checkoutData.customerPhone,
        customerEmail: checkoutData.customerEmail.trim() || undefined,
        deliveryAddress: checkoutData.orderType === 'delivery' ? checkoutData.deliveryAddress : undefined,
        locationNotes: checkoutData.orderType === 'delivery' ? checkoutData.deliveryNotes : undefined,
        orderType: checkoutData.orderType,
        paymentSelection: checkoutData.paymentMethod === 'partial' ? 'partial' : 'paid',
        items: checkoutData.items.map(item => ({
          menuItemId: Number(item.menuItemId),
          quantity: item.quantity,
          notes: item.notes,
        })),
        notes: checkoutData.specialInstructions,
      };
      
      try {
        const response = await apiService.createGuestOrder(guestOrderData);
        const createdOrder = response.data?.data || response.data;
        const orderNumber = createdOrder?.orderNumber;

        if (!orderNumber) {
          throw new Error('Order creation failed; response missing order number');
        }

        showSuccess({
          type: 'order',
          orderId: orderNumber,
          title: 'Order received',
          message: paymentMessage,
          momoNumber: '*182*1*1*0783700979#',
          bankAccount: 'BK-100218626526',
          showPaymentInfo: true,
          hasPromotionOffer: checkoutData.items.some(item => item.isPromotionOffer),
        });

        clearCart();
        resetCheckoutData();
        closeCheckout();
      } catch (error) {
        console.error('Error submitting guest order:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Unable to place your order right now. Please try again or contact support.',
        }));
      } finally {
        setIsSubmitting(false);
      }
    };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Order Summary</h3>
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-100">
              {checkoutData.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 p-3 border-b last:border-b-0">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        {item.isPromotionOffer && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            Promotion Offer
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{item.notes || 'No notes'}</p>
                    </div>
                    <p className="font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()} RWF</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        disabled={item.quantity <= 1 || isSubmitting}
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-[#BF2201] hover:bg-[#A01B00] flex items-center justify-center transition-colors"
                        disabled={isSubmitting}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">{item.price.toLocaleString()} RWF each</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{checkoutData.subtotal.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Delivery Fee</span>
                <span>{checkoutData.deliveryFee.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between items-end mt-3">
                <div>
                  <div className="text-xs text-gray-500">Estimated total</div>
                  <div className="text-2xl font-extrabold text-gray-900">{checkoutData.total.toLocaleString()} RWF</div>
                </div>
                <div className="text-sm text-green-700 font-semibold">Secure • Trusted</div>
              </div>
            </div>
          </div>
        );
       
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Choose Order Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateCheckoutData({ orderType: 'delivery' })}
                className={`p-4 rounded-3xl border transition-all bg-white shadow-sm ${
                  checkoutData.orderType === 'delivery'
                    ? 'border-[#BF2201] shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2ED]">
                    <svg className="w-6 h-6 text-[#BF2201]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9h13" />
                      <path d="M16 5h5v8h-5" />
                      <path d="M5 13v5" />
                      <path d="M19 13v5" />
                      <path d="M5 18h2" />
                      <path d="M17 18h2" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900">Delivery</p>
                </div>
              </button>
              <button
                onClick={() => updateCheckoutData({ orderType: 'pickup' })}
                className={`p-4 rounded-3xl border transition-all bg-white shadow-sm ${
                  checkoutData.orderType === 'pickup'
                    ? 'border-[#BF2201] shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F4F6]">
                    <svg className="w-6 h-6 text-[#1F8A70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22V12" />
                      <path d="M16 18l-4 4-4-4" />
                      <path d="M12 2a6 6 0 100 12 6 6 0 000-12z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900">Pickup</p>
                </div>
              </button>
            </div>
          </div>
        );
       
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Contact Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={checkoutData.customerName}
                  onChange={(e) => updateCheckoutData({ customerName: e.target.value })}
                  className={`w-full px-4 py-3 bg-white border ${errors.customerName ? 'border-red-500' : 'border-gray-200'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD6C1]`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  value={checkoutData.customerPhone}
                  onChange={(e) => updateCheckoutData({ customerPhone: e.target.value })}
                  className={`w-full px-4 py-3 bg-white border ${errors.customerPhone ? 'border-red-500' : 'border-gray-200'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD6C1]`}
                  placeholder="+250 XXX XXX XXX"
                />
                {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={checkoutData.customerEmail}
                  onChange={(e) => updateCheckoutData({ customerEmail: e.target.value })}
                  className={`w-full px-4 py-3 bg-white border ${errors.customerEmail ? 'border-red-500' : 'border-gray-200'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD6C1]`}
                  placeholder="you@example.com"
                />
                {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
              </div>
            </div>
          </div>
        );
       
      case 4:
        return checkoutData.orderType === 'delivery' ? (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Delivery Address</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <textarea
                  value={checkoutData.deliveryAddress}
                  onChange={(e) => updateCheckoutData({ deliveryAddress: e.target.value })}
                  className={`w-full px-4 py-3 bg-white border ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-200'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD6C1]`}
                  placeholder="Enter your delivery address"
                  rows={3}
                />
                {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
                <textarea
                  value={checkoutData.deliveryNotes}
                  onChange={(e) => updateCheckoutData({ deliveryNotes: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD6C1]"
                  placeholder="Landmark, directions, etc."
                  rows={2}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Pickup Details</h3>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                Pickup time is set by the restaurant based on preparation and kitchen availability.
                We will notify you when your order is ready to be collected.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                If you have a preferred collection window, include it under special instructions.
              </p>
            </div>
          </div>
        );
       
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Special Instructions</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Preferences & Notes</label>
              <textarea
                value={checkoutData.specialInstructions}
                onChange={(e) => updateCheckoutData({ specialInstructions: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD6C1]"
                placeholder="Any special requests, allergies, or preferences..."
                rows={4}
              />
            </div>
          </div>
        );
       
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Payment</h3>
            <div className="space-y-3">
              {[
                {
                  value: 'partial' as GuestPaymentSelection,
                  label: 'Partial Payment (50%)',
                  desc: 'Pay half now, rest on delivery',
                  icon: (
                    <svg className="w-6 h-6 text-[#BF2201]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="7" width="18" height="12" rx="2" ry="2" />
                      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                      <path d="M3 13h18" />
                    </svg>
                  ),
                },

                {
                  value: 'paid' as GuestPaymentSelection,
                  label: 'Full Payment',
                  desc: 'Pay full amount now',
                  icon: (
                    <svg className="w-6 h-6 text-[#1F8A70]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ),
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateCheckoutData({ paymentMethod: option.value })}
                  className={`w-full p-4 rounded-3xl border transition-all text-left bg-white shadow-sm ${
                    checkoutData.paymentMethod === option.value
                      ? 'ring-2 ring-[#FFD6C1] border-[#BF2201] shadow-md'
                      : 'border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2ED]">
                        {option.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.desc}</div>
                      </div>
                    </div>
                    {checkoutData.paymentMethod === option.value && (
                      <div className="text-sm font-semibold text-[#BF2201]">Selected</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Confirm Order</h3>
            <div className="max-h-80 overflow-y-auto space-y-3">
              {checkoutData.items.map((item) => {
                const nameLower = item.name.toLowerCase();
                let itemImage = '/food.png';

                if (nameLower.includes('pizza')) itemImage = '/pizza.png';
                else if (nameLower.includes('burger')) itemImage = '/burger.png';
                else if (nameLower.includes('salmon') || nameLower.includes('fish') || nameLower.includes('tilapia')) itemImage = '/food.png';
                else if (nameLower.includes('cake') || nameLower.includes('dessert')) itemImage = '/food.png';
                else if (nameLower.includes('brochette') || nameLower.includes('meat')) itemImage = '/burger.png';
                else if (nameLower.includes('ugali') || nameLower.includes('mandazi') || nameLower.includes('sambaza')) itemImage = '/food.png';

                return (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-white p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/food.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.notes || 'No special notes'}</p>
                      <p className="text-sm font-semibold text-[#BF2201]">{item.price.toLocaleString()} RWF each</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {item.isPromotionOffer && (
                        <span className="text-xs font-semibold text-red-700">Promotion Item</span>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          disabled={isSubmitting}
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[#BF2201] hover:bg-[#A01B00] flex items-center justify-center transition-colors"
                          disabled={isSubmitting}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3">
              <div className="rounded-lg p-3 bg-gray-50 border border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{checkoutData.subtotal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Delivery Fee</span>
                  <span className="font-medium">{checkoutData.deliveryFee.toLocaleString()} RWF</span>
                </div>
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Payable total</div>
                      <div className="text-2xl font-extrabold text-gray-900">{checkoutData.total.toLocaleString()} RWF</div>
                    </div>
                    <div className="text-sm text-green-700 font-semibold">Trusted • Encrypted</div>
                  </div>
                  {checkoutData.items.some((item) => item.isPromotionOffer) && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
                      Promotional Offer Included
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  const getStepTitle = () => {
    const titles = [
      '',
      'Review Order',
      'Order Type',
      'Your Information',
      checkoutData.orderType === 'delivery' ? 'Delivery Details' : 'Pickup Time',
      'Special Instructions',
      'Payment',
      'Confirm',
    ];
    return titles[currentStep] || '';
  };
  
  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={!isSubmitting ? closeCheckout : undefined}
          >
            {/* Modal - Bottom sheet on mobile, centered on desktop */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full md:max-w-lg md:rounded-2xl md:max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">{getStepTitle()}</h2>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1C6.48 1 2 5.48 2 11c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-1 15l-5-5 1.41-1.41L11 13.17l6.59-6.59L19 8l-8 8z" fill="currentColor" />
                      </svg>
                      <span>Secure checkout — payments & order tracking</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeCheckout}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress indicator */}
              <div className="px-4 py-2">
                <div className="flex gap-2 items-center">
                  <div className="flex-1 h-1 rounded-full bg-gray-100">
                    <div className={`h-1 rounded-full bg-gradient-to-r from-[#FFB399] to-[#BF2201]`} style={{ width: `${(currentStep - 1) / 6 * 100}%` }} />
                  </div>
                  <div className="text-xs text-gray-500">Step {currentStep}/7</div>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {renderStep()}
              </div>
              
              {/* Footer - Sticky button */}
              <div className="p-4 border-t bg-white">
                <div className="mb-3 text-sm text-gray-500 text-center">We will send payment instructions via WhatsApp after ordering.</div>
                {errors.submit && (
                  <div className="mb-3 text-sm text-red-600 text-center">
                    {errors.submit}
                  </div>
                )}
                {currentStep < 7 ? (
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="w-full bg-[#BF2201] hover:bg-[#A01B00] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50 shadow-md"
                  >
                    Continue
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#FF7B4B] to-[#BF2201] hover:from-[#FF8B5B] hover:to-[#A01B00] text-white font-semibold py-3 rounded-full transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl transform-gpu"
                    >
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1C7.03 1 3 5.03 3 10v3H2a1 1 0 000 2h20a1 1 0 000-2h-1v-3c0-4.97-4.03-9-9-9zm-1 14H8v-2h3v2zm4 0h-3v-2h3v2z" fill="currentColor" />
                      </svg>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                    <div className="mt-2 text-center text-xs text-gray-500">Secure payment — no card data is stored here.</div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;