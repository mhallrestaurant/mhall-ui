import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const ReportsPage: React.FC = () => {
  const { generateReport, getDashboardMetrics } = useAdmin();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState<any>(null);
  const metrics = getDashboardMetrics();

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  const handleGenerate = () => {
    if (startDate && endDate) {
      const r = generateReport(startDate, endDate);
      setReport(r);
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1><p className="text-gray-500 mt-1">Generate detailed reports for your restaurant</p></div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Report</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button onClick={handleGenerate} className="bg-[#BF2201] text-white px-4 py-2 rounded-lg hover:bg-[#a01800] h-fit">Generate Report</button>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Summary ({report.period.start} to {report.period.end})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-gray-900">{report.totalRevenue.toLocaleString()} RWF</p></div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold text-gray-900">{report.totalOrders}</p></div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Avg Order Value</p><p className="text-2xl font-bold text-gray-900">{report.averageOrderValue.toLocaleString()} RWF</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
              <div className="space-y-3">
                {Object.entries(report.ordersByStatus).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                    <span className="text-sm font-medium text-gray-900">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(report.paymentBreakdown).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{status}</span>
                    <span className="text-sm font-medium text-gray-900">{count as number} orders</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.popularItems.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.count}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.revenue.toLocaleString()} RWF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Total Reservations</p><p className="text-xl font-bold text-gray-900">{report.reservationsCount}</p></div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Catering Requests</p><p className="text-xl font-bold text-gray-900">{report.cateringRequestsCount}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReportsPage;
