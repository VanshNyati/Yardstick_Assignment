'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/transactions", label: "Transactions", icon: "💰" },
    { href: "/categories", label: "Categories", icon: "📊" },
    { href: "/budgets", label: "Budgets", icon: "🎯" },
    { href: "/insights", label: "Insights", icon: "📈" },
  ];

  return (
    <div className="flex space-x-1 md:space-x-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-sm md:text-base">{item.icon}</span>
            <span className="hidden sm:inline text-sm md:text-base">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
} 