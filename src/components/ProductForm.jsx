'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCloudUploadAlt, 
  faImage, 
  faTimes, 
  faCube,
  faBox
} from '@fortawesome/free-solid-svg-icons';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { useForm } from 'react-hook-form';

export default function ProductForm() {
  const [arEnabled, setArEnabled] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [specifications, setSpecifications] = useState([
    { name: 'Width', value: '84 inches' },
    { name: 'Height', value: '32 inches' },
    { name: 'Depth', value: '36 inches' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log('Product data:', data);
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { name: '', value: '' }]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Milano Luxury Sofa"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('name', { required: 'Product name is required' })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>SKU *</label>
              <input
                type="text"
                placeholder="e.g. MLN-SOF-001"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('sku', { required: 'SKU is required' })}
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Description *</label>
            <textarea
              rows={4}
              placeholder="Detailed product description..."
              className="form-input"
              style={{
                '--ring-color': 'var(--luxury-gold)'
              }}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Category *</label>
              <select 
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('category', { required: 'Category is required' })}
                defaultValue=""
              >
                <option value="">Select Category</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Dining Room">Dining Room</option>
                <option value="Office">Office</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Material</label>
              <input
                type="text"
                placeholder="e.g. Italian Leather"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('material')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Brand</label>
              <input
                type="text"
                placeholder="e.g. Milano Collection"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('brand')}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>Pricing & Stock</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="2499.00"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Sale Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="1999.00"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('salePrice')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Stock Quantity *</label>
              <input
                type="number"
                placeholder="25"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('stockQuantity', { 
                  required: 'Stock quantity is required',
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
              />
              {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity.message}</p>}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>Specifications</h2>
            <button 
              type="button" 
              onClick={handleAddSpecification}
              className="font-medium flex items-center space-x-2 transition-colors"
              style={{ color: 'var(--luxury-gold)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--luxury-copper)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--luxury-gold)'}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Specification</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Specification name"
                  value={spec.name}
                  onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                  className="form-input"
                  style={{
                    '--ring-color': 'var(--luxury-gold)'
                  }}
                />
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    className="form-input"
                    style={{
                      '--ring-color': 'var(--luxury-gold)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(index)}
                    className="px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>Product Images</h2>
          
          <div className="file-upload-area rounded-lg p-8 text-center mb-6">
            <div className="space-y-4">
              <div className="text-4xl" style={{ color: 'var(--luxury-gold)' }}>
                <FontAwesomeIcon icon={faCloudUploadAlt} />
              </div>
              <div>
                <p className="font-medium" style={{ color: 'var(--charcoal)' }}>Drop images here or click to browse</p>
                <p className="text-gray-500 text-sm mt-1">Support: JPG, PNG, WebP (Max 5MB each)</p>
              </div>
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
              />
              <label htmlFor="image-upload" className="btn-primary cursor-pointer inline-block">
                Choose Files
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder for uploaded images */}
            <div className="relative group">
              <div className="aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
                   style={{ backgroundColor: 'var(--warm-beige)' }}>
                <FontAwesomeIcon icon={faImage} className="text-gray-400 text-2xl" />
              </div>
              <button type="button" className="absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: '#EF4444', color: 'white' }}>
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* AR Files */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>AR Files</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm" style={{ color: 'var(--charcoal)' }}>Enable AR</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={arEnabled}
                  onChange={(e) => setArEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer"
                     style={{
                       '--focus-ring-color': 'var(--luxury-gold)',
                       '--checked-bg': 'var(--luxury-gold)'
                     }}>
                  <style jsx>{`
                    .peer:focus {
                      --tw-ring-color: var(--focus-ring-color);
                      --tw-ring-opacity: 0.2;
                    }
                    .peer:checked {
                      background-color: var(--checked-bg);
                    }
                    .peer:checked::after {
                      transform: translateX(1.25rem);
                    }
                  `}</style>
                </div>
              </label>
            </div>
          </div>
          
          {arEnabled && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>GLB File (Android/Web)</label>
                <div className="file-upload-area rounded-lg p-6 text-center">
                  <FontAwesomeIcon icon={faCube} className="text-3xl mb-2" style={{ color: 'var(--luxury-gold)' }} />
                  <p className="font-medium" style={{ color: 'var(--charcoal)' }}>Upload GLB file</p>
                  <p className="text-gray-500 text-sm">Max 10MB</p>
                  <button type="button" className="mt-3 text-sm font-semibold transition-colors rounded-lg px-4 py-2"
                          style={{ backgroundColor: 'var(--luxury-gold)', color: 'white' }}
                          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}>
                    Choose GLB File
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>USDZ File (iOS)</label>
                <div className="file-upload-area rounded-lg p-6 text-center">
                  <FontAwesomeIcon icon={faApple} className="text-3xl mb-2" style={{ color: 'var(--luxury-gold)' }} />
                  <p className="font-medium" style={{ color: 'var(--charcoal)' }}>Upload USDZ file</p>
                  <p className="text-gray-500 text-sm">Max 10MB</p>
                  <button type="button" className="mt-3 text-sm font-semibold transition-colors rounded-lg px-4 py-2"
                          style={{ backgroundColor: 'var(--luxury-gold)', color: 'white' }}
                          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}>
                    Choose USDZ File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Form */}
      <div className="space-y-6">
        {/* Product Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--charcoal)' }}>Product Status</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Status *</label>
              <select 
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('status', { required: 'Status is required' })}
                defaultValue="Draft"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Visibility *</label>
              <select 
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('visibility', { required: 'Visibility is required' })}
                defaultValue="Public"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Password Protected">Password Protected</option>
              </select>
              {errors.visibility && <p className="text-red-500 text-sm mt-1">{errors.visibility.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Featured Product</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer"
                     style={{
                       '--focus-ring-color': 'var(--luxury-gold)',
                       '--checked-bg': 'var(--luxury-gold)'
                     }}>
                  <style jsx>{`
                    .peer:focus {
                      --tw-ring-color: var(--focus-ring-color);
                      --tw-ring-opacity: 0.2;
                    }
                    .peer:checked {
                      background-color: var(--checked-bg);
                    }
                    .peer:checked::after {
                      transform: translateX(1.25rem);
                    }
                  `}</style>
                </div>
                <span className="ml-3 text-sm" style={{ color: 'var(--charcoal)' }}>Show in featured section</span>
              </label>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--charcoal)' }}>SEO Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Meta Title</label>
              <input
                type="text"
                placeholder="SEO optimized title"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('metaTitle')}
              />
              <p className="text-xs text-gray-500 mt-1">0/60 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Meta Description</label>
              <textarea
                rows={3}
                placeholder="SEO meta description"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('metaDescription')}
              />
              <p className="text-xs text-gray-500 mt-1">0/160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>URL Slug</label>
              <input
                type="text"
                placeholder="product-url-slug"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('urlSlug')}
              />
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--charcoal)' }}>Shipping Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                placeholder="75"
                className="form-input"
                style={{
                  '--ring-color': 'var(--luxury-gold)'
                }}
                {...register('weight')}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Length (in)</label>
                <input
                  type="number"
                  placeholder="84"
                  className="form-input text-sm"
                  style={{
                    '--ring-color': 'var(--luxury-gold)'
                  }}
                  {...register('length')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Width (in)</label>
                <input
                  type="number"
                  placeholder="36"
                  className="form-input text-sm"
                  style={{
                    '--ring-color': 'var(--luxury-gold)'
                  }}
                  {...register('width')}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--charcoal)' }}>Height (in)</label>
                <input
                  type="number"
                  placeholder="32"
                  className="form-input text-sm"
                  style={{
                    '--ring-color': 'var(--luxury-gold)'
                  }}
                  {...register('height')}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4"
                  style={{ color: 'var(--luxury-gold)' }}
                  {...register('requiresSpecialShipping')}
                />
                <span className="text-sm" style={{ color: 'var(--charcoal)' }}>Requires special shipping</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 rounded-lg font-semibold transition-colors py-2"
              style={{ backgroundColor: 'var(--luxury-gold)', color: 'white' }}
              onMouseEnter={(e) => !isSubmitting && (e.target.style.opacity = '0.9')}
              onMouseLeave={(e) => !isSubmitting && (e.target.style.opacity = '1')}
            >
              <FontAwesomeIcon icon={faBox} />
              <span>{isSubmitting ? 'Creating Product...' : 'Create Product'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => alert('Saved as draft!')}
              className="w-full btn-secondary"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}