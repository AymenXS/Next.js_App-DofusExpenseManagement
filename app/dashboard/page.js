'use client';
import OverviewCards from '@/components/dashboard/OverviewCards';
import PriceTrendsChart from '@/components/dashboard/PriceTrendsChart';
import RecipeCostsChart from '@/components/dashboard/RecipeCostsChart';
import RecentProduction from '@/components/dashboard/RecentProduction';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dofus Crafting Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your crafting performance and analytics</p>
        </header>

        <OverviewCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PriceTrendsChart />
          <RecipeCostsChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentProduction />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Statistics</h3>
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📈</div>
              <p>More analytics coming soon!</p>
              <p className="text-sm">Profit/loss and efficiency metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
