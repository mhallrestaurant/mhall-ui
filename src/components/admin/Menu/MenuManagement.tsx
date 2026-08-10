import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import apiService from '../../../services/api';

const MenuManagement: React.FC = () => {
  const { menuItems, menuCategories, addMenuItem, updateMenuItem, deleteMenuItem } = useAdmin();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    shortDescription: '',
    description: '',
    productType: 'FOOD' as 'FOOD' | 'COFFEE' | 'DRINK' | 'BAKERY',
    price: 0,
    categoryId: menuCategories[0]?.id || '',
    isAvailable: true,
    isFeatured: false,
    images: [] as string[]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedCategoryType, setSelectedCategoryType] = useState<'ALL' | 'FOOD' | 'COFFEE' | 'DRINK' | 'BAKERY' | 'SPECIAL'>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [unavailablePage, setUnavailablePage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  // Filter items by availability and optionally by category type
  const allAvailable = menuItems.filter(item => item.isAvailable);
  const allUnavailable = menuItems.filter(item => !item.isAvailable);

  const categoryFilterIds = selectedCategoryType === 'ALL'
    ? null
    : (menuCategories && menuCategories.length > 0
      ? new Set(menuCategories.filter((c: any) => c.type === selectedCategoryType).map((c: any) => String(c.id)))
      : null);

  const filteredItems = allAvailable.filter(item => !categoryFilterIds || categoryFilterIds.has(String(item.categoryId)));
  const unavailableItems = allUnavailable.filter(item => !categoryFilterIds || categoryFilterIds.has(String(item.categoryId)));
  const showEmptyState = filteredItems.length === 0 && unavailableItems.length === 0;

  const pagedItems = filteredItems.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const pagedUnavailableItems = unavailableItems.slice(unavailablePage * ITEMS_PER_PAGE, (unavailablePage + 1) * ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const unavailablePageCount = Math.ceil(unavailableItems.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    if (currentPage >= pageCount && pageCount > 0) {
      setCurrentPage(pageCount - 1);
    }
  }, [currentPage, pageCount]);

  React.useEffect(() => {
    if (unavailablePage >= unavailablePageCount && unavailablePageCount > 0) {
      setUnavailablePage(unavailablePageCount - 1);
    }
  }, [unavailablePage, unavailablePageCount]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
      setUploadError(null);
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    
    try {
      const response = await apiService.uploadMenuItemImages(files);
      const rawUrls = (response.data && response.data.urls) || [];
      const urls = rawUrls
        .map((u: any) => (typeof u === 'string' ? u : u.secure_url || u.url || ''))
        .filter(Boolean);
      
      if (urls.length === 0) {
        throw new Error('No URLs returned from image upload');
      }
      
      return urls;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload images. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      setUploadError(null);

      // Validate form
      if (!newItem.name.trim()) {
        setUploadError('Menu item name is required');
        setUploading(false);
        return;
      }

      // Upload new images if any
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        uploadedUrls = await uploadImagesToCloudinary(imageFiles);
      }

      // Combine uploaded images with existing images
      const allImages = [...uploadedUrls, ...newItem.images];
      
      const image = allImages[0] || '';
      const images = allImages;
      const itemToSave = {
        ...newItem,
        image,
        images
      };

      if (editingItem) { 
        await updateMenuItem(editingItem.id, itemToSave); 
        setEditingItem(null); 
      } else { 
        await addMenuItem(itemToSave); 
      }
      
      // Reset form
      setShowAddModal(false);
      setNewItem({ name: '', shortDescription: '', description: '', productType: 'FOOD', price: 0, categoryId: menuCategories[0]?.id || '', isAvailable: true, isFeatured: false, images: [] });
      setImageFiles([]);
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      setUploadError(error.message || 'Failed to save menu item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Menu Management</h1><p className="text-gray-500 mt-1">Manage your restaurant menu items</p></div>
        <button onClick={() => setShowAddModal(true)} className="bg-[#BF2201] text-white px-4 py-2 rounded-lg hover:bg-[#a01800] transition-colors">Add Menu Item</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Categories</h2>
        <div className="flex flex-wrap gap-2">
          {menuCategories.map((cat: any) => (<span key={cat.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{cat.name}</span>))}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Category Type</label>
          <select
            value={selectedCategoryType}
            onChange={(e) => {
              setSelectedCategoryType(e.target.value as any);
              setCurrentPage(0);
              setUnavailablePage(0);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">All</option>
            <option value="FOOD">Food</option>
            <option value="COFFEE">Coffee</option>
            <option value="DRINK">Drink</option>
            <option value="BAKERY">Bakery</option>
            <option value="SPECIAL">Special</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-semibold text-gray-900">Available Items</h2></div>
        <div className="overflow-x-auto">
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50"><tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedItems.length > 0 && pagedItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.shortDescription && <div className="text-sm text-gray-500">{item.shortDescription}</div>}
                      {!item.shortDescription && item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{menuCategories.find((c: any) => c.id === item.categoryId)?.name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.price.toLocaleString()} Rwf</td>
                    <td className="px-6 py-4">{item.isFeatured && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Featured</span>}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button onClick={() => {
                          const existingImages = item.images && item.images.length > 0 ? item.images : [];
                          const mergedImages = item.image && !existingImages.includes(item.image)
                            ? [item.image, ...existingImages]
                            : existingImages;
                          const itemToEdit = {
                            ...item,
                            images: mergedImages
                          };
                          setEditingItem(itemToEdit);
                          setNewItem({ ...itemToEdit });
                          setShowAddModal(true);
                        }} className="text-[#BF2201] hover:text-[#a01800] font-medium">Edit</button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this menu item?')) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pagedItems.length === 0 && (
                  <tr className="bg-white">
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      {showEmptyState ? 'No menu items found. Add items to see them here.' : 'No available items match the selected category filter.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
            <span>{filteredItems.length} available item{filteredItems.length === 1 ? '' : 's'}</span>
            {pageCount > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {currentPage + 1} of {pageCount}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, Math.max(pageCount - 1, 0)))}
                  disabled={currentPage >= pageCount - 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {unavailableItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-semibold text-gray-900">Unavailable Items</h2></div>
          <div className="overflow-x-auto">
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
              <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedUnavailableItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="font-medium text-gray-900">{item.name}</div><div className="text-sm text-gray-500">{item.description}</div></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.price.toLocaleString()} RWF</td>
                    <td className="px-6 py-4 text-sm">
                      <button onClick={() => updateMenuItem(item.id, { isAvailable: true })} className="text-green-600 hover:text-green-800 font-medium">Make Available</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
            <span>{unavailableItems.length} unavailable item{unavailableItems.length === 1 ? '' : 's'}</span>
            {unavailablePageCount > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUnavailablePage((page) => Math.max(page - 1, 0))}
                  disabled={unavailablePage === 0}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {unavailablePage + 1} of {unavailablePageCount}</span>
                <button
                  type="button"
                  onClick={() => setUnavailablePage((page) => Math.min(page + 1, Math.max(unavailablePageCount - 1, 0)))}
                  disabled={unavailablePage >= unavailablePageCount - 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200"><h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" disabled={uploading} className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label><input type="text" disabled={uploading} className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" value={newItem.shortDescription} onChange={(e) => setNewItem({ ...newItem, shortDescription: e.target.value })} placeholder="Brief one-line description" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea disabled={uploading} className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <select disabled={uploading} className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" value={newItem.productType} onChange={(e) => setNewItem({ ...newItem, productType: e.target.value as 'FOOD' | 'COFFEE' | 'DRINK' | 'BAKERY' })}>
                    <option value="FOOD">Food</option>
                    <option value="COFFEE">Coffee</option>
                    <option value="DRINK">Drink</option>
                    <option value="BAKERY">Bakery</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (Rwf)</label><input type="number" step="1" disabled={uploading} className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })} /></div>
              </div>
               <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select disabled={uploading} className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" value={newItem.categoryId} onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}>{menuCategories.map((cat: any) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</select></div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <div className="space-y-2">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    disabled={uploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-gray-500">
                    {imageFiles.length > 0 
                      ? `${imageFiles.length} file(s) selected - will upload when you save` 
                      : 'Images will be uploaded automatically when you save the item'}
                  </p>

                  {/* Preview previously uploaded images */}
                  {newItem.images && newItem.images.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">Uploaded Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {newItem.images.map((url, idx) => (
                          <div key={idx} className="relative">
                            <img src={url} alt={`Upload ${idx + 1}`} className="w-16 h-16 object-cover rounded border border-gray-200" />
                            <button 
                              type="button"
                              onClick={() => setNewItem({ ...newItem, images: newItem.images.filter((_: string, i: number) => i !== idx) })}
                              disabled={uploading}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 disabled:opacity-50"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview selected files to be uploaded */}
                  {imageFiles.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-600 mb-2">Files to Upload:</p>
                      <div className="space-y-1">
                        {Array.from(imageFiles).map((file, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center justify-between bg-blue-50 p-2 rounded">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                              disabled={uploading}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{uploadError}</p>
                </div>
              )}

              <div className="flex items-center space-x-4">
                 <label className="flex items-center"><input type="checkbox" checked={newItem.isAvailable} onChange={(e) => setNewItem({ ...newItem, isAvailable: e.target.checked })} disabled={uploading} className="rounded text-[#BF2201] focus:ring-[#BF2201] disabled:opacity-50" /><span className="ml-2 text-sm text-gray-700">Available</span></label>
                 <label className="flex items-center"><input type="checkbox" checked={newItem.isFeatured} onChange={(e) => setNewItem({ ...newItem, isFeatured: e.target.checked })} disabled={uploading} className="rounded text-[#BF2201] focus:ring-[#BF2201] disabled:opacity-50" /><span className="ml-2 text-sm text-gray-700">Featured</span></label>
               </div>
               <div className="flex justify-end space-x-2 pt-4">
                 <button onClick={() => { setShowAddModal(false); setEditingItem(null); setUploadError(null); }} disabled={uploading} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                 <button onClick={handleSave} disabled={uploading || !newItem.name.trim()} className="px-4 py-2 bg-[#BF2201] text-white rounded-lg hover:bg-[#a01800] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                   {uploading ? (
                     <>
                       <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       {imageFiles.length > 0 ? 'Uploading Images...' : 'Saving...'}
                     </>
                   ) : (
                     editingItem ? 'Save Changes' : 'Add Item'
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
};

export default MenuManagement;
