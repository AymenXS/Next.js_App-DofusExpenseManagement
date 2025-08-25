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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold">Production History ({batches.length})</h2>
      </div>

      <div className="divide-y">
        {batches.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">No production batches yet. Create your first batch!</div>
        ) : (
          batches.map((batch) => (
            <div key={batch.id} className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-green-600">{batch.recipe.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Produced: {new Date(batch.date).toLocaleDateString()}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-700">Quantity:</span>
                      <span className="ml-2 text-gray-900 font-medium">{batch.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Total Cost:</span>
                      <span className="ml-2 text-gray-900 font-medium">{batch.totalCost.toLocaleString()} Kamas</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Cost per Unit:</span>
                      <span className="ml-2 text-gray-900 font-medium">
                        {Math.round(batch.totalCost / batch.quantity).toLocaleString()} Kamas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
