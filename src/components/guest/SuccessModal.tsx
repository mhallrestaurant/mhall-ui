import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuestInteraction } from '../../context/GuestInteractionContext';
import logo from '../../assets/logo.png';

const SuccessModal: React.FC = () => {
  const { isSuccessOpen, successData, closeSuccess } = useGuestInteraction();
  const [showPaymentUpload, setShowPaymentUpload] = useState(false);
  
  if (!successData) return null;
  
  const getIcon = () => {
    return logo;
  };

  const handleSendPaymentScreenshot = () => {
    const phoneNumber = '+250788658316';
    const message = encodeURIComponent(
      `Hello! I have completed payment for order #${successData.orderId}. Please find the payment screenshot attached.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    setShowPaymentUpload(false);
  };

  return (
    <AnimatePresence>
      {isSuccessOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeSuccess}
          >
            {/* Modal - Scrollable content area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto p-6">
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-4">
                <img src={getIcon()} alt="Logo" className="w-full h-full object-contain" />
              </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {successData.title}
                </h2>
                
                {/* Order ID for orders */}
                {successData.hasPromotionOffer && (
                  <div className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 mb-4 text-sm font-semibold text-red-700 mx-auto">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-700 mr-2" />
                    Promotional Order
                  </div>
                )}
                {successData.orderId && (
                  <div className="bg-gray-50 rounded-lg px-4 py-2 mb-4 inline-block mx-auto">
                    <span className="text-sm text-gray-600">Order ID:</span>
                    <span className="ml-2 font-mono font-bold text-[#BF2201]">
                      #{successData.orderId}
                    </span>
                  </div>
                )}
                
                {/* Message */}
                <p className="text-gray-600 mb-4 leading-relaxed text-center">
                  {successData.message}
                </p>

                {/* Payment Info for orders */}
                {successData.showPaymentInfo && successData.type === 'order' && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-4">
                    <h3 className="font-semibold text-gray-900 text-center pb-2 border-b border-gray-200">
                      Payment Details
                    </h3>
                    {successData.momoNumber && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.71.46 3.31 1.24 4.66L2 22l5.42-1.24C9.02 21.4 10.47 21.8 12 21.8c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.61 0-3.16-.41-4.52-1.13l-.33-.16-3.11.73.73-3.01-.16-.34C4.41 15.16 4 13.61 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-500">Mobile Money Pay</p>
                            <p className="font-semibold text-gray-900 truncate">{successData.momoNumber}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(successData.momoNumber!)}
                          className="text-xs text-[#BF2201] font-medium hover:underline flex-shrink-0 ml-2"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                    {successData.bankAccount && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4 0v7h3v-7h-3zM20 8H4c-.55 0-1-.45-1-1s.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1zm-1-4H5c-.55 0-1-.45-1-1s.45-1 1-1h14c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-500">Bank Account</p>
                            <p className="font-semibold text-gray-900 truncate">{successData.bankAccount}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(successData.bankAccount!)}
                          className="text-xs text-[#BF2201] font-medium hover:underline flex-shrink-0 ml-2"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Send Payment Screenshot Button */}
                {successData.type === 'order' && successData.orderId && (
                  <div className="mb-4">
                    <button
                      onClick={() => setShowPaymentUpload(!showPaymentUpload)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM9.5 15.5l2.5-3.01L14.5 16l4.5-6H11l-1.5 2z"/>
                      </svg>
                      {showPaymentUpload ? 'Hide' : 'click to Send Payment Screenshot'}
                    </button>
                  </div>
                )}
                
                {showPaymentUpload && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-blue-50 rounded-lg p-4 mb-4"
                  >
                    <p className="text-sm text-blue-800 mb-3">
                      Click the button below to open WhatsApp and send your payment screenshot to us.
                    </p>
                    <button
                      onClick={handleSendPaymentScreenshot}
                      className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM9.5 15.5l2.5-3.01L14.5 16l4.5-6H11l-1.5 2z"/>
                      </svg>
                      Send Screenshot on WhatsApp
                    </button>
                  </motion.div>
                )}
              </div>
              
              {/* Sticky footer with Close button */}
              <div className="p-4 border-t bg-white flex-shrink-0">
                <button
                  onClick={closeSuccess}
                  className="w-full text-gray-700 hover:text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;