import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get all materials with their price history
    const materialsWithPrices = await prisma.rawMaterial.findMany({
      include: {
        prices: {
          orderBy: {
            date: 'asc'
          },
          take: 30 // Last 30 price entries per material
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Format data for charts
    const priceTrends = materialsWithPrices.map(material => ({
      material: material.name,
      data: material.prices.map(price => ({
        date: price.date.toISOString().split('T')[0], // YYYY-MM-DD
        price: price.price,
        fullDate: price.date
      }))
    })).filter(material => material.data.length > 0) // Only include materials with price history

    return NextResponse.json(priceTrends)
  } catch (error) {
    console.error('Error fetching price trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price trends' },
      { status: 500 }
    )
  }
}