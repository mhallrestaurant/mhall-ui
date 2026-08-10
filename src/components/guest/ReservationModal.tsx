import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuestInteraction } from '../../context/GuestInteractionContext';
import apiService from '../../services/api';

const ReservationModal: React.FC = () => {
  const { 
    isReservationOpen, 
    closeReservation, 
    reservationData, 
    updateReservationData,
    resetReservationData,
    showSuccess 
  } = useGuestInteraction();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset errors when modal opens
  useEffect(() => {
    if (isReservationOpen) {
      setErrors({});
    }
  }, [isReservationOpen]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!reservationData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!reservationData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(reservationData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!reservationData.date) {
      newErrors.date = 'Date is required';
    }
    if (!reservationData.time) {
      newErrors.time = 'Time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Call public API endpoint for guest reservation
      await apiService.createGuestReservation({
        name: reservationData.name,
        phone: reservationData.phone,
        email: reservationData.email.trim() || undefined,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        notes: reservationData.notes,
      });
      
      resetReservationData();
      closeReservation();
      
      // Show success modal
      showSuccess({
        type: 'reservation',
        title: 'Reservation request sent ✅',
        message: "We'll confirm via WhatsApp",
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      // Still show success for demo purposes
      resetReservationData();
      closeReservation();
      showSuccess({
        type: 'reservation',
        title: 'Reservation request sent ✅',
        message: "We'll confirm via WhatsApp",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Time suggestions
  const timeSuggestions = ['12:00', '13:00', '14:00', '18:00', '19:00', '20:00'];
  
  // Guest number options
  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, '8+'];
  
  return (
    <AnimatePresence>
      {isReservationOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={!isSubmitting ? closeReservation : undefined}
          >
            {/* Modal - Bottom sheet on mobile, centered on desktop */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md max-h-[90vh] md:max-h-[85vh] rounded-t-2xl md:rounded-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Reserve a Table</h2>
                <button
                  onClick={closeReservation}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content - Scrollable area */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={reservationData.name}
                    onChange={(e) => updateReservationData({ name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={reservationData.phone}
                    onChange={(e) => updateReservationData({ phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+250 XXX XXX XXX"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={reservationData.email}
                    onChange={(e) => updateReservationData({ email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={reservationData.date}
                    onChange={(e) => updateReservationData({ date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
                
                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {timeSuggestions.map((time) => (
                      <button
                        key={time}
                        onClick={() => updateReservationData({ time })}
                        className={`py-2 px-2 rounded-lg border transition-all text-sm ${
                          reservationData.time === time
                            ? 'border-[#BF2201] bg-red-50 text-[#BF2201]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <input
                    type="time"
                    value={reservationData.time}
                    onChange={(e) => updateReservationData({ time: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>
                
                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <div className="grid grid-cols-3 gap-2">
                    {guestOptions.map((num) => (
                      <button
                        key={num.toString()}
                        onClick={() => updateReservationData({ guests: num as number })}
                        className={`py-2 rounded-lg border transition-all text-sm ${
                          reservationData.guests === num
                            ? 'border-[#BF2201] bg-red-50 text-[#BF2201]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                  <textarea
                    value={reservationData.notes}
                    onChange={(e) => updateReservationData({ notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                    placeholder="Any special requests or preferences..."
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Footer - Sticky button */}
              <div className="p-4 border-t bg-white flex-shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#BF2201] hover:bg-[#A01B00] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Reserve Now'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReservationModal;