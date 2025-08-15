import { Food } from './food';

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  category: MealCategory;
  date: Date;
  foods: Food[];
}
