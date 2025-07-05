// src/components/TransactionList.tsx

"use client";

import { useEffect, useState } from "react";
import { getAllTransactions, deleteTransaction } from "@/actions/transactions";
import { CATEGORIES } from "@/constants/categories";

type Transaction = {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    date: '',
    category: ''
  });

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await getAllTransactions();
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: transaction.date.split('T')[0],
      category: transaction.category || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      description: '',
      amount: '',
      date: '',
      category: ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.description || !editForm.amount || !editForm.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/transactions/' + editingId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: editForm.description,
          amount: parseFloat(editForm.amount),
          date: editForm.date,
          category: editForm.category
        }),
      });

      if (response.ok) {
        setEditingId(null);
        fetchTransactions();
      } else {
        alert('Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const result = await deleteTransaction(id);
      if (result.success) {
        fetchTransactions();
      } else {
        alert('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
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

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="text-2xl">📋</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Transaction List
        </h2>
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
          {transactions.length} transactions
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add your first transaction using the form above!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div key={txn._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
              {editingId === txn._id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Description"
                      title="Transaction description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      title="Transaction amount"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                    <input
                      type="date"
                      title="Transaction date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      title="Transaction category"
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getCategoryIcon(txn.category || '')}</span>
                      <div>
                        <p className="text-gray-800 dark:text-white font-semibold text-lg">
                          {txn.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>📅 {new Date(txn.date).toLocaleDateString()}</span>
                          {txn.category && (
                            <>
                              <span>•</span>
                              <span>🏷️ {txn.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xl font-bold ${
                      txn.amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {formatCurrency(txn.amount)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(txn)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(txn._id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
