'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/context/AnalyticsContext';

export default function PriceTrendsChart() {
  const { priceTrends, loading } = useAnalytics();

  if (loading.priceTrends) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-80 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (priceTrends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-80 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No price data available yet</p>
          <p className="text-sm">Add material prices to see trends</p>
        </div>
      </div>
    );
  }

  // Prepare data for chart (simplified for demo)
  const chartData = priceTrends.slice(0, 5).flatMap((material) =>
    material.data.map((entry) => ({
      date: entry.date,
      [material.material]: entry.price,
      fullDate: entry.fullDate,
    }))
  );

  // Get unique materials for lines
  const materials = priceTrends.slice(0, 5).map((m) => m.material);

  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Price Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}K`} />
            <Tooltip formatter={(value) => [`${value} Kamas`, 'Price']} labelFormatter={(label) => `Date: ${label}`} />
            <Legend />
            {materials.map((material, index) => (
              <Line
                key={material}
                type="monotone"
                dataKey={material}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
