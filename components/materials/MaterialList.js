'use client';
import { useState } from 'react';
import { useMaterials } from '@/context/MaterialsContext';

export default function MaterialsList() {
  const { materials, loading, error, updatePrice } = useMaterials();
  const [updatingPrices, setUpdatingPrices] = useState({});

  const handlePriceUpdate = async (materialId, newPrice) => {
    if (!newPrice) return;

    setUpdatingPrices((prev) => ({ ...prev, [materialId]: true }));

    try {
      const response = await updatePrice(materialId, { price: newPrice });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to update price');
      }
    } catch (error) {
      alert('Failed to update price');
    } finally {
      setUpdatingPrices((prev) => ({ ...prev, [materialId]: false }));
    }
  };

  if (loading) return <div className="text-center py-8">Loading materials...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading materials</div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Current Materials</h2>
      </div>

      <div className="divide-y">
        {materials.map((material) => (
          <div key={material.id} className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{material.name}</h3>
                <p className="text-green-600 font-medium">Current Price: {material.prices[0]?.price.toLocaleString() || '0'} Kamas</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="New price"
                  className="border border-gray-300 rounded-md px-3 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onBlur={(e) => handlePriceUpdate(material.id, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlePriceUpdate(material.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <span className="text-gray-500">Kamas</span>
                {updatingPrices[material.id] && <span className="text-sm text-gray-500">Updating...</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
