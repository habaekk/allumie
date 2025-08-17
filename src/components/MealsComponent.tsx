'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Pill
} from 'lucide-react';
import MealsTab from './MealsTab';
import MedsTab from './MedsTab';



export default function MealsComponent() {
  const [activeTab, setActiveTab] = useState('meals');
  
  // 토스트 메시지 상태
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'info'}>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // 토스트 메시지 표시 함수
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
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
          <MealsTab />
        ) : (
          <MedsTab onToast={showToast} />
        )}
      </div>

      
      {/* 토스트 메시지 */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <span className="text-lg">✅</span>
              ) : (
                <span className="text-lg">ℹ️</span>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
