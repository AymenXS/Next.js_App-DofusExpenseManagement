'use client';
import { useItems } from '@/context/ItemsContext';

export default function ItemsList() {
  const { items, loading, error } = useItems();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Items</h2>
        <div className="text-center py-8">Loading items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Items</h2>
        <div className="text-center py-8 text-red-500">Error loading items</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Items ({items.length})</h2>
      </div>

      <div className="divide-y">
        {items.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">No items yet. Create your first item!</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-blue-600">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Yield: {item.quantity} item(s)</p>

                  <div className="space-y-1">
                    {item.ingredients.map((itemIngredient) => (
                      <div key={itemIngredient.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{itemIngredient.ingredient?.name}</span>
                        <span className="text-gray-900 font-medium">{itemIngredient.quantity} unit(s)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
