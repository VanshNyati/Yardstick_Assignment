import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IBudget extends Document {
  category: string;
  amount: number;
  month: string; // Format: YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  month: { type: String, required: true }, // YYYY-MM format
}, {
  timestamps: true
});

// Compound index to ensure unique budget per category per month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

export const Budget = models.Budget || model<IBudget>('Budget', budgetSchema); 