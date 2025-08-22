'use client';
import { createContext, useContext } from 'react';
import useSWR from 'swr';

const MaterialsContext = createContext();

const fetcher = (url) => fetch(url).then((res) => res.json());

export function MaterialsProvider({ children }) {
  const {
    data: materials,
    error,
    mutate,
  } = useSWR('/api/materials', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const addMaterial = async (materialData) => {
    const response = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialData),
    });

    if (response.ok) {
      mutate(); // Refresh the materials list
    }

    return response;
  };

  const updatePrice = async (materialId, priceData) => {
    const response = await fetch(`/api/materials/${materialId}/price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(priceData),
    });

    if (response.ok) {
      mutate(); // Refresh the materials list
    }

    return response;
  };

  const value = {
    materials: materials || [],
    loading: !error && !materials,
    error,
    addMaterial,
    updatePrice,
    refresh: mutate,
  };

  return <MaterialsContext.Provider value={value}>{children}</MaterialsContext.Provider>;
}

export const useMaterials = () => {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error('useMaterials must be used within MaterialsProvider');
  }
  return context;
};
