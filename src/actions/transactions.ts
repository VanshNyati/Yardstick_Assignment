'use server';

import { connectDB } from '@/lib/db';
import { Transaction } from '@/models/transactionModel';
import { revalidatePath } from 'next/cache';

// ✅ Fetch all transactions
export const getTransactions = async () => {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 }).lean();
    return transactions.map(txn => ({
      ...txn,
      _id: txn._id.toString(),
      date: txn.date instanceof Date ? txn.date.toISOString() : txn.date,
    }));
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    return [];
  }
};

// ✅ Add a new transaction
export const addTransaction = async (formData: {
  description: string;
  amount: number;
  date: string;
  category: string;
}) => {
  try {
    await connectDB();
    const transaction = new Transaction({
      ...formData,
      date: new Date(formData.date)
    });
    await transaction.save();
    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/budgets");
    revalidatePath("/insights");
    return { success: true };
  } catch (err) {
    console.error("❌ Error adding transaction:", err);
    return { success: false, error: "Failed to add transaction" };
  }
};

// ✅ Update a transaction
export const updateTransaction = async (id: string, formData: {
  description: string;
  amount: number;
  date: string;
  category: string;
}) => {
  try {
    await connectDB();
    await Transaction.findByIdAndUpdate(id, {
      ...formData,
      date: new Date(formData.date)
    });
    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/budgets");
    revalidatePath("/insights");
    return { success: true };
  } catch (err) {
    console.error("❌ Error updating transaction:", err);
    return { success: false, error: "Failed to update transaction" };
  }
};

// ✅ Delete a transaction
export const deleteTransaction = async (id: string) => {
  try {
    await connectDB();
    await Transaction.findByIdAndDelete(id);
    revalidatePath("/transactions");
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/budgets");
    revalidatePath("/insights");
    return { success: true };
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    return { success: false, error: "Failed to delete transaction" };
  }
};

// ✅ Fetch all transactions (alias for getTransactions)
export const getAllTransactions = async () => {
  return await getTransactions();
};
