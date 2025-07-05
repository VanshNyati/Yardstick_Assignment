export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', color: '#EF4444', icon: '🍽️' },
  { id: 'transport', name: 'Transportation', color: '#3B82F6', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', color: '#8B5CF6', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', color: '#EC4899', icon: '🎬' },
  { id: 'health', name: 'Healthcare', color: '#10B981', icon: '🏥' },
  { id: 'education', name: 'Education', color: '#F59E0B', icon: '📚' },
  { id: 'utilities', name: 'Utilities', color: '#06B6D4', icon: '⚡' },
  { id: 'housing', name: 'Housing', color: '#84CC16', icon: '🏠' },
  { id: 'travel', name: 'Travel', color: '#F97316', icon: '✈️' },
  { id: 'other', name: 'Other', color: '#6B7280', icon: '📦' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.name === name);
};
