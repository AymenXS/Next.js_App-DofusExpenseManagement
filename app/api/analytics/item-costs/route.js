import { prisma } from '@/lib/db';
import { calculateItemCost } from '@/lib/calculation';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        ingredients: true,
      },
    });

    const itemCosts = await Promise.all(
      items.map(async (item) => {
        const currentCost = await calculateItemCost(item.id);

        return {
          id: item.id,
          name: item.name,
          currentCost,
          ingredientCount: item.ingredients.length,
          quantity: item.quantity,
        };
      })
    );

    itemCosts.sort((a, b) => b.currentCost - a.currentCost);
    return NextResponse.json(itemCosts);
  } catch (error) {
    console.error('Error fetching item costs:', error);
    return NextResponse.json({ error: 'Failed to fetch item costs' }, { status: 500 });
  }
}
