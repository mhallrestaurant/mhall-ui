import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Order, Status, PaymentStatus } from '../../../types';

const ITEMS_PER_PAGE = 10;

const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, getOrderById, sendCustomEmail } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const statusOptions: Array<{value: string; label: string}> = [
    { value: 'all', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const normalizeStatusValue = (value: string) => {
    const map: Record<string, string> = {
      pending: 'new',
      payment_waiting: 'new',
      payment_under_review: 'confirmed',
      approved: 'confirmed',
      confirmed: 'confirmed',
      preparing: 'preparing',
      ready: 'ready',
      out_for_delivery: 'out_for_delivery',
      completed: 'completed',
      cancelled: 'cancelled',
    };
    return map[value.toLowerCase()] || value.toLowerCase();
  };

  const paymentOptions: Array<{value: string; label: string}> = [
    { value: 'all', label: 'All Payments' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentColors: Record<string, string> = {
    partial: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
  };

  const formatPaymentStatus = (value: string) => {
    const map: Record<string, string> = {
      pending: 'Pending',
      partial: 'Partial',
      paid: 'Paid',
      failed: 'Failed',
      cancelled: 'Cancelled',
    };
    return map[value.toLowerCase()] || value;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm);
    
    const normalizedStatus = normalizeStatusValue(order.status);
    const matchesStatus = filterStatus === 'all' || normalizedStatus === filterStatus;
    const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const pagedOrders = filteredOrders.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage >= pageCount && pageCount > 0) {
      setCurrentPage(pageCount - 1);
    }
  }, [currentPage, pageCount]);

  useEffect(() => {
    if (!selectedOrder?.id) return;
    const latestOrder = getOrderById(selectedOrder.id);
    if (latestOrder) {
      setSelectedOrder(latestOrder);
    }
  }, [orders, getOrderById, selectedOrder?.id]);

  const handleStatusChange = (orderId: string, newStatus: Status) => {
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : prev);
    }
    updateOrderStatus(orderId, newStatus);
  };

  const handlePaymentChange = (orderId: string, newStatus: PaymentStatus) => {
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newStatus, updatedAt: new Date().toISOString() } : prev);
    }
    updateOrderPaymentStatus(orderId, newStatus);
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(getOrderById(order.id) || order);
    setShowDetails(true);
    setCustomMessage('');
  };

  const handleSendEmail = async () => {
    if (!selectedOrder || !customMessage.trim()) return;
    setSendingEmail(true);
    const success = await sendCustomEmail(selectedOrder.id, customMessage.trim());
    if (success) {
      setCustomMessage('');
    }
    setSendingEmail(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by order #, name, or phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#BF2201] focus:border-[#BF2201]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#BF2201] focus:border-[#BF2201]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#BF2201] focus:border-[#BF2201]"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
            >
              {paymentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#BF2201] focus:border-[#BF2201]"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#BF2201]">
                      #{order.orderNumber}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-medium text-gray-900">{order.customer?.name}</div>
                       <div className="text-sm text-gray-500">{order.customer?.phone}</div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.total.toLocaleString()} RWF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[normalizeStatusValue(order.status)]}`}>
                        {normalizeStatusValue(order.status).replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus]}`}>
                        {formatPaymentStatus(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-[#BF2201] hover:text-[#a01800] font-medium"
                        >
                          View
                        </button>
                        <select
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          value={normalizeStatusValue(order.status)}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Status)}
                        >
                          <option value="new">New</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {pagedOrders.length === 0 && (
                  <tr className="bg-white">
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {pageCount === 0 ? 1 : currentPage + 1} of {pageCount === 0 ? 1 : pageCount}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(page + 1, Math.max(pageCount - 1, 0)))}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage >= pageCount - 1 || pageCount === 0}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                  <p className="text-lg font-semibold">#{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Type</h3>
                  <p className="text-lg">{selectedOrder.orderType}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedOrder.customer?.name}</p>
                  <p className="text-gray-600">{selectedOrder.customer?.phone}</p>
                  {selectedOrder.customer?.email && (
                    <p className="text-gray-600">{selectedOrder.customer.email}</p>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.deliveryAddress && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>{selectedOrder.deliveryAddress.street}</p>
                    <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.postalCode}</p>
                    <p>{selectedOrder.deliveryAddress.country}</p>
                    {selectedOrder.deliveryAddress.notes && (
                      <p className="text-gray-600 mt-1">{selectedOrder.deliveryAddress.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Items Ordered</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.specialInstructions && (
                                <p className="text-sm text-gray-500">{item.specialInstructions}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">{item.price.toLocaleString()} RWF</td>
                          <td className="px-4 py-2 font-medium">{(item.price * item.quantity).toLocaleString()} RWF</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Summary</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{selectedOrder.subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{selectedOrder.deliveryFee.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{selectedOrder.tax.toLocaleString()} RWF</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{selectedOrder.total.toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>

              {/* Status and Payment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#BF2201] focus:border-[#BF2201]"
                    value={normalizeStatusValue(selectedOrder.status)}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Status)}
                  >
                    <option value="new">New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#BF2201] focus:border-[#BF2201]"
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => handlePaymentChange(selectedOrder.id, e.target.value as PaymentStatus)}
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              {(selectedOrder.customerNotes || selectedOrder.adminNotes) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="space-y-2">
                    {selectedOrder.customerNotes && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-medium mb-1">Customer Note</p>
                        <p className="text-sm text-blue-800">{selectedOrder.customerNotes}</p>
                      </div>
                    )}
                    {selectedOrder.adminNotes && (
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-xs text-yellow-600 font-medium mb-1">Admin Note</p>
                        <p className="text-sm text-yellow-800">{selectedOrder.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Send Email */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Send Email Message</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#BF2201] focus:border-[#BF2201]"
                    rows={3}
                    placeholder="Type a custom message to send via email..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                  <div className="mt-2 flex justify-between items-center gap-3">
                    <span className="text-xs text-gray-500">
                      To: {selectedOrder.customer?.email || 'No email available'}
                    </span>
                    <button
                      onClick={handleSendEmail}
                      disabled={!customMessage.trim() || sendingEmail || !selectedOrder.customer?.email}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {sendingEmail ? 'Sending...' : 'Send Email'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
