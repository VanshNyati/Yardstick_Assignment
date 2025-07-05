import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ITransaction extends Document {
  description: string;
  amount: number;
  date: Date;
  category: string;
}

const transactionSchema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, default: 'Uncategorized' },
});

export const Transaction = models.Transaction || model<ITransaction>('Transaction', transactionSchema);
