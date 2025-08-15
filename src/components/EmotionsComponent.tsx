'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Smile, 
  Frown, 
  Meh, 
  Plus, 
  Calendar,
  Lightbulb,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function EmotionsComponent() {
  const [activeTab, setActiveTab] = useState('mood');
  const [selectedMood, setSelectedMood] = useState('');

  const moodData = [
    { day: '월', mood: 8, energy: 7, stress: 3 },
    { day: '화', mood: 7, energy: 6, stress: 4 },
    { day: '수', mood: 6, energy: 5, stress: 6 },
    { day: '목', mood: 8, energy: 8, stress: 2 },
    { day: '금', mood: 9, energy: 9, stress: 1 },
    { day: '토', mood: 8, energy: 7, stress: 2 },
    { day: '일', mood: 7, energy: 6, stress: 3 },
  ];

  const moodTypes = [
    { id: 'happy', label: '행복', icon: Smile, color: 'text-yellow-500', bgColor: 'bg-yellow-100', score: 8 },
    { id: 'sad', label: '슬픔', icon: Frown, color: 'text-blue-500', bgColor: 'bg-blue-100', score: 2 },
    { id: 'angry', label: '화남', icon: Frown, color: 'text-red-500', bgColor: 'bg-red-100', score: 1 },
    { id: 'neutral', label: '보통', icon: Meh, color: 'text-gray-500', bgColor: 'bg-gray-100', score: 3 },
    { id: 'excited', label: '신남', icon: Smile, color: 'text-green-500', bgColor: 'bg-green-100', score: 4 },
  ];

  const dailyQuestions = [
    {
      id: 1,
      question: "오늘 하루는 어땠나요?",
      type: "mood",
      options: ["매우 좋음", "좋음", "보통", "나쁨", "매우 나쁨"]
    },
    {
      id: 2,
      question: "오늘 스트레스 수준은 어느 정도였나요?",
      type: "stress",
      options: ["매우 낮음", "낮음", "보통", "높음", "매우 높음"]
    },
    {
      id: 3,
      question: "오늘 에너지 수준은 어느 정도였나요?",
      type: "energy",
      options: ["매우 낮음", "낮음", "보통", "높음", "매우 높음"]
    }
  ];

  const moodHistory = [
    { date: '2024-01-15', mood: 8, note: '친구들과 좋은 시간을 보냄', activities: ['친구 만남', '영화 감상'] },
    { date: '2024-01-14', mood: 6, note: '일이 많아서 조금 지침', activities: ['업무', '운동'] },
    { date: '2024-01-13', mood: 9, note: '가족과 즐거운 저녁', activities: ['가족 식사', '게임'] },
    { date: '2024-01-12', mood: 7, note: '새로운 취미를 시작함', activities: ['독서', '음악 감상'] },
  ];

  const insights = [
    { title: '긍정적 패턴', description: '주말에는 기분이 더 좋아지는 경향이 있어요', icon: Lightbulb, color: 'text-yellow-500' },
    { title: '스트레스 요인', description: '화요일과 수요일에 스트레스가 높아져요', icon: Brain, color: 'text-purple-500' },
    { title: '에너지 관리', description: '운동 후 에너지가 상승하는 경향이 있어요', icon: Heart, color: 'text-red-500' },
  ];

  const pieChartData = [
    { name: '행복', value: 40, color: '#fbbf24' },
    { name: '보통', value: 30, color: '#6b7280' },
    { name: '신남', value: 20, color: '#10b981' },
    { name: '슬픔', value: 7, color: '#3b82f6' },
    { name: '화남', value: 3, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-2"
      >
        <div className="flex">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Emotions</h1>
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
            { id: 'mood', label: '기분', icon: Smile },
            { id: 'questions', label: '일일 Q&A', icon: MessageCircle },
            { id: 'insights', label: '인사이트', icon: Lightbulb },
            { id: 'history', label: '기록', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
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
        {activeTab === 'mood' && (
          <>
            {/* Today's Mood Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">오늘의 기분</h3>
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-purple-100 text-sm">기분 점수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">7</div>
                      <div className="text-purple-100 text-sm">에너지</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-purple-100 text-sm">스트레스</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mood Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">주간 기분 변화</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={3} />
                        <Line type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mood Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">기분 분포</CardTitle>
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

            {/* Quick Mood Check */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">빠른 기분 체크</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-3">
                    {moodTypes.map((mood) => (
                      <motion.button
                        key={mood.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          selectedMood === mood.id
                            ? 'bg-purple-100 border-2 border-purple-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <mood.icon className={`w-8 h-8 mx-auto mb-2 ${mood.color}`} />
                        <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                        <div className="text-xs text-gray-500">{mood.score}회</div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'questions' && (
          <>
            {/* Daily Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">오늘의 질문</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {dailyQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="space-y-3"
                    >
                      <h4 className="font-medium text-gray-900">{question.question}</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {question.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            className="p-2 text-xs bg-gray-100 hover:bg-purple-100 rounded-md transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    답변 저장하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'insights' && (
          <>
            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <insight.icon className={`w-5 h-5 ${insight.color}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Mood Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">기분 트렌드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="mood" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            {/* Mood History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">기분 기록</h3>
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  기록 추가
                </Button>
              </div>
              <div className="space-y-3">
                {moodHistory.map((record, index) => (
                  <motion.div
                    key={record.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-purple-600">{record.mood}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{record.date}</div>
                                <div className="text-sm text-gray-600">{record.note}</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {record.activities.map((activity, actIndex) => (
                                <span
                                  key={actIndex}
                                  className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                                >
                                  {activity}
                                </span>
                              ))}
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
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}
