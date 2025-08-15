'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  Heart,
  Home,
  Brain,
  MessageCircle,
  Plus,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EmotionsComponent from '@/components/EmotionsComponent';
import HealthComponent from '@/components/HealthComponent';
import MealsComponent from '@/components/MealsComponent';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  path: string;
}

interface QuickAction {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
  path: string;
  description: string;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentComponent, setCurrentComponent] = useState('home');
  const router = useRouter();

  const tabs: Tab[] = [
    { id: 'meals', label: 'Meals & Meds', icon: UtensilsCrossed, color: 'text-orange-500', path: '/meals' },
    { id: 'health', label: 'Health', icon: Heart, color: 'text-red-500', path: '/health' },
    { id: 'home', label: 'Home', icon: Home, color: 'text-blue-500', path: '/' },
    { id: 'emotions', label: 'Emotions', icon: Brain, color: 'text-purple-500', path: '/emotions' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, color: 'text-green-500', path: '/chat' },
  ];

  const quickActions: QuickAction[] = [
    { title: '건강검진 체크', icon: Heart, color: 'bg-red-100', textColor: 'text-red-600', path: '/health', description: '최근 건강검진 결과 확인하기' },
    { title: '식단 & 약 복용', icon: UtensilsCrossed, color: 'bg-orange-100', textColor: 'text-orange-600', path: '/meals', description: '아침 점심 저녁 식단과 약을 한번에' },
    { title: '감정 일기', icon: Brain, color: 'bg-purple-100', textColor: 'text-purple-600', path: '/emotions', description: '이모지와 메모로 오늘 기분 기록' },
    { title: '통합 리포트', icon: BarChart3, color: 'bg-green-100', textColor: 'text-green-600', path: '/chat', description: '주간 건강 요약 보기' },
  ];

  // const healthSummary = [
  //   { label: '체중', value: '65.2kg', change: '+0.3kg', trend: 'up' },
  //   { label: '혈압', value: '120/80', change: '정상', trend: 'stable' },
  //   { label: '수면', value: '7.5시간', change: '+0.5시간', trend: 'up' },
  //   { label: '활동량', value: '8,432', change: '+1,200', trend: 'up' },
  // ];

  const handleTabClick = (tab: Tab) => {
    // Chat 탭을 클릭했을 때는 별도 페이지로 라우팅
    if (tab.id === 'chat') {
      router.push('/chat');
      return;
    }
    
    setActiveTab(tab.id);
    setCurrentComponent(tab.id);
  };

  const handleQuickActionClick = (action: QuickAction) => {
    // Chat 페이지로 가는 액션일 때는 라우팅
    if (action.path === '/chat') {
      router.push('/chat');
      return;
    }
    
    setActiveTab(action.path.replace('/', '') || 'home');
    setCurrentComponent(action.path.replace('/', '') || 'home');
  };

  // 컴포넌트 렌더링 함수
  const renderComponent = () => {
    switch (currentComponent) {
      case 'emotions':
        return <EmotionsComponent />;
      case 'health':
        return <HealthComponent />;
      case 'meals':
        return <MealsComponent />;
      default:
        return renderHomeContent();
    }
  };

  // 홈 컨텐츠 렌더링 함수
  const renderHomeContent = () => (
    <>
      {/* Profile Background Section */}
      <div className="relative">
        {/* Background Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-30 bg-green-300"
        />

        {/* Profile Section */}
        <div className="relative px-4 -mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-end space-x-4 mb-4"
          >
            {/* Profile Image & User Info */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-28 h-28 bg-white rounded-2xl p-1 shadow-lg">
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <div
                      className="w-16 h-8 transform rotate-135"
                      style={{
                        background: 'linear-gradient(45deg, #FF6B35 0%, #FF6B35 50%, #4ECDC4 50%, #4ECDC4 100%)',
                        borderRadius: '50px'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 pb-2">
                <h2 className="text-xl font-bold text-gray-900 mb-1">정유진</h2>
                <p className="text-gray-600 flex items-center">
                  🌸
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 pl-5"
        >
          <p className="text-m text-gray-900">안녕하세요 정유진님</p>
          <p className="text-m text-gray-900">오늘도 건강과 감정을 제가 챙겨드릴게요.</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-2 space-y-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Home</h2>
            <Button
              size="sm"
              className="bg-green-300 hover:bg-green-400 text-gray-700 rounded-2xl px-3 py-1 text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex flex-col cursor-pointer mb-4"
                onClick={() => handleQuickActionClick(action)}
              >
                <Card className="mb-2 rounded-md">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 flex items-center justify-center mx-auto">
                      <action.icon className={`w-8 h-8 ${action.textColor}`} />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex flex-col pl-2">
                  <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{action.description || '설명을 추가해주세요'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </>
  );

  return (
    <div className="min-h-screen pb-20 bg-gray-50">


      {/* Component Content */}
      {renderComponent()}

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2"
      >
        <div className="flex items-center">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabClick(tab)}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${activeTab === tab.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'text-blue-600' : tab.color}`} />
              <span className="text-xs font-medium whitespace-nowrap text-center min-w-0 truncate">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}