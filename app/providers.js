'use client';
import { MaterialsProvider } from '@/context/MaterialsContext';
import { ItemsProvider } from '@/context/ItemsContext';
import { ProductionProvider } from '@/context/ProductionContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';

export function Providers({ children }) {
  return (
    <MaterialsProvider>
      <ItemsProvider>
        <ProductionProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </ProductionProvider>
      </ItemsProvider>
    </MaterialsProvider>
  );
}
