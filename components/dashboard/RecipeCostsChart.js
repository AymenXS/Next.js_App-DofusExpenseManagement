'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/context/AnalyticsContext';

export default function RecipeCostsChart() {
  const { recipeCosts, loading } = useAnalytics();

  if (loading.recipeCosts) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-80 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (recipeCosts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-80 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🍳</div>
          <p>No recipes available yet</p>
          <p className="text-sm">Create recipes to see cost analysis</p>
        </div>
      </div>
    );
  }

  // Take top 10 most expensive recipes
  const topRecipes = recipeCosts.slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Costs (Top 10)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topRecipes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}K`} />
            <Tooltip formatter={(value) => [`${value} Kamas`, 'Cost per Unit']} labelFormatter={(label) => `Recipe: ${label}`} />
            <Legend />
            <Bar dataKey="currentCost" name="Cost per Unit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
