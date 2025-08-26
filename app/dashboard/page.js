'use client';
import { useAnalytics } from '@/context/AnalyticsContext';
import OverviewCards from '@/components/dashboard/OverviewCards';
import PriceTrendsChart from '@/components/dashboard/PriceTrendsChart';
import RecipeCostsChart from '@/components/dashboard/RecipeCostsChart';
import RecentProduction from '@/components/dashboard/RecentProduction';
// import ProfitLossIndicator from '@/components/dashboard/ProfitLossIndicator'
import RefreshButton from '@/components/dashboard/RefreshButton';
import DashboardLoading from '@/components/dashboard/DashboardLoading';

export default function DashboardPage() {
  const { loading } = useAnalytics();

  // Check if any data is still loading
  const isLoading = Object.values(loading).some((l) => l);

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <header className="text-center">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-3xl font-bold text-gray-900">Dofus Crafting Dashboard</h1>
            <RefreshButton />
          </div>
          <p className="text-gray-600">Track your crafting performance and analytics</p>
        </header>

        <OverviewCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PriceTrendsChart />
          <RecipeCostsChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentProduction />
          {/* <ProfitLossIndicator /> */}
        </div>
      </div>
    </div>
  );
}
