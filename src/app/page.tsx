'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Heart, 
  Home, 
  Brain, 
  MessageCircle,
  Plus,
  TrendingUp,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentComponent, setCurrentComponent] = useState('home');

  const tabs: Tab[] = [
    { id: 'meals', label: 'Meals & Meds', icon: UtensilsCrossed, color: 'text-orange-500', path: '/meals' },
    { id: 'health', label: 'Health', icon: Heart, color: 'text-red-500', path: '/health' },
    { id: 'home', label: 'Home', icon: Home, color: 'text-blue-500', path: '/' },
    { id: 'emotions', label: 'Emotions', icon: Brain, color: 'text-purple-500', path: '/emotions' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, color: 'text-green-500', path: '/chat' },
  ];

  const quickActions: QuickAction[] = [
    { title: '오늘의 식단', icon: UtensilsCrossed, color: 'bg-orange-100', textColor: 'text-orange-600', path: '/meals' },
    { title: '건강 체크', icon: Heart, color: 'bg-red-100', textColor: 'text-red-600', path: '/health' },
    { title: '감정 기록', icon: Brain, color: 'bg-purple-100', textColor: 'text-purple-600', path: '/emotions' },
    { title: 'AI 상담', icon: MessageCircle, color: 'bg-green-100', textColor: 'text-green-600', path: '/chat' },
  ];

  const healthSummary = [
    { label: '체중', value: '65.2kg', change: '+0.3kg', trend: 'up' },
    { label: '혈압', value: '120/80', change: '정상', trend: 'stable' },
    { label: '수면', value: '7.5시간', change: '+0.5시간', trend: 'up' },
    { label: '활동량', value: '8,432', change: '+1,200', trend: 'up' },
  ];

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id);
    setCurrentComponent(tab.id);
  };

  const handleQuickActionClick = (action: QuickAction) => {
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
      case 'chat':
        return (
          <div className="min-h-screen pb-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Health Chat</h1>
                <p className="text-gray-600">건강 데이터 기반 AI 상담</p>
                <p className="text-sm text-gray-500 mt-2">(Chat 기능은 별도 구현 예정)</p>
              </div>
            </div>
          </div>
        );
      default:
        return renderHomeContent();
    }
  };

  // 홈 컨텐츠 렌더링 함수
  const renderHomeContent = () => (
    <>
      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleQuickActionClick(action)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className={`w-6 h-6 ${action.textColor}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{action.title}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Health Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">오늘의 건강 요약</h2>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                건강 지표
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthSummary.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{item.value}</div>
                    <div className={`text-xs ${
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {item.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Goal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6" />
                <h3 className="text-lg font-semibold">오늘의 목표</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>물 마시기</span>
                  <span className="text-blue-200">6/8잔</span>
                </div>
                <div className="w-full bg-blue-400 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span>걸음 수</span>
                  <span className="text-blue-200">8,432/10,000</span>
                </div>
                <div className="w-full bg-blue-400 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </>
  );

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">안녕하세요! 👋</h1>
            <p className="text-gray-600">오늘도 건강한 하루 되세요</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
        </div>
      </motion.div>

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
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${
                activeTab === tab.id 
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