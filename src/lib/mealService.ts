import { Nutrition } from './type/meal/nutrition';

// 음식 검색 결과 인터페이스
export interface FoodSearchResult {
  id: string;
  name: string;
  category: string;
  nutrition: Nutrition;
  commonServingSizes?: Array<{
    quantity: number;
    unit: string;
    description: string;
  }>;
}

// 오프라인 음식 데이터 서비스
export class OfflineFoodService {
  // 오프라인 모드: 기본 음식 검색 결과
  static getOfflineFoodResults(query: string): FoodSearchResult[] {
    const offlineFoods: Record<string, FoodSearchResult> = {
      '밥': {
        id: 'rice_white',
        name: '흰쌀밥',
        category: '곡류',
        nutrition: {
          id: 'rice_nutrition',
          calories: 130,
          protein: 2.7,
          carbohydrates: 28.2,
          fat: 0.3,
          fiber: 0.4
        },
        commonServingSizes: [
          { quantity: 1, unit: '공기', description: '1공기 (210g)' },
          { quantity: 0.5, unit: '공기', description: '반공기 (105g)' },
        ],
      },
      '닭가슴살': {
        id: 'chicken_breast',
        name: '닭가슴살',
        category: '육류',
        nutrition: {
          id: 'chicken_nutrition',
          calories: 165,
          protein: 31,
          carbohydrates: 0,
          fat: 3.6,
          fiber: 0
        },
        commonServingSizes: [
          { quantity: 100, unit: 'g', description: '100g' },
          { quantity: 150, unit: 'g', description: '150g' },
        ],
      },
      '계란': {
        id: 'egg_whole',
        name: '계란',
        category: '단백질',
        nutrition: {
          id: 'egg_nutrition',
          calories: 70,
          protein: 6.3,
          carbohydrates: 0.6,
          fat: 5,
          fiber: 0
        },
        commonServingSizes: [
          { quantity: 1, unit: '개', description: '1개 (50g)' },
          { quantity: 2, unit: '개', description: '2개 (100g)' },
        ],
      },
      '우유': {
        id: 'milk_whole',
        name: '우유',
        category: '유제품',
        nutrition: {
          id: 'milk_nutrition',
          calories: 42,
          protein: 3.4,
          carbohydrates: 5,
          fat: 1,
          fiber: 0
        },
        commonServingSizes: [
          { quantity: 200, unit: 'ml', description: '200ml' },
          { quantity: 250, unit: 'ml', description: '250ml' },
        ],
      },
      '바나나': {
        id: 'banana',
        name: '바나나',
        category: '과일',
        nutrition: {
          id: 'banana_nutrition',
          calories: 89,
          protein: 1.1,
          carbohydrates: 22.8,
          fat: 0.3,
          fiber: 2.6
        },
        commonServingSizes: [
          { quantity: 1, unit: '개', description: '1개 (118g)' },
          { quantity: 0.5, unit: '개', description: '반개 (59g)' },
        ],
      },
    };

    // 검색어와 매칭되는 음식들 반환
    return Object.values(offlineFoods).filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // 오프라인 모드: 기본 영양소 정보
  static getOfflineNutrition(foodId: string, quantity: number = 1): Nutrition | null {
    const offlineNutrition: Record<string, Nutrition> = {
      'rice_white': {
        id: 'rice_nutrition',
        calories: 130,
        protein: 2.7,
        carbohydrates: 28.2,
        fat: 0.3,
        fiber: 0.4
      },
      'chicken_breast': {
        id: 'chicken_nutrition',
        calories: 165,
        protein: 31,
        carbohydrates: 0,
        fat: 3.6,
        fiber: 0
      },
      'egg_whole': {
        id: 'egg_nutrition',
        calories: 70,
        protein: 6.3,
        carbohydrates: 0.6,
        fat: 5,
        fiber: 0
      },
      'milk_whole': {
        id: 'milk_nutrition',
        calories: 42,
        protein: 3.4,
        carbohydrates: 5,
        fat: 1,
        fiber: 0
      },
      'banana': {
        id: 'banana_nutrition',
        calories: 89,
        protein: 1.1,
        carbohydrates: 22.8,
        fat: 0.3,
        fiber: 2.6
      },
    };

    const baseNutrition = offlineNutrition[foodId];
    if (!baseNutrition) return null;

    // 수량에 따른 영양소 계산
    return {
      id: baseNutrition.id,
      calories: Math.round(baseNutrition.calories * quantity),
      protein: Math.round((baseNutrition.protein * quantity) * 100) / 100,
      carbohydrates: Math.round((baseNutrition.carbohydrates * quantity) * 100) / 100,
      fat: Math.round((baseNutrition.fat * quantity) * 100) / 100,
      fiber: Math.round((baseNutrition.fiber * quantity) * 100) / 100
    };
  }
}

// 로컬 스토리지 기반 음식 데이터 서비스
export class LocalFoodService {
  private static readonly STORAGE_KEY = 'local_food_database';

  // 로컬 음식 데이터 저장
  static saveLocalFood(food: FoodSearchResult): void {
    try {
      const existingFoods = this.getLocalFoods();
      const updatedFoods = { ...existingFoods, [food.id]: food };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFoods));
    } catch (error) {
      console.error('로컬 음식 데이터 저장 실패:', error);
    }
  }

  // 로컬 음식 데이터 조회
  static getLocalFoods(): Record<string, FoodSearchResult> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('로컬 음식 데이터 조회 실패:', error);
      return {};
    }
  }

  // 로컬 음식 데이터 검색
  static searchLocalFood(query: string): FoodSearchResult[] {
    const foods = this.getLocalFoods();
    return Object.values(foods).filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  // 로컬 음식 데이터 삭제
  static removeLocalFood(foodId: string): void {
    try {
      const existingFoods = this.getLocalFoods();
      delete existingFoods[foodId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingFoods));
    } catch (error) {
      console.error('로컬 음식 데이터 삭제 실패:', error);
    }
  }
}