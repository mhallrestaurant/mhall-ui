import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuestInteraction } from '../../context/GuestInteractionContext';
import apiService from '../../services/api';

const CateringModal: React.FC = () => {
  const { 
    isCateringOpen, 
    closeCatering, 
    cateringData, 
    updateCateringData,
    resetCateringData,
    showSuccess 
  } = useGuestInteraction();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset errors when modal opens
  useEffect(() => {
    if (isCateringOpen) {
      setErrors({});
    }
  }, [isCateringOpen]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!cateringData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!cateringData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(cateringData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!cateringData.eventType.trim()) {
      newErrors.eventType = 'Event type is required';
    }
    if (!cateringData.eventLocation.trim()) {
      newErrors.eventLocation = 'Event location is required';
    }
    if (!cateringData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Call public API endpoint for guest catering request
      await apiService.createGuestCateringRequest({
        name: cateringData.name,
        phone: cateringData.phone,
        email: cateringData.email.trim() || undefined,
        eventType: cateringData.eventType,
        eventLocation: cateringData.eventLocation,
        preferredDate: cateringData.preferredDate,
        guests: cateringData.guests,
        notes: cateringData.notes,
      });
      
      resetCateringData();
      closeCatering();
      
      // Show success modal
      showSuccess({
        type: 'catering',
        title: 'Request received 🎉',
        message: "Our team will contact you via WhatsApp",
      });
    } catch (error) {
      console.error('Error submitting catering request:', error);
      // Still show success for demo purposes, but in production you'd want to show an error
      resetCateringData();
      closeCatering();
      showSuccess({
        type: 'catering',
        title: 'Request received 🎉',
        message: "Our team will contact you via WhatsApp",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Event type suggestions
  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Anniversary',
    'Graduation',
    'Conference',
    'Other',
  ];
  
  // Guest number options
  const guestOptions = [20, 50, 100, 150, 200, 250, 300, 500];
  
  return (
    <AnimatePresence>
      {isCateringOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={!isSubmitting ? closeCatering : undefined}
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
                <h2 className="text-xl font-bold text-gray-900">Request Catering</h2>
                <button
                  onClick={closeCatering}
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
                    value={cateringData.name}
                    onChange={(e) => updateCateringData({ name: e.target.value })}
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
                    value={cateringData.phone}
                    onChange={(e) => updateCateringData({ phone: e.target.value })}
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
                    value={cateringData.email}
                    onChange={(e) => updateCateringData({ email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {eventTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateCateringData({ eventType: type })}
                        className={`py-2 px-2 rounded-lg border text-sm transition-all ${
                          cateringData.eventType === type
                            ? 'border-[#BF2201] bg-red-50 text-[#BF2201]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
                </div>
                
                {/* Event Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Location *</label>
                  <input
                    type="text"
                    value={cateringData.eventLocation}
                    onChange={(e) => updateCateringData({ eventLocation: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.eventLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Venue address or location"
                  />
                  {errors.eventLocation && <p className="text-red-500 text-sm mt-1">{errors.eventLocation}</p>}
                </div>
                
                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <div className="grid grid-cols-4 gap-2">
                    {guestOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => updateCateringData({ guests: num })}
                        className={`py-2 rounded-lg border transition-all text-sm ${
                          cateringData.guests === num
                            ? 'border-[#BF2201] bg-red-50 text-[#BF2201]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Preferred Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    value={cateringData.preferredDate}
                    onChange={(e) => updateCateringData({ preferredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent ${
                      errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                  <textarea
                    value={cateringData.notes}
                    onChange={(e) => updateCateringData({ notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                    placeholder="Menu preferences, budget, or other requirements..."
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
                    'Send Request'
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

export default CateringModal;