'use client';
import { createContext, useContext, useState } from 'react';
import useSWR from 'swr';

const RecipesContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

export function RecipesProvider({ children }) {
  const {
    data: recipes,
    error,
    mutate,
  } = useSWR('/api/recipes', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const [isAdding, setIsAdding] = useState(false); // Loading state for UI

  const addRecipe = async (recipeData) => {
    setIsAdding(true);
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        mutate(); // Refresh the recipes list
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to add recipe',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    } finally {
      setIsAdding(false);
    }
  };

  const value = {
    recipes: recipes || [],
    loading: !error && !recipes,
    error,
    isAdding,
    addRecipe,
    refresh: mutate,
  };

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

// ADD THIS: Hook to use the context
export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
};
