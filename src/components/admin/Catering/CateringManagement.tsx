import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const CateringManagement: React.FC = () => {
  const { cateringRequests, updateCateringStatus } = useAdmin();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const normalizeStatusValue = (value: string) => {
    const map: Record<string, string> = {
      pending: 'pending',
      reviewing: 'confirmed',
      approved: 'confirmed',
      rejected: 'cancelled',
      completed: 'completed',
      cancelled: 'cancelled',
    };
    return map[value.toLowerCase()] || value.toLowerCase();
  };

  const filteredRequests = cateringRequests.filter(r =>
    filterStatus === 'all' || normalizeStatusValue(r.status) === filterStatus
  );
  const pagedRequests = filteredRequests.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catering Requests</h1>
          <p className="text-gray-500 mt-1">Manage catering and event requests</p>
        </div>
        <div className="text-sm text-gray-500">Total: {cateringRequests.length}</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select className="px-3 py-2 border border-gray-300 rounded-lg" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(0); }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagedRequests.map((req: any) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{req.eventType}</div>
                    <div className="text-xs text-gray-500">{req.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{req.name}</div>
                    <div className="text-xs">{req.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{req.date}</div>
                    <div className="text-xs">{req.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.guests} guests</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.budget ? req.budget.toLocaleString() + ' RWF' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[normalizeStatusValue(req.status)]}`}>
                      {normalizeStatusValue(req.status).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select className="text-sm border border-gray-300 rounded px-2 py-1" value={normalizeStatusValue(req.status)} onChange={(e) => updateCateringStatus(req.id, e.target.value as any)}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
export default CateringManagement;
