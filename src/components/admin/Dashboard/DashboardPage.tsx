import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../redux/store';
import { selectDashboardStats, selectDashboardLoading, selectDashboardError, fetchDashboardStats } from '../../../redux/slices/dashboardSlice';

// Reusable Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconBg: string;
  trend?: { value: number; label: string };
}> = ({ title, value, icon: Icon, iconBg, trend }) => (
  <div className="neu-stat-card flex items-center justify-between neu-glow-ring">
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--neu-text-secondary)' }}>
        {title}
      </p>
      <p className="text-3xl font-bold mt-1" style={{ color: 'var(--neu-text-primary)' }}>
        {value}
      </p>
      <div className="mt-2">
        <span className="neu-stat-pill">
          {trend && (
            <span className={trend.value >= 0 ? 'neu-stat-pill-trend-up' : 'neu-stat-pill-trend-down'}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
          {trend && <span style={{ color: 'var(--neu-text-secondary)' }}>{trend.label}</span>}
        </span>
      </div>
    </div>
    <div
      className="p-3 rounded-2xl neu-icon-convex"
      style={{
        background: 'var(--neu-gradient-brand)',
        boxShadow: '0 8px 20px rgba(191, 34, 1, 0.35)'
      }}
    >
      <Icon className="h-6 w-6 text-white" />
    </div>
  </div>
);

// SVG Icons
const ShoppingBagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const RwfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v12M8 10h8M8 14h8"/>
  </svg>
);

const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

// Order Status Distribution Card
const OrderStatusCard: React.FC = () => {
  const stats = useSelector(selectDashboardStats);

  if (!stats) {
    return <div className="neu-card-flat p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Orders by Status</h3>
      <div className="text-center py-8" style={{ color: 'var(--neu-text-secondary)' }}>Loading...</div>
    </div>;
  }

  const ordersByStatus = stats.ordersByStatus;

  const statusColors: Record<string, string> = {
    REQUESTED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-indigo-100 text-indigo-800',
    PREPARING: 'bg-yellow-100 text-yellow-800',
    READY: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    REQUESTED: 'Requested',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY: 'Ready',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  const statusEntries = Object.entries(ordersByStatus) as [string, number][];
  const totalOrders = statusEntries.reduce((a, b) => a + b[1], 0);

  return (
    <div className="neu-card-flat p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Orders by Status</h3>
      <div className="space-y-4">
        {statusEntries.map(([status, count]) => (
          <div key={status} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`neu-badge ${statusColors[status]}`}>
                {statusLabels[status]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>{count}</span>
              <div className="neu-progress w-20">
                <div
                  className="neu-progress-bar"
                  style={{ width: totalOrders > 0 ? `${(count / totalOrders) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Payment Summary Card
const PaymentSummaryCard: React.FC = () => {
  const stats = useSelector(selectDashboardStats);

  if (!stats) {
    return <div className="neu-card-flat p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Payment Summary</h3>
      <div className="text-center py-8" style={{ color: 'var(--neu-text-secondary)' }}>Loading...</div>
    </div>;
  }

  const paymentSummary = stats.paymentSummary;

  const paymentColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const paymentLabels: Record<string, string> = {
    pending: 'Pending',
    partial: 'Partial',
    paid: 'Paid',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };

  const paymentEntries: [string, number][] = [
    ['pending', paymentSummary.pending],
    ['partial', paymentSummary.partial],
    ['paid', paymentSummary.paid],
    ['failed', paymentSummary.failed],
    ['cancelled', paymentSummary.cancelled]
  ];

  return (
    <div className="neu-card-flat p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Payment Summary</h3>
      <div className="space-y-3">
        {paymentEntries.map(([status, count]) => (
          <div key={status} className="flex items-center justify-between">
            <span className={`neu-badge ${paymentColors[status]}`}>
              {paymentLabels[status]}
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>{count} orders</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recent Orders Table
const RecentOrdersTable: React.FC = () => {
  const stats = useSelector(selectDashboardStats);

  if (!stats) {
    return <div className="neu-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--neu-text-primary)' }}>Recent Orders</h3>
      </div>
      <div className="text-center py-8" style={{ color: 'var(--neu-text-secondary)' }}>Loading...</div>
    </div>;
  }

  const recentOrders = stats.recentOrders;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="neu-card overflow-hidden">
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,107,0,0.1)' }}>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--neu-text-primary)' }}>Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="neu-table">
          <thead className="neu-table-header-row">
            <tr>
              <th className="neu-table-header-cell">Order</th>
              <th className="neu-table-header-cell">Customer</th>
              <th className="neu-table-header-cell">Date</th>
              <th className="neu-table-header-cell">Total</th>
              <th className="neu-table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order: any) => (
              <tr key={order.id} className="neu-table-row">
                <td className="neu-table-cell font-bold" style={{ color: 'var(--neu-accent)' }}>
                  #{order.orderNumber}
                </td>
                <td className="neu-table-cell font-medium" style={{ color: 'var(--neu-text-primary)' }}>
                  {order.customer.name}
                </td>
                <td className="neu-table-cell" style={{ color: 'var(--neu-text-secondary)' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="neu-table-cell font-semibold" style={{ color: 'var(--neu-text-primary)' }}>
                  {order.total.toLocaleString()} RWF
                </td>
                <td className="neu-table-cell">
                  <span className={`neu-badge ${statusColors[order.status]}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Popular Items List
const PopularItemsList: React.FC = () => {
  const stats = useSelector(selectDashboardStats);

  if (!stats) {
    return <div className="neu-card-flat p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Popular Menu Items</h3>
      <div className="text-center py-8" style={{ color: 'var(--neu-text-secondary)' }}>Loading...</div>
    </div>;
  }

  const popularItems = stats.popularItems;

  return (
    <div className="neu-card-flat p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Popular Menu Items</h3>
      <div className="space-y-4">
        {popularItems.map((item: any, index: number) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                style={{
                  background: 'var(--neu-gradient-brand)',
                  boxShadow: '0 2px 8px rgba(191,34,1,0.35)'
                }}
              >
                {index + 1}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>{item.name}</span>
            </div>
            <span className="neu-stat-pill">{item.count} orders</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Revenue Chart
const RevenueChart: React.FC = () => {
  const stats = useSelector(selectDashboardStats);

  if (!stats) {
    return <div className="neu-card p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Revenue (Last 7 Days)</h3>
      <div className="text-center py-8" style={{ color: 'var(--neu-text-secondary)' }}>Loading...</div>
    </div>;
  }

  const revenueByDay = stats.revenueByDay;

  const maxRevenue = Math.max(...revenueByDay.map((d: any) => d.amount), 1);

  return (
    <div className="neu-card p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Revenue (Last 7 Days)</h3>
      <div className="flex items-end space-x-2 h-40">
        {revenueByDay.map((day: any) => (
          <div key={day.date} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t"
              style={{
                background: 'var(--neu-gradient-brand)',
                height: `${(day.amount / maxRevenue) * 100}%`,
                boxShadow: '0 4px 12px rgba(191,34,1,0.35)'
              }}
            />
            <span className="text-xs mt-2 font-medium" style={{ color: 'var(--neu-text-secondary)' }}>
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className="text-xs font-bold" style={{ color: 'var(--neu-text-primary)' }}>{day.amount.toLocaleString()} RWF</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector(selectDashboardStats);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !stats) {
    return <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--neu-accent)' }}></div>
      <p className="mt-4 font-medium" style={{ color: 'var(--neu-text-secondary)' }}>Loading dashboard data...</p>
    </div>;
  }

  if (error) {
    return <div className="text-center py-12">
      <p className="text-red-600">Error loading dashboard: {error}</p>
      <button onClick={() => dispatch(fetchDashboardStats())} className="neu-btn-primary mt-4">
        Retry
      </button>
    </div>;
  }

  if (!stats ||
       (stats.overview.totalOrders === 0 &&
        stats.overview.totalRevenue === "0" &&
        stats.overview.totalCustomers === 0)) {
    return <div className="text-center py-12">
      <p style={{ color: 'var(--neu-text-secondary)' }}>No data available yet. Start by adding some orders, menu items, or customers to see dashboard statistics.</p>
      <div className="mt-6 space-x-4">
        <button
          onClick={() => window.location.href = '/menu'}
          className="neu-btn-primary"
        >
          Manage Menu
        </button>
        <button
          onClick={() => window.location.href = '/orders'}
          className="neu-btn-glass"
        >
          Manage Orders
        </button>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="neu-page-title">
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Overview</span>
        </h1>
        <p className="neu-page-subtitle">Real-time summary of your restaurant operations</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.overview.totalOrders}
          icon={ShoppingBagIcon}
          iconBg="bg-[#BF2201]"
          trend={{ value: 12, label: 'from last week' }}
        />
        <StatCard
          title="Total Revenue"
          value={`${stats.overview.totalRevenue.toLocaleString()} RWF`}
          icon={RwfIcon}
          iconBg="bg-green-600"
          trend={{ value: 8, label: 'from last week' }}
        />
        <StatCard
          title="Total Reservations"
          value={stats.overview.totalReservations}
          icon={CalendarIcon}
          iconBg="bg-blue-600"
          trend={{ value: 5, label: 'from last week' }}
        />
        <StatCard
          title="Catering Requests"
          value={stats.overview.totalCateringRequests}
          icon={UsersIcon}
          iconBg="bg-purple-600"
          trend={{ value: 3, label: 'from last week' }}
        />
      </div>

      {/* Charts and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="space-y-6">
          <OrderStatusCard />
          <PaymentSummaryCard />
        </div>
      </div>

      {/* Recent Orders and Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div>
          <PopularItemsList />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="neu-card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neu-text-primary)' }}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button className="neu-tile flex flex-col items-center justify-center py-5 w-full cursor-pointer">
            <ShoppingBagIcon className="h-7 w-7 mb-2" style={{ color: 'var(--neu-accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>New Order</span>
          </button>
          <button className="neu-tile flex flex-col items-center justify-center py-5 w-full cursor-pointer">
            <CalendarIcon className="h-7 w-7 mb-2" style={{ color: 'var(--neu-accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>New Reservation</span>
          </button>
          <button className="neu-tile flex flex-col items-center justify-center py-5 w-full cursor-pointer">
            <UsersIcon className="h-7 w-7 mb-2" style={{ color: 'var(--neu-accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>Catering</span>
          </button>
          <button className="neu-tile flex flex-col items-center justify-center py-5 w-full cursor-pointer">
            <ChartBarIcon className="h-7 w-7 mb-2" style={{ color: 'var(--neu-accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>Menu Item</span>
          </button>
          <button className="neu-tile flex flex-col items-center justify-center py-5 w-full cursor-pointer">
            <CreditCardIcon className="h-7 w-7 mb-2" style={{ color: 'var(--neu-accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--neu-text-primary)' }}>Payments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
