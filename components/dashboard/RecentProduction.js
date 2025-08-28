'use client';
import { useAnalytics } from '@/context/AnalyticsContext';

export default function RecentProduction() {
  const { production, loading } = useAnalytics();

  if (loading.production) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Production</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!production.recentBatches || production.recentBatches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Production</h3>
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">⚡</div>
          <p>No production batches yet</p>
          <p className="text-sm">Start producing to see your activity</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.floor((date - new Date()) / (1000 * 60 * 60 * 24)), 'day');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Production</h3>
      <div className="space-y-3">
        {production.recentBatches.slice(0, 5).map((batch) => (
          <div key={batch.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{batch.itemName}</p>
              <p className="text-sm text-gray-500">×{batch.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{batch.totalCost.toLocaleString()} Kamas</p>
              <p className="text-sm text-gray-500">{formatDate(batch.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
