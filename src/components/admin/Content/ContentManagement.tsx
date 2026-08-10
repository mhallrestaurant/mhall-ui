import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const ContentManagement: React.FC = () => {
  const { contentBlocks, updateContentBlock, promoBanners, updatePromoBanner } = useAdmin();
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Content Management</h1><p className="text-gray-500 mt-1">Manage website content and promotional banners</p></div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h2 className="text-lg font-semibold text-gray-900">Promotional Banners</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtitle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoBanners.map((banner: any) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{banner.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{banner.subtitle}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{banner.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4 text-sm"><button onClick={() => setEditingBanner(banner)} className="text-[#BF2201] hover:text-[#a01800] font-medium">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-semibold text-gray-900">Content Blocks</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50"><tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contentBlocks.map((block: any) => (
                <tr key={block.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{block.key}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{block.title}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${block.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{block.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4 text-sm"><button onClick={() => setEditingBlock(block)} className="text-[#BF2201] hover:text-[#a01800] font-medium">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Banner</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={editingBanner.title} onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={editingBanner.subtitle} onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })} /></div>
              <div className="flex items-center"><input type="checkbox" checked={editingBanner.isActive} onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })} className="rounded text-[#BF2201] focus:ring-[#BF2201]" /><label className="ml-2 text-sm text-gray-700">Active</label></div>
              <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setEditingBanner(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={() => { updatePromoBanner(editingBanner.id, editingBanner); setEditingBanner(null); }} className="px-4 py-2 bg-[#BF2201] text-white rounded-lg hover:bg-[#a01800]">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Content Block</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={editingBlock.title} onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg" value={editingBlock.content} onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })} /></div>
              <div className="flex items-center"><input type="checkbox" checked={editingBlock.isActive} onChange={(e) => setEditingBlock({ ...editingBlock, isActive: e.target.checked })} className="rounded text-[#BF2201] focus:ring-[#BF2201]" /><label className="ml-2 text-sm text-gray-700">Active</label></div>
              <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setEditingBlock(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={() => { updateContentBlock(editingBlock.id, editingBlock); setEditingBlock(null); }} className="px-4 py-2 bg-[#BF2201] text-white rounded-lg hover:bg-[#a01800]">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContentManagement;
