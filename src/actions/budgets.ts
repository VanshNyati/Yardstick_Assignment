'use server';

import { connectDB } from '@/lib/db';
import { Budget } from '@/models/budgetModel';
import { getTransactions } from './transactions';
import { revalidatePath } from 'next/cache';

export interface BudgetWithSpending {
  _id: string;
  category: string;
  amount: number;
  month: string;
  spending: number;
  remaining: number;
  percentage: number;
}

// Get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Get budgets for current month with spending data
export const getBudgets = async (): Promise<BudgetWithSpending[]> => {
  try {
    await connectDB();
    const currentMonth = getCurrentMonth();
    
    // Get budgets for current month
    const budgets = await Budget.find({ month: currentMonth }).lean();
    
    // Get transactions for current month
    const transactions = await getTransactions();
    const currentMonthTransactions = transactions.filter(txn => {
      const txnDate = new Date(txn.date);
      const txnMonth = `${txnDate.getFullYear()}-${String(txnDate.getMonth() + 1).padStart(2, '0')}`;
      return txnMonth === currentMonth;
    });

    // Calculate spending per category
    const spendingByCategory = new Map<string, number>();
    currentMonthTransactions.forEach(txn => {
      const category = txn.category || 'Uncategorized';
      const currentSpending = spendingByCategory.get(category) || 0;
      spendingByCategory.set(category, currentSpending + Math.abs(txn.amount));
    });

    // Combine budget and spending data
    return budgets.map(budget => {
      const spending = spendingByCategory.get(budget.category) || 0;
      const remaining = budget.amount - spending;
      const percentage = budget.amount > 0 ? (spending / budget.amount) * 100 : 0;
      
      return {
        _id: budget._id.toString(),
        category: budget.category,
        amount: budget.amount,
        month: budget.month,
        spending,
        remaining,
        percentage: Math.min(percentage, 100)
      };
    });
  } catch (err) {
    console.error("❌ Error fetching budgets:", err);
    return [];
  }
};

// Add or update budget
export const addBudget = async (formData: {
  category: string;
  amount: number;
}) => {
  try {
    await connectDB();
    const currentMonth = getCurrentMonth();
    
    const budgetData = {
      category: formData.category,
      amount: formData.amount,
      month: currentMonth
    };

    // Use upsert to create or update
    await Budget.findOneAndUpdate(
      { category: formData.category, month: currentMonth },
      budgetData,
      { upsert: true, new: true }
    );

    revalidatePath("/budgets");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("❌ Error adding budget:", err);
    return { success: false, error: "Failed to add budget" };
  }
};

// Delete budget
export const deleteBudget = async (id: string) => {
  try {
    await connectDB();
    await Budget.findByIdAndDelete(id);
    revalidatePath("/budgets");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("❌ Error deleting budget:", err);
    return { success: false, error: "Failed to delete budget" };
  }
};

// Get budget vs actual comparison data
export const getBudgetComparison = async () => {
  try {
    const budgets = await getBudgets();
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpending = budgets.reduce((sum, budget) => sum + budget.spending, 0);
    const totalRemaining = totalBudget - totalSpending;
    const overallPercentage = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpending,
      totalRemaining,
      overallPercentage: Math.min(overallPercentage, 100),
      budgets
    };
  } catch (err) {
    console.error("❌ Error getting budget comparison:", err);
    return {
      totalBudget: 0,
      totalSpending: 0,
      totalRemaining: 0,
      overallPercentage: 0,
      budgets: []
    };
  }
}; 