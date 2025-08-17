import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Meal, 
  MealCategory
} from '../type/meal/meal';
import { Food } from '../type/meal/food';
import { Nutrition } from '../type/meal/nutrition';
import { NutritionCalculator } from '../nutritionCalculator';

// 사용자 프로필 인터페이스
interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'lose' | 'maintain' | 'gain';
  nutritionGoals: Nutrition;
}

// 식사 폼 데이터
interface MealFormData {
  category: MealCategory;
  date: Date;
  foods: Food[];
}

// 일일 식사 요약 (현재 사용되지 않음)
// interface DailyMealSummary {
//   date: string;
//   meals: Meal[];
//   totalNutrition: Nutrition;
//   goalNutrition?: Nutrition;
//   achievementRate: Record<string, number>;
// }

// 식단 스토어 상태
interface MealState {
  // 데이터
  meals: Meal[];
  userProfile: UserProfile | null;
  nutritionGoals: Nutrition | null;
  
  // UI 상태
  isLoading: boolean;
  error: string | null;
  selectedDate: string;
  selectedMealTime: MealCategory | null;
  
  // 액션
  addMeal: (meal: Meal) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedMealTime: (mealTime: MealCategory | null) => void;
  setUserProfile: (profile: UserProfile) => void;
  calculateNutritionGoals: () => void;
  validateAndAddMeal: (formData: MealFormData) => Promise<{ success: boolean; error?: string }>;
}

// 기본 영양소 목표
const defaultNutritionGoals: Nutrition = {
  id: 'default_goals',
  calories: 2000,
  protein: 150,
  carbohydrates: 225,
  fat: 67,
  fiber: 25
};

// 기본 사용자 프로필 (예시 데이터)
const defaultUserProfile: UserProfile = {
  id: '1',
  name: '정유진',
  age: 30,
  gender: 'female',
  height: 165,
  weight: 65,
  activityLevel: 'moderately_active',
  goal: 'maintain',
  nutritionGoals: defaultNutritionGoals,
};

export const useMealStore = create<MealState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      meals: [],
      userProfile: defaultUserProfile,
      nutritionGoals: defaultNutritionGoals,
      isLoading: false,
      error: null,
      selectedDate: new Date().toISOString().split('T')[0],
      selectedMealTime: null,

      // 식사 추가
      addMeal: (meal: Meal) => {
        set((state) => ({
          meals: [...state.meals, meal],
          error: null,
        }));
      },

      // 식사 수정
      updateMeal: (id: string, updates: Partial<Meal>) => {
        set((state) => ({
          meals: state.meals.map((meal) =>
            meal.id === id ? { ...meal, ...updates, updatedAt: new Date() } : meal
          ),
          error: null,
        }));
      },

      // 식사 삭제
      deleteMeal: (id: string) => {
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
          error: null,
        }));
      },

      // 선택된 날짜 설정
      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
      },

      // 선택된 식사 시간대 설정
      setSelectedMealTime: (mealTime: MealCategory | null) => {
        set({ selectedMealTime: mealTime });
      },

      // 사용자 프로필 설정
      setUserProfile: (profile: UserProfile) => {
        set({ userProfile: profile });
        // 프로필이 변경되면 영양소 목표 재계산
        get().calculateNutritionGoals();
      },

      // 영양소 목표 계산
      calculateNutritionGoals: () => {
        const { userProfile } = get();
        if (userProfile) {
          // 간단한 영양소 목표 계산 (실제 구현 시 더 복잡한 공식 사용)
          const bmr = userProfile.gender === 'male' 
            ? 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age)
            : 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);
          
          const activityMultiplier = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9
          }[userProfile.activityLevel];
          
          const calories = Math.round(bmr * activityMultiplier);
          
          const goals: Nutrition = {
            id: 'calculated_goals',
            calories,
            protein: Math.round(userProfile.weight * 1.2), // 체중 1kg당 1.2g
            carbohydrates: Math.round(calories * 0.45 / 4), // 칼로리의 45%
            fat: Math.round(calories * 0.25 / 9), // 칼로리의 25%
            fiber: 25
          };
          
          set({ nutritionGoals: goals });
        }
      },



      // 식사 폼 검증 및 추가
      validateAndAddMeal: async (formData: MealFormData) => {
        set({ isLoading: true, error: null });

        try {
          // 간단한 폼 데이터 검증
          if (!formData.category) {
            throw new Error('식사 카테고리를 선택해주세요.');
          }
          if (!formData.foods || formData.foods.length === 0) {
            throw new Error('최소 하나의 음식을 추가해주세요.');
          }

          // 새 식사 생성
          const newMeal: Meal = {
            id: Date.now().toString(), // 임시 ID 생성
            category: formData.category,
            date: formData.date,
            foods: formData.foods
          };

          // 스토어에 추가
          get().addMeal(newMeal);

          return { success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        } finally {
          set({ isLoading: false });
        }
      },
    })
  )
);

// 선택자 함수들 (성능 최적화용)
export const useMealSelectors = {
  // 특정 날짜의 식사들
  useMealsByDate: (date: string) => 
    useMealStore((state) => state.meals.filter((meal) => {
      const mealDate = meal.date instanceof Date ? meal.date.toISOString().split('T')[0] : meal.date;
      return mealDate === date;
    })),
  
  // 일일 요약
  useDailySummary: (date: string) => 
    useMealStore((state) => {
      const meals = state.meals.filter((meal) => {
        const mealDate = meal.date instanceof Date ? meal.date.toISOString().split('T')[0] : meal.date;
        return mealDate === date;
      });
      const nutritionGoals = state.nutritionGoals;
      
      if (meals.length === 0) return null;

      const totalNutrition = NutritionCalculator.sumNutrition(
        meals.flatMap((meal) => meal.foods)
      );

      const achievementRate = nutritionGoals 
        ? NutritionCalculator.calculateAchievementRate(totalNutrition, nutritionGoals)
        : { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 };

      return {
        date,
        meals,
        totalNutrition,
        goalNutrition: nutritionGoals || undefined,
        achievementRate,
      };
    }),
  
  // 선택된 날짜
  useSelectedDate: () => useMealStore((state) => state.selectedDate),
  
  // 선택된 식사 시간대
  useSelectedMealTime: () => useMealStore((state) => state.selectedMealTime),
  
  // 사용자 프로필
  useUserProfile: () => useMealStore((state) => state.userProfile),
  
  // 영양소 목표
  useNutritionGoals: () => useMealStore((state) => state.nutritionGoals),
  
  // 로딩 상태
  useIsLoading: () => useMealStore((state) => state.isLoading),
  
  // 에러 상태
  useError: () => useMealStore((state) => state.error),
};

// 액션 함수들
// Helper functions to get store actions
export const getMealActions = () => {
  const store = useMealStore.getState();
  return {
    addMeal: store.addMeal,
    updateMeal: store.updateMeal,
    deleteMeal: store.deleteMeal,
    setSelectedDate: store.setSelectedDate,
    setSelectedMealTime: store.setSelectedMealTime,
    setUserProfile: store.setUserProfile,
    validateAndAddMeal: store.validateAndAddMeal,
  };
};
