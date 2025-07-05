'use client';

import React, { useState, useEffect } from 'react';
import { getBudgets, addBudget, deleteBudget, getBudgetComparison } from '@/actions/budgets';
import { CATEGORIES } from '@/constants/categories';
import BackToDashboard from '@/components/shared/BackToDashboard';

interface BudgetWithSpending {
  _id: string;
  category: string;
  amount: number;
  month: string;
  spending: number;
  remaining: number;
  percentage: number;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ category: '', amount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState({
    totalBudget: 0,
    totalSpending: 0,
    totalRemaining: 0,
    overallPercentage: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsData, comparisonData] = await Promise.all([
        getBudgets(),
        getBudgetComparison()
      ]);
      setBudgets(budgetsData);
      setComparison(comparisonData);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!formData.category || !formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please select a category and enter a valid amount');
      setSubmitting(false);
      return;
    }

    try {
      const result = await addBudget({
        category: formData.category,
        amount: parseFloat(formData.amount)
      });

      if (result.success) {
        setFormData({ category: '', amount: '' });
        fetchData();
      } else {
        setError(result.error || 'Failed to add budget');
      }
    } catch (err) {
      setError('An error occurred while adding the budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        const result = await deleteBudget(id);
        if (result.success) {
          fetchData();
        } else {
          setError(result.error || 'Failed to delete budget');
        }
      } catch (err) {
        setError('An error occurred while deleting the budget');
      }
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToDashboard />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Budget Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set and track your monthly category budgets
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Total Budget
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(comparison.totalBudget)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Total Spending
              </h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(comparison.totalSpending)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Remaining
              </h3>
              <p className={`text-3xl font-bold ${comparison.totalRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(comparison.totalRemaining)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Usage
              </h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {comparison.overallPercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Add Budget Form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Budget</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  disabled={submitting}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  disabled={submitting}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Adding...' : 'Add Budget'}
                </button>
              </div>
            </form>
          </div>

          {/* Budget List */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Current Month Budgets</h2>
            
            {budgets.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No budgets set for this month. Add your first budget above!
              </p>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div key={budget._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCategoryIcon(budget.category)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">{budget.category}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Budget: {formatCurrency(budget.amount)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Spent</span>
                        <span className="text-gray-800 dark:text-white font-medium">
                          {formatCurrency(budget.spending)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                        <span className={`font-medium ${budget.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(budget.remaining)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(budget.percentage, 100)}%`,
                            backgroundColor: budget.percentage > 100 ? '#EF4444' : getCategoryColor(budget.category)
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{budget.percentage.toFixed(1)}% used</span>
                        <span>{budget.percentage > 100 ? 'Over budget!' : 'On track'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
