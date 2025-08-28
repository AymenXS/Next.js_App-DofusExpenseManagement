'use client';
import { useProduction } from '@/context/ProductionContext';

export default function ProductionHistory() {
  const { batches, loading, error } = useProduction();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Production History</h2>
        <div className="text-center py-8">Loading production history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Production History</h2>
        <div className="text-center py-8 text-red-500">Error loading production history</div>
      </div>
    );
  }

  if (!batches) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Production History</h2>
        <div className="text-center py-8 text-gray-500">No production data available</div>
      </div>
    );
  }

  // Calculate totals for summary
  const totalStats = batches.reduce(
    (acc, batch) => ({
      totalRevenue: acc.totalRevenue + (batch.sellingPrice || 0) * batch.quantity,
      totalCost: acc.totalCost + (batch.totalCost || 0),
      totalProfit: acc.totalProfit + (batch.expectedProfit || 0),
      totalBatches: acc.totalBatches + 1,
      totalItems: acc.totalItems + batch.quantity,
    }),
    { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalBatches: 0, totalItems: 0 }
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Production History ({batches.length})</h2>
      </div>

      {/* Summary Stats */}
      {batches.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{totalStats.totalBatches}</div>
              <div className="text-gray-600 text-xs">Batches</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{totalStats.totalItems}</div>
              <div className="text-gray-600 text-xs">Items</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{totalStats.totalRevenue.toLocaleString()}</div>
              <div className="text-gray-600 text-xs">Revenue</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{totalStats.totalCost.toLocaleString()}</div>
              <div className="text-gray-600 text-xs">Cost</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${totalStats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalStats.totalProfit.toLocaleString()}
              </div>
              <div className="text-gray-600 text-xs">Profit</div>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y">
        {batches.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">⚡</div>
            <p>No production batches yet</p>
            <p className="text-sm">Start producing to see your activity</p>
          </div>
        ) : (
          batches.map((batch) => {
            const profit = batch.expectedProfit || 0;
            const profitMargin = batch.totalCost > 0 ? (profit / batch.totalCost) * 100 : 0;

            return (
              <div key={batch.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-blue-600">{batch.item?.name || 'Unknown Item'}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Produced: {new Date(batch.date).toLocaleDateString()} • {batch.quantity} units
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      {/* Cost */}
                      <div>
                        <span className="text-gray-700">Total Cost:</span>
                        <div className="text-gray-900 font-medium">{(batch.totalCost || 0).toLocaleString()} Kamas</div>
                        <div className="text-xs text-gray-500">
                          {batch.quantity > 0 ? Math.round((batch.totalCost || 0) / batch.quantity).toLocaleString() : 0} Kamas/unit
                        </div>
                      </div>

                      {/* Revenue */}
                      <div>
                        <span className="text-gray-700">Revenue:</span>
                        <div className="text-gray-900 font-medium">
                          {((batch.sellingPrice || 0) * batch.quantity).toLocaleString()} Kamas
                        </div>
                        <div className="text-xs text-gray-500">{(batch.sellingPrice || 0).toLocaleString()} Kamas/unit</div>
                      </div>

                      {/* Profit */}
                      <div>
                        <span className="text-gray-700">Profit:</span>
                        <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(profit).toLocaleString()} Kamas
                        </div>
                        <div className={`text-xs ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {profit >= 0 ? 'Profit' : 'Loss'}
                        </div>
                      </div>

                      {/* Profit Margin */}
                      <div>
                        <span className="text-gray-700">Margin:</span>
                        <div className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(profitMargin).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">{profit >= 0 ? 'ROI' : 'Loss'}</div>
                      </div>

                      {/* Efficiency */}
                      <div>
                        <span className="text-gray-700">Efficiency:</span>
                        <div className="text-gray-900 font-medium">{batch.quantity} units</div>
                        <div className="text-xs text-gray-500">Batch</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
