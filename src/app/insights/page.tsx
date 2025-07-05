'use client';

import React, { useState, useEffect } from 'react';
import { getTransactions } from '@/actions/transactions';
import { getBudgetComparison } from '@/actions/budgets';
import { CATEGORIES } from '@/constants/categories';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BackToDashboard from '@/components/shared/BackToDashboard';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface SpendingInsight {
  category: string;
  total: number;
  percentage: number;
  average: number;
  count: number;
}

export default function InsightsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [budgetComparison, setBudgetComparison] = useState({
    totalBudget: 0,
    totalSpending: 0,
    totalRemaining: 0,
    overallPercentage: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsData, budgetData] = await Promise.all([
        getTransactions(),
        getBudgetComparison()
      ]);
      setTransactions(transactionsData);
      setBudgetComparison(budgetData);
      processInsights(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const processInsights = (data: Transaction[]) => {
    const categoryMap = new Map<string, { total: number; count: number }>();
    const totalSpending = data.reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

    data.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      const current = categoryMap.get(category) || { total: 0, count: 0 };
      categoryMap.set(category, {
        total: current.total + Math.abs(transaction.amount),
        count: current.count + 1
      });
    });

    const insightsData: SpendingInsight[] = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        total: data.total,
        percentage: totalSpending > 0 ? (data.total / totalSpending) * 100 : 0,
        average: data.count > 0 ? data.total / data.count : 0,
        count: data.count
      }))
      .sort((a, b) => b.total - a.total);

    setInsights(insightsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = CATEGORIES.find(cat => cat.name === categoryName);
    return category?.icon || '📦';
  };

  const getCategoryColor = (categoryName: string) => {
    const category = CATEGORIES.find(cat => cat.name === categoryName);
    return category?.color || '#6B7280';
  };

  const getTopSpendingCategory = () => {
    return insights.length > 0 ? insights[0] : null;
  };

  const getMostFrequentCategory = () => {
    return insights.sort((a, b) => b.count - a.count)[0] || null;
  };

  const getAverageTransactionAmount = () => {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
    return total / transactions.length;
  };

  const getMonthlyTrend = () => {
    const monthlyData = new Map<string, number>();
    const currentDate = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData.set(monthKey, 0);
    }

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = transactionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const currentAmount = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, currentAmount + Math.abs(transaction.amount));
    });

    return Array.from(monthlyData.entries()).map(([month, amount]) => ({ month, amount }));
  };

  const monthlyTrend = getMonthlyTrend();
  const topCategory = getTopSpendingCategory();
  const mostFrequent = getMostFrequentCategory();
  const averageAmount = getAverageTransactionAmount();

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToDashboard />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Spending Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your spending patterns and trends
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading insights...</div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Total Spending
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(transactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0))}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Across {transactions.length} transactions
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Average Transaction
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(averageAmount)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Per transaction
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Budget Usage
              </h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {budgetComparison.overallPercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Of monthly budget
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Categories Used
              </h3>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {insights.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Different categories
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Monthly Spending Trend
              </h3>
              <MonthlyBarChart transactions={transactions} />
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Category Breakdown
              </h3>
              <CategoryPieChart data={insights.map(insight => ({
                category: insight.category,
                amount: insight.total,
                color: getCategoryColor(insight.category)
              }))} />
            </div>
          </div>

          {/* Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCategory && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Top Spending Category
                </h3>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getCategoryIcon(topCategory.category)}</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {topCategory.category}
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(topCategory.total)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topCategory.percentage.toFixed(1)}% of total spending
                </p>
              </div>
            )}

            {mostFrequent && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Most Frequent Category
                </h3>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getCategoryIcon(mostFrequent.category)}</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {mostFrequent.category}
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {mostFrequent.count} transactions
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average: {formatCurrency(mostFrequent.average)}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Budget Status
              </h3>
              <p className={`text-2xl font-bold ${budgetComparison.totalRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(budgetComparison.totalRemaining)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {budgetComparison.totalRemaining >= 0 ? 'Under budget' : 'Over budget'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {budgetComparison.overallPercentage.toFixed(1)}% of budget used
              </p>
            </div>
          </div>

          {/* Detailed Insights Table */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Category Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-600 dark:text-gray-400">Category</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400">Total Spent</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400">Transactions</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400">Average</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.map((insight, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(insight.category)}</span>
                          <span className="text-gray-800 dark:text-white">{insight.category}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 text-gray-800 dark:text-white font-medium">
                        {formatCurrency(insight.total)}
                      </td>
                      <td className="text-right py-3 text-gray-600 dark:text-gray-400">
                        {insight.count}
                      </td>
                      <td className="text-right py-3 text-gray-600 dark:text-gray-400">
                        {formatCurrency(insight.average)}
                      </td>
                      <td className="text-right py-3 text-gray-600 dark:text-gray-400">
                        {insight.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 