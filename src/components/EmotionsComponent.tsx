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
const EmotionIcon = ({ type, size = 'md' }: { type: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
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

  // 이전/현재/다음 달 생성
  const getPrevMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  };

  const getNextMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // 오늘 날짜 기준으로 최근 1주일 예시 데이터 생성
  const generateRecentWeekData = () => {
    const today = new Date();
    const data: EmotionEntry[] = [];
    
    const sampleEmotions = ['excellent', 'good', 'neutral', 'bad', 'good', 'excellent', 'neutral'];
    const sampleDiaries = [
      '오늘은 정말 완벽한 하루였다! 모든 일이 순조롭게 진행되었고 기분이 너무 좋았어.',
      '평범하지만 괜찮은 하루. 업무도 적당히 잘 풀렸고 저녁에는 좋아하는 드라마를 봤다.',
      '그냥 평범한 하루. 특별할 것도 나쁠 것도 없었던 보통의 일상.',
      '좀 힘든 하루였다. 일이 생각보다 복잡했고 스트레스가 쌓였다.',
      '친구들과 만나서 즐거운 시간을 보냈다. 오랜만에 웃으면서 대화할 수 있어서 좋았어.',
      '새로운 도전을 시작했다! 설레고 기대되는 하루였다.',
      '조용히 혼자만의 시간을 가졌다. 책도 읽고 음악도 들으며 여유로웠어.'
    ];
    const sampleAnswers = [
      '프로젝트가 성공적으로 마무리된 순간',
      '동료와 함께 점심을 먹으며 나눈 대화',
      '평소와 다름없이 흘러간 하루',
      '예상보다 오래 걸린 업무 처리',
      '친구들과 함께 웃으며 보낸 저녁 시간',
      '새로운 목표를 세우고 계획을 짠 시간',
      '혼자 카페에서 책을 읽던 고요한 오후'
    ];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i - 1);
      const dateStr = formatDate(date.getFullYear(), date.getMonth(), date.getDate());
      
      data.push({
        date: dateStr,
        emotion: sampleEmotions[6 - i],
        diary: sampleDiaries[6 - i],
        dailyAnswer: sampleAnswers[6 - i]
      });
    }
    
    return data;
  };

  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>(generateRecentWeekData());

  const getEmotionForDate = (dateStr: string) => {
    return emotionEntries.find(entry => entry.date === dateStr);
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // 스와이프 및 드래그 관련 state
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    setStartX(x);
    setCurrentX(x);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const x = e.touches[0].clientX;
    setCurrentX(x);
    const offset = x - startX;
    const maxOffset = window.innerWidth * 0.3; // 화면 너비의 30%로 제한
    setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, offset)));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    setIsDragging(false);
    
    // 50px 이상 스와이프시 월 변경
    if (Math.abs(diffX) > 50) {
      setIsTransitioning(true);
      
      if (diffX > 0) {
        // 왼쪽 스와이프 - 다음 달로 슬라이딩 (컨테이너의 1/3 지점까지)
        const containerWidth = window.innerWidth;
        setDragOffset(-containerWidth / 3);
        setTimeout(() => {
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
          setDragOffset(0);
          setIsTransitioning(false);
        }, 300);
      } else {
        // 오른쪽 스와이프 - 이전 달로 슬라이딩 (컨테이너의 1/3 지점까지)
        const containerWidth = window.innerWidth;
        setDragOffset(containerWidth / 3);
        setTimeout(() => {
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
          setDragOffset(0);
          setIsTransitioning(false);
        }, 300);
      }
    } else {
      // 원위치로 복귀
      setIsTransitioning(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    const x = e.clientX;
    setStartX(x);
    setCurrentX(x);
    setIsDragging(true);
    setDragOffset(0);
    e.preventDefault(); // 텍스트 선택 방지
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const x = e.clientX;
    setCurrentX(x);
    const offset = x - startX;
    const maxOffset = window.innerWidth * 0.3; // 화면 너비의 30%로 제한
    setDragOffset(Math.max(-maxOffset, Math.min(maxOffset, offset)));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const endX = e.clientX;
    const diffX = startX - endX;
    
    setIsDragging(false);
    
    // 50px 이상 드래그시 월 변경
    if (Math.abs(diffX) > 50) {
      setIsTransitioning(true);
      
      if (diffX > 0) {
        // 왼쪽 드래그 - 다음 달로 슬라이딩 (컨테이너의 1/3 지점까지)
        const containerWidth = window.innerWidth;
        setDragOffset(-containerWidth / 3);
        setTimeout(() => {
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
          setDragOffset(0);
          setIsTransitioning(false);
        }, 300);
      } else {
        // 오른쪽 드래그 - 이전 달로 슬라이딩 (컨테이너의 1/3 지점까지)
        const containerWidth = window.innerWidth;
        setDragOffset(containerWidth / 3);
        setTimeout(() => {
          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
          setDragOffset(0);
          setIsTransitioning(false);
        }, 300);
      }
    } else {
      // 원위치로 복귀
      setIsTransitioning(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  // 마우스가 달력 영역을 벗어났을 때 드래그 종료
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsTransitioning(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleDateClick = (day: number) => {
    // 드래그 중이거나 전환 중이면 클릭 무시
    if (isDragging || isTransitioning || Math.abs(dragOffset) > 5) return;
    
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

  // 개별 달력 렌더링 함수
  const renderCalendarMonth = (date: Date, isCurrentMonth: boolean = false) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    
    return (
      <div className={`grid grid-cols-7 gap-1 ${!isCurrentMonth ? 'opacity-30' : ''}`}>
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="h-12"></div>
        ))}
        
        {/* Calendar days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = formatDate(date.getFullYear(), date.getMonth(), day);
          const emotion = getEmotionForDate(dateStr);
          // 오늘 날짜 체크 - 현재 월일 때만 체크하도록 조건 추가
          const todayFlag = isCurrentMonth && isToday(date.getFullYear(), date.getMonth(), day);
          
          return (
            <motion.button
              key={day}
              whileHover={isCurrentMonth && !isTransitioning ? { scale: 1.05 } : {}}
              whileTap={isCurrentMonth && !isTransitioning ? { scale: 0.95 } : {}}
              onClick={() => isCurrentMonth && !isTransitioning && handleDateClick(day)}
              disabled={!isCurrentMonth || isTransitioning}
              className={`h-12 w-12 rounded-full flex items-center justify-center relative transition-all duration-200 ${
                todayFlag 
                  ? 'ring-2 ring-purple-500 ring-offset-1 bg-purple-50' 
                  : isCurrentMonth ? 'hover:bg-gray-100' : ''
              }`}
            >
              {emotion ? (
                <div className="relative">
                  <EmotionIcon type={emotion.emotion} size="md" />
                  {todayFlag && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              ) : (
                <div className={`w-8 h-8 border-2 border-dashed rounded-full flex items-center justify-center ${
                  todayFlag 
                    ? 'border-purple-400 bg-purple-100' 
                    : 'border-gray-300'
                }`}>
                  <span className={`text-sm font-medium ${
                    todayFlag 
                      ? 'text-purple-600' 
                      : 'text-gray-500'
                  }`}>
                    {day}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-2"
      >
            <h1 className="text-2xl font-bold text-gray-900">Emotions</h1>
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
                      onClick={() => {
                        if (isDragging || isTransitioning) return;
                        setIsTransitioning(true);
                        const containerWidth = window.innerWidth;
                        setDragOffset(containerWidth / 3);
                        setTimeout(() => {
                          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                          setDragOffset(0);
                          setIsTransitioning(false);
                        }, 300);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold">
                      {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </h2>
                    <button
                      onClick={() => {
                        if (isDragging || isTransitioning) return;
                        setIsTransitioning(true);
                        const containerWidth = window.innerWidth;
                        setDragOffset(-containerWidth / 3);
                        setTimeout(() => {
                          setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                          setDragOffset(0);
                          setIsTransitioning(false);
                        }, 300);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Calendar Grid Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* 연속 달력 컨테이너 */}
                  <div className="overflow-hidden">
                    <div 
                      className={`flex select-none cursor-grab active:cursor-grabbing ${
                        isTransitioning ? 'transition-transform duration-300 ease-out' : ''
                      }`}
                      style={{
                        transform: `translateX(calc(-33.333% + ${dragOffset}px))`,
                        opacity: isDragging ? 0.9 : 1,
                        width: '300%'
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* 이전 달 */}
                      <div className="w-1/3 px-1">
                        {renderCalendarMonth(getPrevMonth(), false)}
                      </div>
                      
                      {/* 현재 달 */}
                      <div className="w-1/3 px-1">
                        {renderCalendarMonth(currentDate, true)}
                      </div>
                      
                      {/* 다음 달 */}
                      <div className="w-1/3 px-1">
                        {renderCalendarMonth(getNextMonth(), false)}
                      </div>
                    </div>
                  </div>
                  
                  {/* 스와이프/드래그 힌트 */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                      {isDragging ? '드래그하여 월 이동...' : '스와이프하거나 드래그하여 월 이동'}
                    </p>
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
