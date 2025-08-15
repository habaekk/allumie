import { MealCategory } from './type/meal/meal';

// 식사 시간대 라벨
export const MEAL_TIME_LABELS: Record<MealCategory, string> = {
  'Breakfast': '아침',
  'Lunch': '점심',
  'Dinner': '저녁',
  'Snack': '간식',
};

// 식사 시간대별 기본 시간
export const DEFAULT_MEAL_TIMES: Record<MealCategory, string> = {
  'Breakfast': '08:00',
  'Lunch': '12:00',
  'Dinner': '18:00',
  'Snack': '15:00',
};

// 식사 시간대 순서
export const MEAL_ORDER: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
