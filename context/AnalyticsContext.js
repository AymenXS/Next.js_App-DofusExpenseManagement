'use client'
import { createContext, useContext } from 'react'
import useSWR from 'swr'

const AnalyticsContext = createContext()

const fetcher = (url) => fetch(url).then(res => res.json())

export function AnalyticsProvider({ children }) {
  // Fetch all analytics data
  const { data: overview, error: overviewError, mutate: refreshOverview } = useSWR('/api/analytics/overview', fetcher, {
    refreshInterval: 30000 
  })
  
  const { data: priceTrends, error: priceTrendsError, mutate: refreshPriceTrends } = useSWR('/api/analytics/price-trends', fetcher)
  
  const { data: recipeCosts, error: recipeCostsError, mutate: refreshRecipeCosts } = useSWR('/api/analytics/recipe-costs', fetcher)
  
  const { data: production, error: productionError, mutate: refreshProduction } = useSWR('/api/analytics/production', fetcher)

  // Refresh all analytics data
  const refreshAll = () => {
    refreshOverview()
    refreshPriceTrends()
    refreshRecipeCosts()
    refreshProduction()
  }

  const value = {
    overview: overview || {},
    priceTrends: priceTrends || [],
    recipeCosts: recipeCosts || [],
    production: production || {},
    loading: {
      overview: !overviewError && !overview,
      priceTrends: !priceTrendsError && !priceTrends,
      recipeCosts: !recipeCostsError && !recipeCosts,
      production: !productionError && !production
    },
    error: {
      overview: overviewError,
      priceTrends: priceTrendsError,
      recipeCosts: recipeCostsError,
      production: productionError
    },
    refreshAll
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}