import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import logo from "../../../assets/logomoor.png";
import { apiService } from '../../../services/api';
import { useAdmin } from '../../../context/AdminContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  badge?: number;
}

// SVG Icons
const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ShoppingBagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
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

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const GiftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M7 7H3.5a1.5 1.5 0 0 1 0-3h4M17 7h3.5a1.5 1.5 0 0 0 0-3h-4"/>
  </svg>
);

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Bars3Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications, adminActions, markAllNotificationsRead } = useAdmin();

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const handleAuthExpired = async () => {
      const authExpired = sessionStorage.getItem('authExpired');
      if (authExpired) {
        sessionStorage.removeItem('authExpired');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    };

    handleAuthExpired();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminToken' && e.newValue === null) {
        navigate('/admin/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/admin/login');
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Reservations', href: '/admin/reservations', icon: CalendarIcon },
    { name: 'Catering', href: '/admin/catering', icon: UsersIcon },
    { name: 'Menu', href: '/admin/menu', icon: MenuIcon },
    { name: 'Categories', href: '/admin/categories', icon: TagIcon },
    { name: 'Promotions', href: '/admin/promotions', icon: GiftIcon },
    { name: 'Featured Services', href: '/admin/featured-services', icon: StarIcon },
    { name: 'Content', href: '/admin/content', icon: DocumentTextIcon },
    { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen admin-neu-page">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col neu-sidebar overflow-hidden transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <img src={logo} alt="Moor Hall" className="h-8 w-auto" />
              <span className="text-lg font-semibold text-white">Moor Hall Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-300 hover:text-white neu-icon-btn"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto neu-scroll">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`neu-sidebar-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3 rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm">
              <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ background: 'var(--glass-gradient-brand)', boxShadow: '0 0 0 3px rgba(255,255,255,0.12), 0 10px 24px rgba(249,115,22,0.24)' }}>
                <span className="text-sm font-semibold text-white">
                  {adminUser?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{adminUser?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-300 truncate font-medium">{adminUser?.email || 'admin@moorhall.com'}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col min-h-0 lg:ml-72">
          <header className="sticky top-0 z-30 neu-header neu-header-accent">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-slate-700 hover:text-orange-500 neu-icon-btn"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
                <h1 className="ml-4 text-xl font-bold text-slate-900 hidden sm:block">
                  {navItems.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h1>
              </div>

              <div className="flex items-center gap-3 relative">
                <button
                  className="relative text-slate-600 hover:text-orange-500 neu-icon-btn"
                  onClick={() => {
                    setNotificationsOpen(prev => !prev);
                    if (!notificationsOpen) {
                      markAllNotificationsRead();
                    }
                  }}
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Notifications</p>
                        <p className="text-xs text-slate-500">Latest system activity</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => markAllNotificationsRead()}
                        className="text-xs font-medium text-orange-600 hover:text-orange-700"
                      >
                        Mark read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-200">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-slate-500">No notifications yet.</div>
                      ) : (
                        notifications.map(notification => (
                          <div key={notification.id} className={`px-4 py-3 ${notification.read ? 'bg-white' : 'bg-orange-50'}`}>
                            <p className="text-sm font-medium text-slate-900">{notification.message}</p>
                            <p className="mt-1 text-xs text-slate-500">{notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                            <p className="mt-1 text-xs text-slate-400">{new Date(notification.sentAt).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t border-slate-200 px-4 py-3 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">Recent Admin Actions</p>
                        <span className="text-xs text-slate-500">{adminActions.length} items</span>
                      </div>
                      <div className="max-h-56 overflow-y-auto mt-3 space-y-2">
                        {adminActions.length === 0 ? (
                          <div className="text-sm text-slate-500">No recent actions.</div>
                        ) : (
                          adminActions.slice(0, 5).map(action => (
                            <div key={action.id} className="rounded-xl bg-white p-3 shadow-sm">
                              <p className="text-sm font-medium text-slate-900">{action.action}</p>
                              <p className="mt-1 text-xs text-slate-500">{action.details}</p>
                              <p className="mt-1 text-[11px] text-slate-400">{new Date(action.timestamp).toLocaleString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-full bg-white/70 px-3 py-2 shadow-sm ring-1 ring-white/70">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'var(--glass-gradient-brand)', boxShadow: '0 0 0 3px rgba(255,255,255,0.8), 0 10px 24px rgba(249,115,22,0.24)' }}>
                    <span className="text-white text-sm font-semibold">
                      {adminUser?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-slate-800">
                    {adminUser?.name || 'Admin'}
                  </span>
                </div>
                <button onClick={handleLogout} className="neu-btn-glass text-sm">
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
