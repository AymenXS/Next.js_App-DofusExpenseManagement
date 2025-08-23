'use client'
import { RecipesProvider } from '@/context/RecipesContext'
import { MaterialsProvider } from '@/context/MaterialsContext'
import AddRecipeForm from '@/components/recipes/AddRecipeForm'
import RecipesList from '@/components/recipes/RecipesList'

export default function RecipesPage() {
  return (
    <MaterialsProvider>
      <RecipesProvider>
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-6xl mx-auto px-4 space-y-8">
            <header className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Dofus Recipes</h1>
              <p className="text-gray-600 mt-2">Manage your crafting recipes</p>
            </header>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <AddRecipeForm />
              <RecipesList />
            </div>
          </div>
        </div>
      </RecipesProvider>
    </MaterialsProvider>
  )
}