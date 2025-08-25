'use client';
import { useAnalytics } from '@/context/AnalyticsContext';

export default function OverviewCards() {
  const { overview, loading } = useAnalytics();

  if (loading.overview) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Materials',
      value: overview.totalMaterials || 0,
      icon: '📦',
      color: 'blue',
    },
    {
      title: 'Total Recipes',
      value: overview.totalRecipes || 0,
      icon: '📋',
      color: 'green',
    },
    {
      title: 'Production Batches',
      value: overview.totalBatches || 0,
      icon: '⚡',
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[card.color]}`}>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
