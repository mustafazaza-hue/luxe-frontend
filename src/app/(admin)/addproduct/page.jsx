'use client';

import ProductForm from '@/components/ProductForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';

export default function AddProductPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--soft-gray)' }}>
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--charcoal)' }}>
                  <FontAwesomeIcon icon={faBox} className="mr-3" style={{ color: 'var(--charcoal)' }} />
                  Add New Product
                </h1>
                <p className="text-gray-600">Create a new furniture product with AR capabilities</p>
              </div>
            </div>
          </div>

          <ProductForm />
        </main>
      </div>
    </div>
  );
}