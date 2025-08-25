import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalMaterials, totalRecipes, totalBatches, recentBatches] = await Promise.all([
      // Total materials count
      prisma.rawMaterial.count(),

      // Total recipes count
      prisma.recipe.count(),

      // Total production batches
      prisma.productionBatch.count(),

      // Recent production batches (last 5)
      prisma.productionBatch.findMany({
        take: 5,
        include: {
          recipe: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const overviewData = {
      totalMaterials,
      totalRecipes,
      totalBatches,
      recentBatches: recentBatches.map((batch) => ({
        id: batch.id,
        recipeName: batch.recipe.name,
        quantity: batch.quantity,
        totalCost: batch.totalCost,
        date: batch.createdAt,
      })),
    };

    return NextResponse.json(overviewData);
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch overview data' }, { status: 500 });
  }
}
