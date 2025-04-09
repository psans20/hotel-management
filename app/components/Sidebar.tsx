'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onSelectItem: (item: string) => void;
}

export default function Sidebar({ onSelectItem }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Customer', path: '/customer' },
    { name: 'Booking', path: '/booking' },
    { name: 'Details', path: '/details' },
    { name: 'Report', path: '/report' },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => onSelectItem(item.name)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 