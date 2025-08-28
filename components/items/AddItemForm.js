'use client';
import { useState } from 'react';
import { useMaterials } from '@/context/MaterialsContext';
import { useItems } from '@/context/ItemsContext';

export default function AddItemForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState([
    {
      ingredientId: '',
      ingredientType: 'RAW_MATERIAL',
      quantity: 1,
    },
  ]);

  const { materials, loading: materialsLoading } = useMaterials();
  const { addItem, isAdding } = useItems();

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientId: '', ingredientType: 'RAW_MATERIAL', quantity: 1 }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
    setIngredients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty ingredients
    const validIngredients = ingredients.filter((ingredient) => ingredient.ingredientId && ingredient.quantity > 0);

    if (!name || validIngredients.length === 0) {
      alert('Please provide a item name and at least one ingredient');
      return;
    }

    // Transform the data to match API expectations
    const formattedData = {
      name,
      quantity: parseInt(quantity) || 1,
      ingredients: validIngredients.map((ing) => ({
        ingredientId: parseInt(ing.ingredientId),
        ingredientType: 'RAW_MATERIAL',
        quantity: parseInt(ing.quantity) || 1,
      })),
    };

    const result = await addItem(formattedData);

    if (result.success) {
      setName('');
      setQuantity(1);
      setIngredients([{ ingredientId: '', ingredientType: 'RAW_MATERIAL', quantity: 1 }]);
      alert('Item created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (materialsLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <div className="text-center py-8">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Magic Bread"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ingredients</label>
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-start">
                <select
                  value={ingredient.ingredientId}
                  onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Material</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Qty"
                />

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={ingredients.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            + Add Ingredient
          </button>
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isAdding ? 'Creating Item...' : 'Create Item'}
        </button>
      </form>
    </div>
  );
}
