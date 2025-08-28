'use client';
import { createContext, useContext, useState } from 'react';
import useSWR from 'swr';

const ItemsContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

export function ItemsProvider({ children }) {
  const {
    data: items,
    error,
    mutate,
  } = useSWR('/api/items', fetcher, {
    refreshInterval: 30000,
  });

  const [isAdding, setIsAdding] = useState(false);

  const addItem = async (itemData) => {
    setIsAdding(true);
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        mutate();
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to add item',
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
    items: items || [],
    loading: !error && !items,
    error,
    isAdding,
    addItem,
    refresh: mutate,
  };

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within a ItemsProvider');
  }
  return context;
};
