import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Utility function to calculate batch cost
async function calculateBatchCost(recipeId, batchQuantity, productionDate) {
  // Convert recipeId to integer
  const parsedRecipeId = parseInt(recipeId);

  // Validate that recipeId is a valid number
  if (isNaN(parsedRecipeId)) {
    throw new Error('Invalid recipe ID provided');
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: parsedRecipeId }, // ← Use parsed integer here
    include: {
      materials: {
        include: {
          material: {
            include: {
              prices: {
                where: {
                  date: {
                    lte: productionDate, // Prices on or before production date
                  },
                },
                orderBy: { date: 'desc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!recipe) throw new Error('Recipe not found');

  let totalCost = 0;

  for (const recipeMaterial of recipe.materials) {
    const latestPrice = recipeMaterial.material.prices[0]?.price || 0;
    totalCost += latestPrice * recipeMaterial.quantity;
  }

  // Calculate cost per unit and multiply by batch quantity
  const unitCost = totalCost / recipe.quantity;
  return Math.round(unitCost * batchQuantity); // Round to whole Kamas
}

export async function GET() {
  try {
    const batches = await prisma.productionBatch.findMany({
      include: {
        recipe: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Last 50 production runs
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('Error fetching production history:', error);
    return NextResponse.json({ error: 'Failed to fetch production history' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { recipeId, quantity, date } = await request.json();

    if (!recipeId || !quantity) {
      return NextResponse.json({ error: 'Recipe and quantity are required' }, { status: 400 });
    }

    const productionDate = date ? new Date(date) : new Date();
    const totalCost = await calculateBatchCost(recipeId, quantity, productionDate);

    const batch = await prisma.productionBatch.create({
      data: {
        recipeId: parseInt(recipeId),
        quantity: parseInt(quantity),
        totalCost,
        date: productionDate,
      },
      include: {
        recipe: true,
      },
    });

    return NextResponse.json(batch);
  } catch (error) {
    console.error('Error creating production batch:', error);
    return NextResponse.json({ error: error.message || 'Failed to create production batch' }, { status: 500 });
  }
}
