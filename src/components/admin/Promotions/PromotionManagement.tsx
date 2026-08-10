import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchAdminPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
  clearPromotionError,
} from '../../../redux/slices/promotionSlice';

interface PromotionForm {
  title: string;
  description: string;
  imageUrl: string;
  discountPercentage?: number;
  originalPrice?: number;
  discountedPrice?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  displayOrder: number;
}

const PromotionManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: promotions, loading, error } = useSelector((state: RootState) => state.promotions);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const pageCount = Math.ceil(promotions.length / ITEMS_PER_PAGE);
  const pagedPromotions = promotions.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage >= pageCount && pageCount > 0) {
      setCurrentPage(pageCount - 1);
    }
  }, [currentPage, pageCount]);
  const [newPromotion, setNewPromotion] = useState<PromotionForm>({
    title: '',
    description: '',
    imageUrl: '',
    discountPercentage: undefined,
    originalPrice: undefined,
    discountedPrice: undefined,
    startDate: undefined,
    endDate: undefined,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    dispatch(fetchAdminPromotions());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const finalValue = type === 'number' ? (value ? Number(value) : undefined) : 
                      type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                      value;
    
    setNewPromotion(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSave = async () => {
    try {
      setSubmitError(null);
      setSubmitLoading(true);

      if (!newPromotion.title.trim()) {
        setSubmitError('Promotion title is required');
        setSubmitLoading(false);
        return;
      }

      if (editingPromotion) {
        await dispatch(updatePromotion({ id: editingPromotion.id, ...newPromotion })).unwrap();
        setEditingPromotion(null);
      } else {
        await dispatch(createPromotion(newPromotion)).unwrap();
      }

      setShowAddModal(false);
      setNewPromotion({
        title: '',
        description: '',
        imageUrl: '',
        discountPercentage: undefined,
        originalPrice: undefined,
        discountedPrice: undefined,
        startDate: undefined,
        endDate: undefined,
        isActive: true,
        displayOrder: 0,
      });

      dispatch(fetchAdminPromotions());
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save promotion');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (promotion: any) => {
    setEditingPromotion(promotion);
    setNewPromotion({
      title: promotion.title,
      description: promotion.description || '',
      imageUrl: promotion.imageUrl || '',
      discountPercentage: promotion.discountPercentage,
      originalPrice: promotion.originalPrice,
      discountedPrice: promotion.discountedPrice,
      startDate: promotion.startDate ? promotion.startDate.split('T')[0] : undefined,
      endDate: promotion.endDate ? promotion.endDate.split('T')[0] : undefined,
      isActive: promotion.isActive,
      displayOrder: promotion.displayOrder,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await dispatch(deletePromotion(id)).unwrap();
        dispatch(fetchAdminPromotions());
      } catch (err) {
        console.error('Error deleting promotion:', err);
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await dispatch(togglePromotionStatus(id)).unwrap();
      dispatch(fetchAdminPromotions());
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPromotion(null);
    setNewPromotion({
      title: '',
      description: '',
      imageUrl: '',
      discountPercentage: undefined,
      originalPrice: undefined,
      discountedPrice: undefined,
      startDate: undefined,
      endDate: undefined,
      isActive: true,
      displayOrder: 0,
    });
    setSubmitError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions Management</h1>
          <p className="text-gray-500 mt-1">Manage promotional offers displayed on home page</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#BF2201] text-white px-4 py-2 rounded-lg hover:bg-[#a01800] transition-colors"
        >
          Add Promotion
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Promotions</h2>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-600">Loading promotions...</p>
          </div>
        ) : promotions && promotions.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prices</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagedPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {promotion.imageUrl && (
                        <img
                          src={promotion.imageUrl}
                          alt={promotion.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{promotion.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {promotion.discountPercentage ? `${promotion.discountPercentage}%` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {promotion.originalPrice && promotion.discountedPrice ? (
                        <div>
                          <span className="line-through text-gray-400">${promotion.originalPrice}</span>
                          <span className="ml-2 font-semibold text-green-600">${promotion.discountedPrice}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleToggleStatus(promotion.id, promotion.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          promotion.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(promotion)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(promotion.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
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
              <span>Page {currentPage + 1} of {pageCount}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(page + 1, Math.max(pageCount - 1, 0)))}
                disabled={currentPage >= pageCount - 1}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-600">
            No promotions found. Create one to get started!
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newPromotion.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Burger Special"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newPromotion.description}
                  onChange={handleInputChange}
                  placeholder="Promotion details and terms..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={newPromotion.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={newPromotion.discountPercentage || ''}
                    onChange={handleInputChange}
                    placeholder="45"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={newPromotion.displayOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={newPromotion.originalPrice || ''}
                    onChange={handleInputChange}
                    placeholder="70000"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discounted Price
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={newPromotion.discountedPrice || ''}
                    onChange={handleInputChange}
                    placeholder="50000"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={newPromotion.startDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={newPromotion.endDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newPromotion.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#BF2201] rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitLoading}
                className="px-4 py-2 bg-[#BF2201] text-white rounded-lg hover:bg-[#a01800] disabled:opacity-50"
              >
                {submitLoading ? 'Saving...' : 'Save Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;
