'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  BarChart3,
  FileEdit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 감정 아이콘 컴포넌트 (창의적 디자인)
const EmotionIcon = ({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const emotions = {
    excellent: (
      <div className={`${sizeClasses[size]} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 bg-yellow-200 rounded-full flex items-center justify-center relative">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute bottom-1/4 w-1/2 h-1 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    ),
    good: (
      <div className={`${sizeClasses[size]} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-green-300 to-emerald-400 rounded-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 bg-green-200 rounded-full flex items-center justify-center relative">
            <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute bottom-1/3 w-1/3 h-0.5 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    ),
    neutral: (
      <div className={`${sizeClasses[size]} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-slate-400 rounded-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 bg-gray-200 rounded-full flex items-center justify-center relative">
            <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute bottom-1/3 w-1/4 h-0.5 bg-black"></div>
          </div>
        </div>
      </div>
    ),
    bad: (
      <div className={`${sizeClasses[size]} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 bg-orange-200 rounded-full flex items-center justify-center relative">
            <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute bottom-1/4 w-1/3 h-0.5 bg-black rounded-full transform rotate-180"></div>
          </div>
        </div>
      </div>
    ),
    terrible: (
      <div className={`${sizeClasses[size]} relative`}>
        <div className="w-full h-full bg-gradient-to-br from-red-400 to-purple-500 rounded-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 bg-red-200 rounded-full flex items-center justify-center relative">
            <div className="absolute top-1/4 left-1/4 w-1 h-1.5 bg-black rounded-full transform -rotate-12"></div>
            <div className="absolute top-1/4 right-1/4 w-1 h-1.5 bg-black rounded-full transform rotate-12"></div>
            <div className="absolute bottom-1/4 w-1/2 h-1 bg-black rounded-full transform rotate-180"></div>
          </div>
        </div>
      </div>
    )
  };

  return emotions[type as keyof typeof emotions] || emotions.neutral;
};

interface EmotionEntry {
  date: string;
  emotion: string;
  diary: string;
  dailyAnswer: string;
}

export default function EmotionsComponent() {
  const [activeTab, setActiveTab] = useState('record');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [diaryText, setDiaryText] = useState('');
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>([
    { date: '2024-01-15', emotion: 'excellent', diary: '오늘은 정말 좋은 하루였다!', dailyAnswer: '친구들과 즐거운 시간을 보냈어요.' },
    { date: '2024-01-14', emotion: 'good', diary: '평범하지만 괜찮은 하루', dailyAnswer: '업무가 순조롭게 진행되었어요.' },
    { date: '2024-01-12', emotion: 'bad', diary: '조금 힘든 하루였다', dailyAnswer: '스트레스가 많았어요.' }
  ]);

  const emotionTypes = [
    { id: 'excellent', label: '최고', value: 5, color: 'from-yellow-300 to-orange-400' },
    { id: 'good', label: '좋음', value: 4, color: 'from-green-300 to-emerald-400' },
    { id: 'neutral', label: '보통', value: 3, color: 'from-gray-300 to-slate-400' },
    { id: 'bad', label: '나쁨', value: 2, color: 'from-orange-400 to-red-400' },
    { id: 'terrible', label: '최악', value: 1, color: 'from-red-400 to-purple-500' }
  ];

  const dailyQuestion = "오늘 하루 중 가장 인상 깊었던 순간은 무엇인가요?";

  // 달력 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEmotionForDate = (dateStr: string) => {
    return emotionEntries.find(entry => entry.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
    
    const existingEntry = getEmotionForDate(dateStr);
    if (existingEntry) {
      setSelectedEmotion(existingEntry.emotion);
      setDiaryText(existingEntry.diary);
      setDailyAnswer(existingEntry.dailyAnswer);
    } else {
      setSelectedEmotion('');
      setDiaryText('');
      setDailyAnswer('');
    }
    
    setIsModalOpen(true);
  };

  const handleSaveEntry = () => {
    if (!selectedDate || !selectedEmotion) return;

    const newEntry: EmotionEntry = {
      date: selectedDate,
      emotion: selectedEmotion,
      diary: diaryText,
      dailyAnswer: dailyAnswer
    };

    setEmotionEntries(prev => {
      const filtered = prev.filter(entry => entry.date !== selectedDate);
      return [...filtered, newEntry];
    });

    setIsModalOpen(false);
    setSelectedEmotion('');
    setDiaryText('');
    setDailyAnswer('');
  };

  const getChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
      const entry = getEmotionForDate(dateStr);
      
      last7Days.push({
        day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        value: entry ? emotionTypes.find(t => t.id === entry.emotion)?.value || 3 : 3,
        date: dateStr
      });
    }
    
    return last7Days;
  };

  const getEmotionDistribution = () => {
    const distribution = emotionTypes.map(type => ({
      name: type.label,
      value: emotionEntries.filter(entry => entry.emotion === type.id).length,
      color: type.id === 'excellent' ? '#fbbf24' :
             type.id === 'good' ? '#10b981' :
             type.id === 'neutral' ? '#6b7280' :
             type.id === 'bad' ? '#f97316' : '#ef4444'
    }));

    return distribution.filter(item => item.value > 0);
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">감정 일기</h1>
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
            { id: 'record', label: '기록', icon: FileEdit },
            { id: 'analysis', label: '분석', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
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
        {activeTab === 'record' && (
          <>
            {/* Calendar Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold">
                      {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </h2>
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => (
                      <div key={`empty-${i}`} className="h-10"></div>
                    ))}
                    
                    {/* Calendar days */}
                    {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                      const day = i + 1;
                      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const emotion = getEmotionForDate(dateStr);
                      
                      return (
                        <motion.button
                          key={day}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDateClick(day)}
                          className="h-10 w-10 rounded-full flex items-center justify-center relative hover:bg-gray-100 transition-colors"
                        >
                          {emotion ? (
                            <EmotionIcon type={emotion.emotion} size="sm" />
                          ) : (
                            <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">{day}</span>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {activeTab === 'analysis' && (
          <>
            {/* Weekly Emotion Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">주간 감정 변화</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[1, 5]} />
                        <Tooltip 
                          formatter={(value: number) => [
                            emotionTypes.find(t => t.value === value)?.label || '기록 없음',
                            '감정'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8b5cf6" 
                          strokeWidth={3} 
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emotion Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">감정 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getEmotionDistribution()}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getEmotionDistribution().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {getEmotionDistribution().map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">{item.value}회</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{emotionEntries.length}</div>
                      <div className="text-sm text-gray-600">총 기록 수</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {(emotionEntries.reduce((sum, entry) => {
                          const emotionValue = emotionTypes.find(t => t.id === entry.emotion)?.value || 3;
                          return sum + emotionValue;
                        }, 0) / Math.max(emotionEntries.length, 1)).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">평균 감정</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Emotion Recording Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('ko-KR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Emotion Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">오늘의 기분을 선택해주세요</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {emotionTypes.map((emotion) => (
                        <motion.button
                          key={emotion.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedEmotion(emotion.id)}
                          className={`p-3 rounded-lg text-center transition-all ${
                            selectedEmotion === emotion.id
                              ? 'bg-purple-100 border-2 border-purple-500'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <EmotionIcon type={emotion.id} size="md" />
                          <div className="text-xs font-medium text-gray-700 mt-2">{emotion.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Diary */}
                  <div>
                    <Label htmlFor="diary" className="text-sm font-medium mb-2 block">
                      오늘의 일기
                    </Label>
                    <textarea
                      id="diary"
                      value={diaryText}
                      onChange={(e) => setDiaryText(e.target.value)}
                      placeholder="오늘 하루는 어땠나요? 자유롭게 적어보세요..."
                      className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Daily Question */}
                  <div>
                    <Label htmlFor="daily-answer" className="text-sm font-medium mb-2 block">
                      {dailyQuestion}
                    </Label>
                    <Input
                      id="daily-answer"
                      value={dailyAnswer}
                      onChange={(e) => setDailyAnswer(e.target.value)}
                      placeholder="답변을 입력해주세요..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!selectedEmotion}
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    저장
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
