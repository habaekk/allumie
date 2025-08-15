'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Pill, 
  Plus, 
  Clock,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FoodAutocomplete } from '@/components/ui/food-autocomplete';
import { FoodNutrition } from '@/lib/foodSearch';
// import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useMealStore } from '@/lib/mealStore';
import { NutritionCalculator } from '@/lib/nutritionCalculator';
import { MEAL_TIME_LABELS } from '@/lib/mealConstants';
import { Meal, MealCategory } from '@/lib/type/meal/meal';
import { Food } from '@/lib/type/meal/food';
import { Nutrition } from '@/lib/type/meal/nutrition';

// 새 음식 항목 인터페이스
interface NewFoodItem {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
}

// 새 식사 폼 데이터 인터페이스
interface NewMealForm {
  category: MealCategory;
  foods: NewFoodItem[];
}

export default function MealsComponent() {
  const [activeTab, setActiveTab] = useState('meals');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState<NewMealForm>({
    category: 'Breakfast',
    foods: [{ name: '', calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }]
  });
  
  // 삭제 기능
  const handleDeleteMeal = (mealId: string, mealName: string) => {
    if (window.confirm(`"${mealName}" 식단을 삭제하시겠습니까?`)) {
      deleteMeal(mealId);
    }
  };

  // 모달 열기
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewMeal({
      category: 'Breakfast',
      foods: [{ name: '', calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }]
    });
  };

  // 모달 닫기
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  // 음식 항목 추가
  const addFoodItem = () => {
    setNewMeal(prev => ({
      ...prev,
      foods: [...prev.foods, { name: '', calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 }]
    }));
  };

  // 음식 항목 제거
  const removeFoodItem = (index: number) => {
    if (newMeal.foods.length > 1) {
      setNewMeal(prev => ({
        ...prev,
        foods: prev.foods.filter((_, i) => i !== index)
      }));
    }
  };

  // 음식 정보 업데이트
  const updateFoodItem = (index: number, field: keyof NewFoodItem, value: string | number) => {
    setNewMeal(prev => ({
      ...prev,
      foods: prev.foods.map((food, i) => 
        i === index ? { ...food, [field]: value } : food
      )
    }));
  };

  // 자동완성에서 음식 선택 시 영양정보 자동 채우기
  const handleFoodSelect = (index: number, selectedFood: FoodNutrition) => {
    setNewMeal(prev => ({
      ...prev,
      foods: prev.foods.map((food, i) => 
        i === index ? {
          name: selectedFood.name,
          calories: selectedFood.calories,
          protein: selectedFood.protein,
          carbohydrates: selectedFood.carbohydrates,
          fat: selectedFood.fat,
          fiber: selectedFood.fiber,
        } : food
      )
    }));
  };

  // 식사 카테고리 업데이트
  const updateCategory = (category: MealCategory) => {
    setNewMeal(prev => ({
      ...prev,
      category
    }));
  };

  // 새 식사 저장
  const handleSaveMeal = () => {
    // 유효성 검사
    if (newMeal.foods.some(food => !food.name.trim())) {
      alert('모든 음식명을 입력해주세요.');
      return;
    }

    // 새 식사 생성
    const mealToAdd: Meal = {
      id: `meal_${Date.now()}`,
      category: newMeal.category,
      date: new Date(today),
      foods: newMeal.foods.map((food, index) => ({
        id: `food_${Date.now()}_${index}`,
        name: food.name,
        quantity: 1,
        nutrition: {
          id: `nutrition_${Date.now()}_${index}`,
          calories: food.calories,
          protein: food.protein,
          carbohydrates: food.carbohydrates,
          fat: food.fat,
          fiber: food.fiber
        }
      }))
    };

    // 스토어에 추가
    addMeal(mealToAdd);
    
    // 모달 닫기
    handleCloseAddModal();
  };

  // 오늘 날짜
  const today = new Date().toISOString().split('T')[0];
  
  // 스토어에서 오늘의 식단 데이터 가져오기
  const allMeals = useMealStore((state) => state.meals);
  const nutritionGoals = useMealStore((state) => state.nutritionGoals);
  const addMeal = useMealStore((state) => state.addMeal);
  const deleteMeal = useMealStore((state) => state.deleteMeal);
  
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
                  <Button 
                    size="sm" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleOpenAddModal}
                  >
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
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).calories)} kcal
                                </div>
                                <div className="text-xs text-gray-500">
                                  P: {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).protein)}g C: {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).carbohydrates)}g F: {Math.round(NutritionCalculator.sumNutrition(meal.foods || []).fat)}g
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteMeal(
                                  meal.id, 
                                  MEAL_TIME_LABELS[meal.category as MealCategory]
                                )}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                                title="식단 삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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

      {/* 식단 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">식단 추가</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseAddModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* 식사 종류 선택 */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  식사 종류
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealCategory[]).map((category) => (
                    <Button
                      key={category}
                      variant={newMeal.category === category ? "default" : "outline"}
                      onClick={() => updateCategory(category)}
                      className={`justify-start ${
                        newMeal.category === category
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {MEAL_TIME_LABELS[category]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 음식 목록 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium text-gray-700">
                    음식 정보
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addFoodItem}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    음식 추가
                  </Button>
                </div>

                <div className="space-y-4">
                  {newMeal.foods.map((food, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          음식 {index + 1}
                        </h4>
                        {newMeal.foods.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFoodItem(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* 음식명 */}
                        <div className="md:col-span-2">
                          <FoodAutocomplete
                            value={food.name}
                            onChange={(value) => updateFoodItem(index, 'name', value)}
                            onFoodSelect={(selectedFood) => handleFoodSelect(index, selectedFood)}
                            placeholder="예: 계란말이"
                            label="음식명"
                          />
                        </div>

                        {/* 칼로리 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            칼로리 (kcal)
                          </Label>
                          <Input
                            type="number"
                            value={food.calories}
                            onChange={(e) => updateFoodItem(index, 'calories', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="text-sm"
                            min="0"
                            step="0.1"
                          />
                        </div>

                        {/* 단백질 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            단백질 (g)
                          </Label>
                          <Input
                            type="number"
                            value={food.protein}
                            onChange={(e) => updateFoodItem(index, 'protein', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="text-sm"
                            min="0"
                            step="0.1"
                          />
                        </div>

                        {/* 탄수화물 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            탄수화물 (g)
                          </Label>
                          <Input
                            type="number"
                            value={food.carbohydrates}
                            onChange={(e) => updateFoodItem(index, 'carbohydrates', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="text-sm"
                            min="0"
                            step="0.1"
                          />
                        </div>

                        {/* 지방 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            지방 (g)
                          </Label>
                          <Input
                            type="number"
                            value={food.fat}
                            onChange={(e) => updateFoodItem(index, 'fat', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="text-sm"
                            min="0"
                            step="0.1"
                          />
                        </div>

                        {/* 섬유질 */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1 block">
                            섬유질 (g)
                          </Label>
                          <Input
                            type="number"
                            value={food.fiber}
                            onChange={(e) => updateFoodItem(index, 'fiber', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="text-sm"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 모달 푸터 */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCloseAddModal}
                  className="px-6"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSaveMeal}
                  className="bg-orange-500 hover:bg-orange-600 px-6"
                >
                  저장
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
