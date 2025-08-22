'use client';
import { useState } from 'react';
import { useMaterials } from '@/context/MaterialsContext';

export default function AddMaterialForm() {
  const [name, setName] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addMaterial } = useMaterials();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await addMaterial({ name, initialPrice });

      if (response.ok) {
        setName('');
        setInitialPrice('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add material');
      }
    } catch (error) {
      alert('Failed to add material');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Raw Material</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Material Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Iron"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Initial Price (Kamas)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={initialPrice}
            onChange={(e) => setInitialPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Material'}
        </button>
      </div>
    </form>
  );
}
