"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/broken', label: 'Fix Broken', icon: '🔧' },
    { href: '/unused', label: 'Sell Unused', icon: '📱' },
    { href: '/buy', label: 'Buy', icon: '🛒' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-md"> {/* Added container and max-width */}
        <div className="flex justify-between"> {/* Changed to justify-between */}
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                pathname === item.href ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}