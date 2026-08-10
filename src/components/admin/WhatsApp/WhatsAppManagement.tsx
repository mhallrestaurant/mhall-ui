import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const WhatsAppManagement: React.FC = () => {
  const { notifications, resendNotification } = useAdmin();
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const typeLabels: Record<string, string> = {
    order_update: 'Order Update',
    payment_confirmation: 'Payment Confirmation',
    receipt: 'Receipt',
    reservation_update: 'Reservation Update',
    catering_update: 'Catering Update',
  };

  const statusColors: Record<string, string> = {
    sent: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const filteredNotifications = notifications.filter(n => 
    filterType === 'all' || n.type === filterType
  );
  const pagedNotifications = filteredNotifications.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Notifications</h1>
        <p className="text-gray-500 mt-1">Manage automated WhatsApp messages</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg"
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(0); }}
            >
              <option value="all">All Types</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagedNotifications.map((notif: any) => (
                <tr key={notif.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{notif.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeLabels[notif.type]}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{notif.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[notif.status]}`}>
                      {notif.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(notif.sentAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => resendNotification(notif.id)}
                      className="text-[#BF2201] hover:text-[#a01800] font-medium"
                    >
                      Resend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          {pageCount > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                disabled={currentPage === 0}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {pageCount === 0 ? 1 : currentPage + 1} of {pageCount === 0 ? 1 : pageCount}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(page + 1, Math.max(pageCount - 1, 0)))}
                disabled={currentPage >= pageCount - 1 || pageCount === 0}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppManagement;
