import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

async function calculateBatchCost(itemId, batchQuantity, productionDate) {
  const costPerUnit = await calculateItemCost(itemId, productionDate);
  return Math.round(costPerUnit * batchQuantity);
}

export async function GET() {
  try {
    const batches = await prisma.productionOrder.findMany({
      include: {
        item: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('Error fetching production history:', error);
    return NextResponse.json({ error: 'Failed to fetch production history' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { itemId, quantity, sellingPrice, date } = await request.json();

    if (!itemId || !quantity || !sellingPrice) {
      return NextResponse.json({ error: 'Item, quantity, and selling price are required' }, { status: 400 });
    }

    const parsedItemId = parseInt(itemId);
    const parsedQuantity = parseInt(quantity);
    const parsedSellingPrice = parseInt(sellingPrice);

    if (isNaN(parsedItemId) || isNaN(parsedQuantity) || isNaN(parsedSellingPrice)) {
      return NextResponse.json({ error: 'Invalid input values' }, { status: 400 });
    }

    const productionDate = date ? new Date(date) : new Date();
    const totalCost = await calculateBatchCost(parsedItemId, parsedQuantity, productionDate);
    const expectedProfit = parsedSellingPrice * parsedQuantity - totalCost;

    const batch = await prisma.productionOrder.create({
      data: {
        itemId: parsedItemId,
        quantity: parsedQuantity,
        totalCost,
        sellingPrice: parsedSellingPrice,
        expectedProfit,
        date: productionDate,
      },
      include: {
        item: true,
      },
    });

    return NextResponse.json(batch);
  } catch (error) {
    console.error('Error creating production batch:', error);
    return NextResponse.json({ error: error.message || 'Failed to create production batch' }, { status: 500 });
  }
}
