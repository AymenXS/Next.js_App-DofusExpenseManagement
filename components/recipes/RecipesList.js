'use client';
import { useRecipes } from '@/context/RecipesContext';

export default function RecipesList() {
  const { recipes, loading, error } = useRecipes();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recipes</h2>
        <div className="text-center py-8">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recipes</h2>
        <div className="text-center py-8 text-red-500">Error loading recipes</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Recipes ({recipes.length})</h2>
      </div>

      <div className="divide-y">
        {recipes.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">No recipes yet. Create your first recipe!</div>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-blue-600">{recipe.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Yield: {recipe.yieldQuantity} item(s)</p>

                  <div className="space-y-1">
                    {recipe.materials.map((rm) => (
                      <div key={rm.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{rm.material.name}</span>
                        <span className="text-gray-900 font-medium">{rm.quantity} unit(s)</span>
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
