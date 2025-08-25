import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [totalStats, recentBatches, materialUsage] = await Promise.all([
      // Total production statistics
      prisma.productionBatch.aggregate({
        _sum: {
          quantity: true,
          totalCost: true,
        },
        _count: {
          id: true,
        },
      }),

      // Last 10 production batches
      prisma.productionBatch.findMany({
        take: 10,
        include: {
          recipe: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      // Material usage statistics (if we want to track this later)
      Promise.resolve([]), // Placeholder for future expansion
    ]);

    const productionData = {
      totalItemsProduced: totalStats._sum.quantity || 0,
      totalMaterialsCost: totalStats._sum.totalCost || 0,
      totalBatches: totalStats._count.id || 0,
      averageCostPerItem: totalStats._sum.quantity ? Math.round((totalStats._sum.totalCost || 0) / totalStats._sum.quantity) : 0,
      recentBatches: recentBatches.map((batch) => ({
        id: batch.id,
        recipeName: batch.recipe.name,
        quantity: batch.quantity,
        totalCost: batch.totalCost,
        date: batch.createdAt,
        costPerUnit: Math.round(batch.totalCost / batch.quantity),
      })),
      materialUsage, // For future expansion
    };

    return NextResponse.json(productionData);
  } catch (error) {
    console.error('Error fetching production analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch production analytics' }, { status: 500 });
  }
}
