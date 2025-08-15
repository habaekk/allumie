import { Nutrition } from './type/meal/nutrition';
import { Food } from './type/meal/food';

export class NutritionCalculator {
  /**
   * 여러 음식들의 영양소를 합산
   */
  static sumNutrition(foods: Food[]): Nutrition {
    if (!foods || foods.length === 0) {
      return {
        id: 'sum',
        calories: 0,
        carbohydrates: 0,
        protein: 0,
        fat: 0,
        fiber: 0,
      };
    }

    return foods.reduce((total, food) => ({
      id: 'sum',
      calories: total.calories + (food.nutrition.calories * food.quantity),
      carbohydrates: total.carbohydrates + (food.nutrition.carbohydrates * food.quantity),
      protein: total.protein + (food.nutrition.protein * food.quantity),
      fat: total.fat + (food.nutrition.fat * food.quantity),
      fiber: total.fiber + (food.nutrition.fiber * food.quantity),
    }), {
      id: 'sum',
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
    });
  }

  /**
   * 영양소 달성률 계산 (0-1 범위)
   */
  static calculateAchievementRate(
    actual: Nutrition, 
    goals: Nutrition
  ): Record<string, number> {
    return {
      calories: goals.calories > 0 ? actual.calories / goals.calories : 0,
      carbohydrates: goals.carbohydrates > 0 ? actual.carbohydrates / goals.carbohydrates : 0,
      protein: goals.protein > 0 ? actual.protein / goals.protein : 0,
      fat: goals.fat > 0 ? actual.fat / goals.fat : 0,
      fiber: goals.fiber > 0 ? actual.fiber / goals.fiber : 0,
    };
  }

  /**
   * 영양소를 백분율로 변환
   */
  static toPercentage(rate: number): number {
    return Math.round(rate * 100);
  }

  /**
   * 영양소 값들을 소수점 한자리로 반올림
   */
  static roundNutrition(nutrition: Nutrition): Nutrition {
    return {
      id: nutrition.id,
      calories: Math.round(nutrition.calories),
      carbohydrates: Math.round(nutrition.carbohydrates * 10) / 10,
      protein: Math.round(nutrition.protein * 10) / 10,
      fat: Math.round(nutrition.fat * 10) / 10,
      fiber: Math.round(nutrition.fiber * 10) / 10,
    };
  }
}
