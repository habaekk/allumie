'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Scale, 
  Plus, 
  TrendingUp,
  Zap,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export default function HealthComponent() {
  const [activeTab, setActiveTab] = useState('overview');

  const healthMetrics = [
    { name: '체중', value: '65.2kg', change: '+0.3kg', trend: 'up', icon: Scale, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { name: '혈압', value: '120/80', change: '정상', trend: 'stable', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100' },
    { name: '심박수', value: '72bpm', change: '-3bpm', trend: 'down', icon: Activity, color: 'text-green-500', bgColor: 'bg-green-100' },
    { name: '체온', value: '36.8°C', change: '정상', trend: 'stable', icon: Thermometer, color: 'text-orange-500', bgColor: 'bg-orange-100' },
  ];

  const weeklyWeightData = [
    { day: '월', weight: 65.5, target: 65.0 },
    { day: '화', weight: 65.3, target: 65.0 },
    { day: '수', weight: 65.1, target: 65.0 },
    { day: '목', weight: 65.0, target: 65.0 },
    { day: '금', weight: 64.8, target: 65.0 },
    { day: '토', weight: 64.9, target: 65.0 },
    { day: '일', weight: 65.2, target: 65.0 },
  ];

  const bloodPressureData = [
    { time: '08:00', systolic: 125, diastolic: 82 },
    { time: '12:00', systolic: 118, diastolic: 78 },
    { time: '18:00', systolic: 122, diastolic: 80 },
    { time: '22:00', systolic: 115, diastolic: 75 },
  ];

  const sleepData = [
    { day: '월', hours: 7.5, quality: 85 },
    { day: '화', hours: 8.0, quality: 90 },
    { day: '수', hours: 6.5, quality: 70 },
    { day: '목', hours: 7.8, quality: 88 },
    { day: '금', hours: 8.5, quality: 92 },
    { day: '토', hours: 9.0, quality: 95 },
    { day: '일', hours: 7.0, quality: 80 },
  ];

  const activityData = [
    { type: '걸음', value: 8432, goal: 10000, unit: '걸음', color: '#3b82f6' },
    { type: '운동', value: 45, goal: 60, unit: '분', color: '#10b981' },
    { type: '계단', value: 12, goal: 15, unit: '층', color: '#f59e0b' },
    { type: '물', value: 6, goal: 8, unit: '잔', color: '#06b6d4' },
  ];

  const pieChartData = [
    { name: '깊은 수면', value: 30, color: '#1e40af' },
    { name: '얕은 수면', value: 45, color: '#3b82f6' },
    { name: 'REM 수면', value: 20, color: '#93c5fd' },
    { name: '각성', value: 5, color: '#dbeafe' },
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-2"
      >
        <div className="flex">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Health</h1>
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
            { id: 'overview', label: '개요', icon: TrendingUp },
            { id: 'details', label: '상세', icon: Activity },
            { id: 'sleep', label: '수면', icon: Eye },
            { id: 'activity', label: '활동', icon: Zap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 shadow-sm'
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
        {activeTab === 'overview' && (
          <>
            {/* Health Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {healthMetrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${metric.bgColor} rounded-full flex items-center justify-center`}>
                          <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">{metric.name}</div>
                          <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                        </div>
                      </div>
                      <div className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {metric.change}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Weight Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">체중 변화 추이</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyWeightData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[64, 66]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#ef4444" strokeWidth={3} />
                        <Line type="monotone" dataKey="target" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">오늘의 활동 요약</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityData.map((activity, index) => (
                      <div key={activity.type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{activity.type}</span>
                          <span className="font-medium">{activity.value} / {activity.goal} {activity.unit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(activity.value / activity.goal) * 100}%` }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                            className="h-2 rounded-full"
                            style={{ backgroundColor: activity.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'details' && (
          <>
            {/* Blood Pressure Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">혈압 변화</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bloodPressureData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[70, 140]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="systolic" stackId="1" stroke="#ef4444" fill="#fecaca" />
                        <Area type="monotone" dataKey="diastolic" stackId="1" stroke="#3b82f6" fill="#dbeafe" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">상세 건강 지표</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">72</div>
                      <div className="text-sm text-blue-600">심박수 (bpm)</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98.5</div>
                      <div className="text-sm text-green-600">산소포화도 (%)</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">36.8</div>
                      <div className="text-sm text-orange-600">체온 (°C)</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">22.5</div>
                      <div className="text-sm text-purple-600">체지방률 (%)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'sleep' && (
          <>
            {/* Sleep Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">수면 요약</h3>
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">7.5시간</div>
                      <div className="text-indigo-100 text-sm">평균 수면</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-indigo-100 text-sm">수면 품질</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sleep Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">주간 수면 패턴</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sleepData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="hours" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sleep Stages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">수면 단계 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {pieChartData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'activity' && (
          <>
            {/* Activity Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">활동 요약</h3>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">8,432</div>
                      <div className="text-green-100 text-sm">오늘 걸음</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">45분</div>
                      <div className="text-green-100 text-sm">운동 시간</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">활동 목표 달성</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityData.map((activity, index) => (
                      <motion.div
                        key={activity.type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Zap className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{activity.type}</div>
                            <div className="text-sm text-gray-600">목표: {activity.goal} {activity.unit}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{activity.value}</div>
                          <div className="text-xs text-gray-500">{activity.unit}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}
