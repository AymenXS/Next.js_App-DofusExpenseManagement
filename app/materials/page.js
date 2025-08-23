'use client';
import AddMaterialForm from '@/components/materials/AddMaterialForm';
import MaterialsList from '@/components/materials/MaterialList';

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Raw Materials Management</h1>
          <p className="text-gray-600 mt-2">Add and manage your raw material prices</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <AddMaterialForm />
          <MaterialsList />
        </div>
      </div>
    </div>
  );
}
