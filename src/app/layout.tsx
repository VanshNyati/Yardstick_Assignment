import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import Navigation from "@/components/shared/Navigation";

export const metadata = {
  title: "Personal Finance Visualizer",
  description: "Track your expenses and visualize your personal finance easily.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="sticky top-0 z-50 p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-md border-b border-gray-200 dark:border-gray-700">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-lg font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="text-2xl">💸</span>
              <span className="hidden sm:inline">Finance Visualizer</span>
              <span className="sm:hidden">FV</span>
            </Link>
            <Navigation />
          </nav>
        </header>
        <main className="max-w-6xl mx-auto py-6 px-4">{children}</main>
      </body>
    </html>
  );
}
