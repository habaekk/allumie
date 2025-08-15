'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Pill, 
  Plus, 
  Clock, 
  Calendar,
  Home,
  Heart,
  Brain,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function MealsComponent() {
  const [activeTab, setActiveTab] = useState('meals');

  const mealData = [
    { time: '08:00', meal: '아침', food: '오트밀 + 바나나', calories: 320, protein: 12, carbs: 58, fat: 8 },
    { time: '12:30', meal: '점심', food: '닭가슴살 샐러드', calories: 450, protein: 35, carbs: 25, fat: 22 },
    { time: '15:00', meal: '간식', food: '그릭요거트 + 견과류', calories: 180, protein: 15, carbs: 12, fat: 10 },
    { time: '19:00', meal: '저녁', food: '연어 + 현미밥', calories: 520, protein: 38, carbs: 45, fat: 18 },
  ];

  const medicationData = [
    { name: '혈압약', time: '08:00', dosage: '1정', taken: true, type: 'morning' },
    { name: '당뇨약', time: '12:00', dosage: '1정', taken: true, type: 'lunch' },
    { name: '비타민D', time: '19:00', dosage: '1정', taken: false, type: 'dinner' },
    { name: '오메가3', time: '21:00', dosage: '1정', taken: false, type: 'bedtime' },
  ];

  const nutritionChartData = [
    { name: '단백질', value: 100, goal: 120, color: '#ef4444' },
    { name: '탄수화물', value: 140, goal: 200, color: '#3b82f6' },
    { name: '지방', value: 58, goal: 65, color: '#f59e0b' },
    { name: '섬유질', value: 25, goal: 30, color: '#10b981' },
  ];

  const weeklyData = [
    { day: '월', calories: 1850, protein: 95, carbs: 180, fat: 65 },
    { day: '화', calories: 1920, protein: 102, carbs: 195, fat: 68 },
    { day: '수', calories: 1780, protein: 88, carbs: 170, fat: 62 },
    { day: '목', calories: 1950, protein: 105, carbs: 200, fat: 70 },
    { day: '금', calories: 1880, protein: 98, carbs: 185, fat: 66 },
    { day: '토', calories: 2100, protein: 110, carbs: 220, fat: 75 },
    { day: '일', calories: 1750, protein: 90, carbs: 165, fat: 60 },
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-6"
      >
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Meals & Meds</h1>
            <p className="text-gray-600">식단과 투약 관리</p>
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
            {/* Today's Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">오늘의 영양소</h3>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">1,470</div>
                      <div className="text-orange-100 text-sm">칼로리</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">100g</div>
                      <div className="text-orange-100 text-sm">단백질</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

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

            {/* Weekly Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">주간 칼로리 추이</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="calories" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
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
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  추가
                </Button>
              </div>
              <div className="space-y-3">
                {mealData.map((meal, index) => (
                  <motion.div
                    key={meal.time}
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
                              <div className="font-medium text-gray-900">{meal.meal}</div>
                              <div className="text-sm text-gray-600">{meal.food}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{meal.calories} kcal</div>
                            <div className="text-xs text-gray-500">
                              P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="fixed bottom-24 right-6"
      >
        <Button 
          size="lg" 
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}
