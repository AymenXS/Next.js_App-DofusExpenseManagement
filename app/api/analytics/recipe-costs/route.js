import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// Helper function to calculate current recipe cost
async function calculateRecipeCost(recipeId) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      materials: {
        include: {
          material: {
            include: {
              prices: {
                orderBy: { date: 'desc' },
                take: 1
              }
            }
          }
        }
      }
    }
  })

  if (!recipe) return 0

  let totalCost = 0
  for (const recipeMaterial of recipe.materials) {
    const latestPrice = recipeMaterial.material.prices[0]?.price || 0
    totalCost += latestPrice * recipeMaterial.quantity
  }

  return Math.round(totalCost / recipe.quantity) // Cost per unit
}

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        materials: {
          include: {
            material: true
          }
        }
      }
    })

    // Calculate current costs for all recipes
    const recipeCosts = await Promise.all(
      recipes.map(async (recipe) => {
        const currentCost = await calculateRecipeCost(recipe.id)
        
        return {
          id: recipe.id,
          name: recipe.name,
          currentCost,
          ingredientCount: recipe.materials.length,
          yieldQuantity: recipe.quantity
        }
      })
    )

    // Sort by cost (highest first)
    recipeCosts.sort((a, b) => b.currentCost - a.currentCost)

    return NextResponse.json(recipeCosts)
  } catch (error) {
    console.error('Error fetching recipe costs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe costs' },
      { status: 500 }
    )
  }
}