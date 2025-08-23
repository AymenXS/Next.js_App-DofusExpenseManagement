'use client';
import { useState } from 'react';
import { useRecipes } from '@/context/RecipesContext';
import { useMaterials } from '@/context/MaterialsContext';

export default function AddRecipeForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ingredients, setIngredients] = useState([{ materialId: '', quantity: 1 }]);

  const { materials, loading: materialsLoading } = useMaterials();
  const { addRecipe, isAdding } = useRecipes();

  const addIngredient = () => {
    setIngredients([...ingredients, { materialId: '', quantity: 1 }]);
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
    const validIngredients = ingredients.filter((ing) => ing.materialId && ing.quantity > 0);

    if (!name || validIngredients.length === 0) {
      alert('Please provide a recipe name and at least one ingredient');
      return;
    }

    const result = await addRecipe({
      name,
      quantity,
      materials: validIngredients,
    });

    if (result.success) {
      setName('');
      setQuantity(1);
      setIngredients([{ materialId: '', quantity: 1 }]);
      alert('Recipe created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (materialsLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add New Recipe</h2>
        <div className="text-center py-8">Loading materials...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Recipe</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Recipe Name</label>
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
                  value={ingredient.materialId}
                  onChange={(e) => updateIngredient(index, 'materialId', e.target.value)}
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
          {isAdding ? 'Creating Recipe...' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}
