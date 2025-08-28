'use client';
import { createContext, useContext, useState } from 'react';
import useSWR from 'swr';

const ProductionContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ProductionProvider({ children }) {
  const { data: batches, error, mutate } = useSWR('/api/production', fetcher);
  const [isProducing, setIsProducing] = useState(false);

  const produceBatch = async (batchData) => {
    setIsProducing(true);
    try {
      const response = await fetch('/api/production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchData),
      });

      if (response.ok) {
        mutate();
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to produce batch',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    } finally {
      setIsProducing(false);
    }
  };

  const value = {
    batches: batches || [],
    loading: !error && !batches,
    error,
    isProducing,
    produceBatch,
    refresh: mutate,
  };

  return <ProductionContext.Provider value={value}>{children}</ProductionContext.Provider>;
}

export const useProduction = () => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
};
