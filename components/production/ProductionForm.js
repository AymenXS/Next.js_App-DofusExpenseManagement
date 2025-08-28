'use client';
import { useState } from 'react';
import { useProduction } from '@/context/ProductionContext';
import { useItems } from '@/context/ItemsContext';

export default function ProductionForm() {
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState(''); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { produceBatch, isProducing } = useProduction();
  const { items, loading } = useItems();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemId || !quantity || !sellingPrice) {
      alert('Please select an item, quantity, and selling price');
      return;
    }

    const result = await produceBatch({
      itemId,
      quantity: parseInt(quantity),
      sellingPrice: parseInt(sellingPrice),
      date,
    });

    if (result.success) {
      setItemId('');
      setQuantity(1);
      setSellingPrice('');
      alert('Production batch created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Produce Batch</h2>
        <div className="text-center py-8">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Produce Batch</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Item</label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity input */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Selling Price input (ADD THIS) */}
        <div>
          <label className="block text-sm font-medium mb-1">Selling Price (Kamas)</label>
          <input
            type="number"
            min="1"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Date input */}
        <div>
          <label className="block text-sm font-medium mb-1">Production Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isProducing}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isProducing ? 'Producing...' : 'Produce Batch'}
        </button>
      </form>
    </div>
  );
}
