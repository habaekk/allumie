'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  ArrowLeft,
  Plus,
  Brain,
  Heart,
  Activity,
  UtensilsCrossed,
  TrendingUp,
  Lightbulb,
  Mic,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '안녕하세요! 저는 당신의 건강을 관리하는 AI 어시스턴트입니다. 오늘은 어떤 도움이 필요하신가요?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const healthSummary = {
    weight: '65.2kg',
    bloodPressure: '120/80',
    heartRate: '72bpm',
    sleep: '7.5시간',
    steps: '8,432',
    mood: '8/10',
    lastMeal: '2시간 전',
    lastMedication: '1시간 전'
  };

  const quickActions = [
    { title: '건강 요약', icon: TrendingUp, color: 'bg-blue-100', textColor: 'text-blue-600' },
    { title: '식단 분석', icon: UtensilsCrossed, color: 'bg-orange-100', textColor: 'text-orange-600' },
    { title: '운동 추천', icon: Activity, color: 'bg-green-100', textColor: 'text-green-600' },
    { title: '감정 분석', icon: Brain, color: 'bg-purple-100', textColor: 'text-purple-600' },
  ];

  const suggestedQuestions = [
    "오늘의 건강 상태는 어때요?",
    "식단에 대한 조언을 주세요",
    "스트레스 관리는 어떻게 해야 할까요?",
    "수면 개선 방법을 알려주세요",
    "운동 계획을 세워주세요"
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('건강') || input.includes('상태')) {
      return `현재 건강 상태를 분석해드릴게요! 📊\n\n• 체중: ${healthSummary.weight}\n• 혈압: ${healthSummary.bloodPressure}\n• 심박수: ${healthSummary.heartRate}\n• 수면: ${healthSummary.sleep}\n• 걸음: ${healthSummary.steps}\n• 기분: ${healthSummary.mood}\n\n전반적으로 건강 상태가 양호합니다. 규칙적인 운동과 균형 잡힌 식단을 유지하시면 더욱 좋을 것 같아요!`;
    }
    
    if (input.includes('식단') || input.includes('음식') || input.includes('영양')) {
      return `오늘의 식단을 분석해보니 단백질은 충분하지만 탄수화물이 부족해요! 🍽️\n\n권장사항:\n• 아침: 단백질과 섬유질이 풍부한 오트밀\n• 점심: 닭가슴살과 채소가 든 샐러드\n• 저녁: 생선과 현미밥\n• 간식: 견과류나 그릭요거트\n\n하루 8잔의 물도 잊지 마세요! 💧`;
    }
    
    if (input.includes('운동') || input.includes('활동')) {
      return `오늘의 활동량을 보니 ${healthSummary.steps}걸음으로 목표의 84%를 달성했어요! 🚶‍♀️\n\n추천 운동:\n• 유산소: 30분 걷기 또는 조깅\n• 근력: 스쿼트, 플랭크, 푸시업\n• 유연성: 요가나 스트레칭\n\n현재 체중이 목표보다 0.2kg 높으니, 하루 500칼로리 정도 더 소모하면 좋을 것 같아요! 💪`;
    }
    
    if (input.includes('스트레스') || input.includes('감정') || input.includes('기분')) {
      return `오늘의 기분 점수는 ${healthSummary.mood}로 양호한 편이에요! 😊\n\n스트레스 관리 팁:\n• 깊은 호흡 운동 (4-7-8 호흡법)\n• 명상이나 마인드풀니스\n• 취미 활동 (독서, 음악 감상)\n• 친구나 가족과의 대화\n\n주말에는 기분이 더 좋아지는 경향이 있어요. 평일에도 작은 즐거움을 찾아보세요! 🌟`;
    }
    
    if (input.includes('수면') || input.includes('잠')) {
      return `수면 패턴을 분석해보니 평균 ${healthSummary.sleep}로 적절한 수면 시간을 유지하고 있어요! 😴\n\n수면 품질 향상 방법:\n• 취침 전 1시간 스마트폰 사용 자제\n• 시원하고 어두운 환경 유지\n• 규칙적인 취침 시간\n• 취침 전 따뜻한 차나 명상\n\n현재 수면 품질은 85%로 양호합니다. 더 나은 수면을 위해 위의 방법들을 시도해보세요!`;
    }
    
    return `죄송해요, 질문을 정확히 이해하지 못했어요. 🤔\n\n다음과 같은 질문을 해보세요:\n• "오늘의 건강 상태는 어때요?"\n• "식단에 대한 조언을 주세요"\n• "운동 계획을 세워주세요"\n• "스트레스 관리 방법을 알려주세요"\n\n더 구체적으로 질문해주시면 더 정확한 답변을 드릴 수 있어요!`;
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: { [key: string]: string } = {
      '건강 요약': '오늘의 건강 상태를 요약해드릴게요!',
      '식단 분석': '현재 식단을 분석하고 개선점을 찾아보겠습니다.',
      '운동 추천': '당신에게 맞는 운동을 추천해드릴게요!',
      '감정 분석': '최근 감정 상태를 분석해보겠습니다.'
    };

    setInputValue(actionMessages[action] || action);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-6"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Health Chat</h1>
            <p className="text-gray-600">건강 데이터 기반 AI 상담</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-4"
      >
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction(action.title)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <action.icon className={`w-5 h-5 ${action.textColor}`} />
              </div>
              <div className="text-sm font-medium text-gray-700 text-center">{action.title}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Suggested Questions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 mb-4"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {suggestedQuestions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestedQuestion(question)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="px-4 py-2 bg-white text-sm text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow whitespace-nowrap flex-shrink-0"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="px-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-green-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}>
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-2">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Mic className="w-5 h-5 text-gray-500" />
          </Button>
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="건강에 대해 질문해보세요..."
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="fixed bottom-24 right-6"
      >
        <Button 
          size="lg" 
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}
