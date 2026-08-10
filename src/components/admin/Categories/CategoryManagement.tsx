import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const ITEMS_PER_PAGE = 10;

type CategoryType = 'FOOD' | 'COFFEE' | 'DRINK' | 'BAKERY' | 'SPECIAL';

const CategoryManagement: React.FC = () => {
  const { menuCategories, addMenuCategory, updateCategory, deleteCategory } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    order: 0,
    isActive: true,
    type: 'FOOD' as CategoryType
  });
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(menuCategories.length / ITEMS_PER_PAGE);
  const pagedCategories = menuCategories.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const handleSave = () => {
    // Prepare data in frontend format (with order field)
    const categoryData = {
      name: newCategory.name.trim(),
      description: newCategory.description.trim(),
      order: newCategory.order,
      isActive: newCategory.isActive,
      type: newCategory.type,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
    } else {
      addMenuCategory(categoryData);
    }
    setShowAddModal(false);
    setNewCategory({ name: '', description: '', order: 0, isActive: true, type: 'FOOD' as CategoryType });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-500 mt-1">Manage your menu categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#BF2201] text-white px-4 py-2 rounded-lg hover:bg-[#a01800] transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagedCategories.map((category: any) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setNewCategory({ ...category });
                          setShowAddModal(true);
                        }}
                        className="text-[#BF2201] hover:text-[#a01800] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as CategoryType })}
                >
                  <option value="FOOD">Food</option>
                  <option value="COFFEE">Coffee</option>
                  <option value="DRINK">Drink</option>
                  <option value="BAKERY">Bakery</option>
                  <option value="SPECIAL">Special</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={newCategory.order}
                  onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCategory.isActive}
                    onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                    className="rounded text-[#BF2201] focus:ring-[#BF2201]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#BF2201] text-white rounded-lg hover:bg-[#a01800]"
                >
                  {editingCategory ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;