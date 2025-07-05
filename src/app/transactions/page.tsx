'use client';

import React, { useState, useEffect } from 'react';
import { getTransactions } from '@/actions/transactions';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import BackToDashboard from '@/components/shared/BackToDashboard';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function TransactionsPage() {
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

  const handleRefresh = () => {
    fetchTransactions();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToDashboard />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Transactions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add and manage your transactions
        </p>
      </div>

      <div className="space-y-8">
        <TransactionForm refresh={handleRefresh} />
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500 dark:text-gray-400">Loading transactions...</div>
          </div>
        ) : (
          <TransactionList />
        )}
      </div>
    </div>
  );
}
