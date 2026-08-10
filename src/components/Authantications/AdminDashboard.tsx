import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  <img src="/assets/logomoor.png" alt="Moor Hall Restaurant" className="h-8 w-auto" />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/content"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Content
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                <button type="button" className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                  <span className="sr-only">View notifications</span>
                  {/* <!-- Heroicon name: outline/bell --> */}
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 006-8c0-1-1-2-2-2V4a2 2 0 10-4 0v4a2 2 0 11-4 0c-1 0-2 1-2 2v2a8 8 0 006 8z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M8.257 18.072A8.016 8.016 0 015 10a8 8 0 0116 0a8.016 8.016 0 01-3.257 8.072zm6.393-9.072a1 1 0 10-1.414 1.414L9 10.586 7.707 9.293a1 1 0 00-1.414-1.414L5.414 7.707a1 1 0 000 1.414l1.414 1.414L9 12.414l1.707-1.707a1 1 0 00-1.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button type="button" className="max-w-xs bg-white flex text-sm font-medium text-right rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-3 lg:gap-6">
            <div className="mt-10 lg:mt-0 lg:col-span-2">
              <dl>
                <div className="flex items-start py-4">
                  <dt className="w-32 text-base font-medium text-gray-500">
                    Total Users
                  </dt>
                  <dd className="ml-4 text-3xl font-semibold text-gray-900">
                    1,243
                  </dd>
                </div>
                <div className="flex items-start py-4">
                  <dt className="w-32 text-base font-medium text-gray-500">
                    Active Today
                  </dt>
                  <dd className="ml-4 text-3xl font-semibold text-gray-900">
                    423
                  </dd>
                </div>
                <div className="flex items-start py-4">
                  <dt className="w-32 text-base font-medium text-gray-500">
                    New This Week
                  </dt>
                  <dd className="ml-4 text-3xl font-semibold text-gray-900">
                    89
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-10 lg:mt-0 lg:col-span-1">
              <div className="h-64 bg-white overflow-hidden rounded-lg shadow">
                {/* Chart placeholder */}
                <div className="h-full flex items-center justify-center text-gray-400">
                  Analytics Chart
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0 lg:col-span-3">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Here are the latest updates from your admin panel.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-5 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-indigo-100 text-indigo-500 flex items-center justify-center">
                          {/* Heroicon name: outline/plus */}
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 8a2 2 0 110 4H6a2 2 0 110-4h4zM8 10a2 2 0 104 0v4a2 2 0 10-4 0h-4z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-1">
                        <p className="text-sm font-medium text-gray-900">
                          New user registered: john.doe@example.com
                        </p>
                        <p className="text-sm text-gray-500">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="px-4 py-5 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-green-100 text-green-500 flex items-center justify-center">
                          {/* Heroicon name: outline/arrow-trending-up */}
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 006-8c0-1-1-2-2-2V4a2 2 0 10-4 0v4a2 2 0 101 1 1l4 4a1 1 0 001.414-1.414L16.414 11H13a2 2 0 100-4h-3a2 2 0 10-3.414 4.586l1.293-1.293a1 1 0 011.414-1.414L12 10.586V8a2 2 0 110-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-1">
                        <p className="text-sm font-medium text-gray-900">
                          Website traffic increased by 12%
                        </p>
                        <p className="text-sm text-gray-500">
                          Today at 3:45 AM
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="px-4 py-5 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-purple-100 text-purple-500 flex items-center justify-center">
                          {/* Heroicon name: outline/shopping-cart */}
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 1a1 1 0 012 0v1h2V2a1 1 0 012 0v1h2V2a1 1 0 012 0v1h3.586l-.707-.707A1 1 0 0115 2v2h3a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h1.586l.707.707A1 1 0 005 5.414V5a1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-1">
                        <p className="text-sm font-medium text-gray-900">
                          New order #1024 placed
                        </p>
                        <p className="text-sm text-gray-500">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;