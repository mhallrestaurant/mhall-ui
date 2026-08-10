import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-gray-500 mt-1">Configure system preferences</p></div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['general', 'notifications', 'appearance'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-[#BF2201] text-[#BF2201]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Restaurant Information</h3>
                  <div className="space-y-3">
                    <div><label className="block text-sm text-gray-600 mb-1">Restaurant Name</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="Moor Hall Restaurant" /></div>
                    <div><label className="block text-sm text-gray-600 mb-1">Timezone</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option>Europe/Kiev (UTC+3)</option></select></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Business Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Monday - Friday</span><span className="text-sm font-medium">10:00 AM - 10:00 PM</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Saturday - Sunday</span><span className="text-sm font-medium">9:00 AM - 11:00 PM</span></div>
                  </div>
                </div>
              </div>
              <button className="bg-[#BF2201] text-white px-6 py-2 rounded-lg hover:bg-[#a01800]">Save Changes</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div><h3 className="font-medium text-gray-900">Order Status Updates</h3><p className="text-sm text-gray-500">Send WhatsApp notifications when order status changes</p></div>
                  <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BF2201]"></div></label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div><h3 className="font-medium text-gray-900">Payment Confirmations</h3><p className="text-sm text-gray-500">Send WhatsApp notifications for payment updates</p></div>
                  <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BF2201]"></div></label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div><h3 className="font-medium text-gray-900">Reservation Updates</h3><p className="text-sm text-gray-500">Send WhatsApp notifications for reservation changes</p></div>
                  <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#BF2201]"></div></label>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Theme</h3>
                  <div className="space-y-2">
                    <label className="flex items-center"><input type="radio" name="theme" defaultChecked className="text-[#BF2201] focus:ring-[#BF2201]" /><span className="ml-2 text-sm text-gray-700">Light</span></label>
                    <label className="flex items-center"><input type="radio" name="theme" className="text-[#BF2201] focus:ring-[#BF2201]" /><span className="ml-2 text-sm text-gray-700">Dark</span></label>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Language</h3>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option>English</option><option>Spanish</option><option>French</option></select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
