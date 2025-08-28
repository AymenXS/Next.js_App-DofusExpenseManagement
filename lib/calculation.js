import { prisma } from './db';

const costCache = new Map();

export async function calculateItemCost(itemId, date = new Date()) {
  const cacheKey = `${itemId}-${date.toISOString().split('T')[0]}`;

  if (costCache.has(cacheKey)) {
    return costCache.get(cacheKey);
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      ingredients: true,
    },
  });

  if (!item) {
    throw new Error(`Item with ID ${itemId} not found`);
  }

  let totalCost = 0;

  for (const ingredient of item.ingredients) {
    let ingredientCost = 0;

    if (ingredient.ingredientType === 'RAW_MATERIAL') {
      const material = await prisma.rawMaterial.findUnique({
        where: { id: ingredient.ingredientId },
        include: {
          prices: {
            where: { date: { lte: date } },
            orderBy: { date: 'desc' },
            take: 1,
          },
        },
      });

      if (!material) {
        throw new Error(`Raw material with ID ${ingredient.ingredientId} not found`);
      }

      ingredientCost = material.prices[0]?.price || 0;
    } else if (ingredient.ingredientType === 'ITEM') {
      ingredientCost = await calculateItemCost(ingredient.ingredientId, date);
    }

    totalCost += ingredientCost * ingredient.quantity;
  }

  const costPerUnit = Math.round(totalCost / item.quantity);

  costCache.set(cacheKey, costPerUnit);
  return costPerUnit;
}

export function clearCostCache() {
  costCache.clear();
}

export async function calculateMultipleItemCosts(itemIds, date = new Date()) {
  const results = {};

  for (const itemId of itemIds) {
    try {
      results[itemId] = await calculateItemCost(itemId, date);
    } catch (error) {
      console.error(`Error calculating cost for item ${itemId}:`, error);
      results[itemId] = 0;
    }
  }

  return results;
}
