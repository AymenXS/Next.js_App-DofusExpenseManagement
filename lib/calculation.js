async function calculateItemCost(itemId, date = new Date()) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      ingredients: true,
    },
  });

  let totalCost = 0;

  for (const ingredient of item.ingredients) {
    if (ingredient.ingredientType === 'RAW_MATERIAL') {
      // Get latest raw material price
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
      totalCost += (material.prices[0]?.price || 0) * ingredient.quantity;
    } else {
      // Recursive call for item ingredients
      const ingredientCost = await calculateItemCost(ingredient.ingredientId, date);
      totalCost += ingredientCost * ingredient.quantity;
    }
  }

  return Math.round(totalCost / item.yieldQuantity);
}
