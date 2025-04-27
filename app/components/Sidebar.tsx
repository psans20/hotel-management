'use client';

import Link from 'next/link';

interface SidebarProps {
  onSelectItem: (item: string) => void;
  selectedItem: string;
}

export default function Sidebar({ onSelectItem, selectedItem }: SidebarProps) {
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Customer', path: '/customer' },
    { name: 'Booking', path: '/booking' },
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
                  selectedItem === item.name
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700 cursor-pointer'
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