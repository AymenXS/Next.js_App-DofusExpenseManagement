'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Dofus Crafting Manager
          </Link>

          <div className="flex space-x-4">
            <Link
              href="/materials"
              className={`px-3 py-2 rounded-md ${
                pathname === '/materials' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Materials
            </Link>
            <Link
              href="/recipes"
              className={`px-3 py-2 rounded-md ${
                pathname === '/recipes' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recipes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
