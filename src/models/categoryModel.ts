import mongoose, { Schema, model, models } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#3B82F6' },
  icon: { type: String, default: '💰' },
  budget: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Category = models.Category || model('Category', categorySchema); 