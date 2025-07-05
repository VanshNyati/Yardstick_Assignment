"use client";

import { useState } from "react";
import { addTransaction } from "@/actions/transactions";
import { CATEGORIES } from "@/constants/categories";

const TransactionForm = ({ refresh }: { refresh: () => void }) => {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    category: "other",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!form.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (!form.date) {
      setError("Date is required");
      setLoading(false);
      return;
    }

    try {
      const selectedCategory = CATEGORIES.find(cat => cat.id === form.category);
      const result = await addTransaction({
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        date: form.date,
        category: selectedCategory?.name || "Other",
      });

      if (result.success) {
        setForm({ description: "", amount: "", date: "", category: "other" });
        refresh();
      } else {
        setError(result.error || "Failed to add transaction");
      }
    } catch (err) {
      setError("An error occurred while adding the transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="text-2xl">➕</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Transaction</h2>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg" role="alert">
          <div className="flex items-center space-x-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            📝 Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Enter transaction description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
            disabled={loading}
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            💰 Amount
          </label>
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
            disabled={loading}
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            📅 Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
            disabled={loading}
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            🏷️ Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
            disabled={loading}
            aria-describedby={error ? "error-message" : undefined}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding Transaction...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>➕</span>
              <span>Add Transaction</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
