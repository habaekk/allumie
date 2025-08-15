'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Pill, 
  Plus, 
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useMealStore } from '@/lib/mealStore';
import { NutritionCalculator } from '@/lib/nutritionCalculator';
import { MEAL_TIME_LABELS } from '@/lib/mealConstants';
import { Meal, MealCategory } from '@/lib/type/meal/meal';
import { Food } from '@/lib/type/meal/food';
import { Nutrition } from '@/lib/type/meal/nutrition';

export default function MealsComponent() {
  const [activeTab, setActiveTab] = useState('meals');

  // 오늘 날짜
  const today = new Date().toISOString().split('T')[0];
  
  // 스토어에서 오늘의 식단 데이터 가져오기
  const allMeals = useMealStore((state) => state.meals);
  const nutritionGoals = useMealStore((state) => state.nutritionGoals);
  const addMeal = useMealStore((state) => state.addMeal);
  
  // 오늘의 식사들
  const todayMeals = allMeals.filter((meal) => {
    const mealDate = meal.date instanceof Date ? meal.date.toISOString().split('T')[0] : meal.date;
    return mealDate === today;
  });

  // 오늘의 총 영양소 계산
  let totalNutrition: Nutrition = { 
    id: 'total', 
    calories: 0, 
    protein: 0, 
    carbohydrates: 0, 
    fat: 0, 
    fiber: 0 
  };
  if (todayMeals && todayMeals.length > 0) {
    const allFoods = todayMeals.flatMap(meal => meal.foods || []);
    if (allFoods.length > 0) {
      totalNutrition = NutritionCalculator.sumNutrition(allFoods);
    }
  }

  const medicationData = [
    { name: '혈압약', time: '08:00', dosage: '1정', taken: true, type: 'morning' },
    { name: '당뇨약', time: '12:00', dosage: '1정', taken: true, type: 'lunch' },
    { name: '비타민D', time: '19:00', dosage: '1정', taken: false, type: 'dinner' },
    { name: '오메가3', time: '21:00', dosage: '1정', taken: false, type: 'bedtime' },
  ];

  // 영양소 달성률 차트 데이터 (실제 데이터 기반)
  const defaultGoals: Nutrition = {
    id: 'goals',
    calories: 2000,
    protein: 100,
    carbohydrates: 200,
    fat: 65,
    fiber: 25
  };

  const goals = nutritionGoals || defaultGoals;
  const nutrition = totalNutrition;

  const nutritionChartData = [
    { 
      name: '칼로리', 
      value: Math.round(nutrition.calories || 0), 
      goal: goals.calories || defaultGoals.calories, 
      color: '#f97316' 
    },
    { 
      name: '단백질', 
      value: Math.round(nutrition.protein || 0), 
      goal: goals.protein || defaultGoals.protein, 
      color: '#ef4444' 
    },
    { 
      name: '탄수화물', 
      value: Math.round(nutrition.carbohydrates || 0), 
      goal: goals.carbohydrates || defaultGoals.carbohydrates, 
      color: '#3b82f6' 
    },
    { 
      name: '지방', 
      value: Math.round(nutrition.fat || 0), 
      goal: goals.fat || defaultGoals.fat, 
      color: '#f59e0b' 
    },
    { 
      name: '섬유질', 
      value: Math.round(nutrition.fiber || 0), 
      goal: goals.fiber || defaultGoals.fiber, 
      color: '#10b981' 
    },
  ];

  // 샘플 데이터 추가 함수
  const addSampleData = () => {
    const sampleMeals: Omit<Meal, 'id'>[] = [
      {
        category: 'Breakfast' as MealCategory,
        date: new Date(today),
        foods: [
          {
            id: 'oatmeal_1',
            name: '오트밀',
            quantity: 1,
            nutrition: { 
              id: 'oatmeal_nutrition',
              calories: 150, 
              protein: 5, 
              carbohydrates: 27, 
              fat: 3, 
              fiber: 4 
            }
          },
          {
            id: 'banana_1',
            name: '바나나',
            quantity: 1,
            nutrition: { 
              id: 'banana_nutrition',
              calories: 89, 
              protein: 1.1, 
              carbohydrates: 22.8, 
              fat: 0.3, 
              fiber: 2.6 
            }
          }
        ] as Food[]
      },
      {
        category: 'Lunch' as MealCategory,
        date: new Date(today),
        foods: [
          {
            id: 'chicken_1',
            name: '닭가슴살',
            quantity: 1,
            nutrition: { 
              id: 'chicken_nutrition',
              calories: 248, 
              protein: 46.5, 
              carbohydrates: 0, 
              fat: 5.4, 
              fiber: 0 
            }
          },
          {
            id: 'salad_1',
            name: '채소 샐러드',
            quantity: 1,
            nutrition: { 
              id: 'salad_nutrition',
              calories: 50, 
              protein: 3, 
              carbohydrates: 8, 
              fat: 1, 
              fiber: 3 
            }
          }
        ] as Food[]
      },
      {
        category: 'Snack' as MealCategory,
        date: new Date(today),
        foods: [
          {
            id: 'yogurt_1',
            name: '그릭요거트',
            quantity: 1,
            nutrition: { 
              id: 'yogurt_nutrition',
              calories: 130, 
              protein: 13, 
              carbohydrates: 9, 
              fat: 5, 
              fiber: 0 
            }
          },
          {
            id: 'nuts_1',
            name: '견과류 믹스',
            quantity: 1,
            nutrition: { 
              id: 'nuts_nutrition',
              calories: 180, 
              protein: 6, 
              carbohydrates: 6, 
              fat: 16, 
              fiber: 3 
            }
          }
        ] as Food[]
      }
    ];

    sampleMeals.forEach((meal, index) => {
      addMeal({
        ...meal,
        id: `sample_${Date.now()}_${index}`,
      });
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-2"
      >
        <div className="flex">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Meals & Meds</h1>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-4"
      >
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { id: 'meals', label: '식단', icon: UtensilsCrossed },
            { id: 'meds', label: '투약', icon: Pill }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 space-y-6">
        {activeTab === 'meals' ? (
          <>
            
            {/* Nutrition Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">영양소 달성률</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nutritionChartData.map((item, index) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name}</span>
                          <span className="font-medium">{item.value}g / {item.goal}g</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / item.goal) * 100}%` }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                            className="h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Meal List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">오늘의 식단</h3>
                <div className="flex gap-2">
                  {todayMeals.length === 0 && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={addSampleData}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      샘플 데이터
                    </Button>
                  )}
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    추가
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {todayMeals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>오늘 추가된 식단이 없습니다.</p>
                    <p className="text-sm">새로운 식사를 추가해보세요!</p>
                  </div>
                ) : (
                  todayMeals.map((meal, index) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                              </div>
                                                          <div>
                              <div className="font-medium text-gray-900">
                                {MEAL_TIME_LABELS[meal.category as MealCategory]}
                              </div>
                              <div className="text-sm text-gray-600">
                                {meal.foods?.map((food: Food) => food.name).join(', ') || '음식 정보 없음'}
                              </div>
                            </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).calories)} kcal
                              </div>
                              <div className="text-xs text-gray-500">
                                P: {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).protein)}g C: {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).carbohydrates)}g F: {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).fat)}g
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Medication Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">투약 현황</h3>
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">2/4</div>
                      <div className="text-red-100 text-sm">복용 완료</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">50%</div>
                      <div className="text-red-100 text-sm">달성률</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Medication List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">투약 스케줄</h3>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  <Plus className="w-4 h-4 mr-2" />
                  추가
                </Button>
              </div>
              <div className="space-y-3">
                {medicationData.map((med, index) => (
                  <motion.div
                    key={med.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Card className={`hover:shadow-md transition-shadow ${
                      med.taken ? 'bg-green-50 border-green-200' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              med.taken ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <Pill className={`w-5 h-5 ${
                                med.taken ? 'text-green-600' : 'text-red-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{med.name}</div>
                              <div className="text-sm text-gray-600">{med.time} • {med.dosage}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              med.taken ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {med.taken ? '복용 완료' : '복용 대기'}
                            </div>
                            <div className="text-xs text-gray-500">{med.type}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
