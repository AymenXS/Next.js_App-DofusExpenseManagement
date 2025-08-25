'use client'
import { MaterialsProvider } from '@/context/MaterialsContext'
import { RecipesProvider } from '@/context/RecipesContext'
import { ProductionProvider } from '@/context/ProductionContext'
import { AnalyticsProvider } from '@/context/AnalyticsContext'

export function Providers({ children }) {
  return (
    <MaterialsProvider>
      <RecipesProvider>
        <ProductionProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </ProductionProvider>
      </RecipesProvider>
    </MaterialsProvider>
  )
}