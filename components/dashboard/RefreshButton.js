'use client';
import { useAnalytics } from '@/context/AnalyticsContext';

export default function RefreshButton() {
  const { refreshAll, loading } = useAnalytics();

  const isLoading = Object.values(loading).some((l) => l);

  return (
    <button
      onClick={refreshAll}
      disabled={isLoading}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>{isLoading ? '🔄' : '↻'}</span>
      <span>{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
    </button>
  );
}
