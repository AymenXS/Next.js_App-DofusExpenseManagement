'use client';
import { MaterialsProvider } from '@/context/MaterialsContext';
import { RecipesProvider } from '@/context/RecipesContext';

export function Providers({ children }) {
  return (
    <MaterialsProvider>
      <RecipesProvider>{children}</RecipesProvider>
    </MaterialsProvider>
  );
}

