import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchFeaturedServices,
  createFeaturedService,
  updateFeaturedService,
  deleteFeaturedService,
  toggleFeaturedServiceStatus,
} from '../../../redux/slices/featuredServicesSlice';

interface ServiceForm {
  name: string;
  slug: string;
  type: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const ServiceTypeOptions = ['DINING', 'RESERVATION', 'CATERING', 'PRIVATE'];

const FeaturedServicesManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: services, loading, error } = useSelector((state: RootState) => state.featuredServices);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [newService, setNewService] = useState<ServiceForm>({
    name: '',
    slug: '',
    type: 'DINING',
    description: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchFeaturedServices());
  }, [dispatch]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    let updateData: any = { [name]: finalValue };

    if (name === 'name') {
      updateData.slug = generateSlug(value);
    }

    setNewService(prev => ({
      ...prev,
      ...updateData
    }));
  };

  const handleSave = async () => {
    try {
      setSubmitError(null);
      setSubmitLoading(true);

      if (!newService.name.trim()) {
        setSubmitError('Service name is required');
        setSubmitLoading(false);
        return;
      }

      if (!newService.slug.trim()) {
        setSubmitError('Service slug is required');
        setSubmitLoading(false);
        return;
      }

      if (editingService) {
        await dispatch(updateFeaturedService({ id: editingService.id, ...newService })).unwrap();
        setEditingService(null);
      } else {
        await dispatch(createFeaturedService(newService)).unwrap();
      }

      setShowAddModal(false);
      setNewService({
        name: '',
        slug: '',
        type: 'DINING',
        description: '',
        imageUrl: '',
        isActive: true,
      });

      dispatch(fetchFeaturedServices());
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save service');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      slug: service.slug,
      type: service.type,
      description: service.description || '',
      imageUrl: service.imageUrl || '',
      isActive: service.isActive,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await dispatch(deleteFeaturedService(id)).unwrap();
        dispatch(fetchFeaturedServices());
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await dispatch(toggleFeaturedServiceStatus(id)).unwrap();
      dispatch(fetchFeaturedServices());
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setNewService({
      name: '',
      slug: '',
      type: 'DINING',
      description: '',
      imageUrl: '',
      isActive: true,
    });
    setSubmitError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Services</h1>
          <p className="text-gray-500 mt-1">Manage services displayed on home page</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#BF2201] text-white px-4 py-2 rounded-lg hover:bg-[#a01800] transition-colors"
        >
          Add Service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Services</h2>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-600">Loading services...</p>
          </div>
        ) : services && services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {service.imageUrl && (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {service.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-mono">{service.slug}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleToggleStatus(service.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          service.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
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
        ) : (
          <div className="px-6 py-8 text-center text-gray-600">
            No services found. Create one to get started!
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
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
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newService.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Dining In"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (auto-generated)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={newService.slug}
                  onChange={handleInputChange}
                  placeholder="dining-in"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <select
                  name="type"
                  value={newService.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                >
                  {ServiceTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newService.description}
                  onChange={handleInputChange}
                  placeholder="Service description..."
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
                  value={newService.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BF2201] focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={newService.isActive}
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
                {submitLoading ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedServicesManagement;
