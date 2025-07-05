'use client';

import React, { useState, useEffect } from 'react';
import { getTransactions } from '@/actions/transactions';
import Link from 'next/link';
import MonthlyBarChart from '@/components/MonthlyBarChart';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalExpenses = transactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
  const averageTransaction = transactions.length > 0 ? totalExpenses / transactions.length : 0;
  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personal Finance Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your expenses and manage your finances with ease
        </p>
      </div>

      {loading ? (
        <div className="space-y-8">
          {/* Skeleton Loading for Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
          
          {/* Skeleton Loading for Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/transactions" className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-lg mb-2">Add Transaction</h3>
                <p className="text-sm opacity-90">Record new expenses</p>
              </div>
            </Link>
            
            <Link href="/categories" className="group bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-lg mb-2">Categories</h3>
                <p className="text-sm opacity-90">View spending breakdown</p>
              </div>
            </Link>
            
            <Link href="/budgets" className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Budgets</h3>
                <p className="text-sm opacity-90">Track budget limits</p>
              </div>
            </Link>
            
            <Link href="/insights" className="group bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-lg mb-2">Insights</h3>
                <p className="text-sm opacity-90">Analytics & reports</p>
              </div>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Total Expenses
                </h3>
                <div className="text-2xl">💸</div>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Across {transactions.length} transactions
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Average Transaction
                </h3>
                <div className="text-2xl">📊</div>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {formatCurrency(averageTransaction)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Per transaction
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  This Month
                </h3>
                <div className="text-2xl">📅</div>
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {formatCurrency(
                  transactions
                    .filter(txn => {
                      const txnDate = new Date(txn.date);
                      const now = new Date();
                      return txnDate.getMonth() === now.getMonth() && 
                             txnDate.getFullYear() === now.getFullYear();
                    })
                    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current month spending
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                📈 Monthly Spending Trend
              </h3>
              <MonthlyBarChart transactions={transactions} />
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                📋 Recent Transactions
              </h3>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📝</div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No transactions yet. Add your first transaction!
                    </p>
                  </div>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div key={transaction._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div>
                        <p className="text-gray-800 dark:text-white font-medium">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                        </p>
                      </div>
                      <span className="text-gray-800 dark:text-white font-semibold">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 text-center">
                <Link href="/transactions" className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  View All Transactions 
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
