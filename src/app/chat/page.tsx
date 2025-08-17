'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Send,
  Bot,
  User,
  ArrowLeft,
  Brain,
  Activity,
  UtensilsCrossed,
  TrendingUp,
  Mic,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { getGeminiClient, createHealthPrompt, type HealthData } from '@/lib/api/gemini';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: Record<string, unknown>;
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
  const suggestedQuestionsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const healthSummary: HealthData = {
    weight: '65.2kg',
    bloodPressure: '120/80',
    heartRate: '72bpm',
    sleep: '7.5시간',
    steps: '8,432',
    mood: '8/10',
    lastMeal: '2시간 전',
    lastMedication: '1시간 전'
  };



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
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Gemini AI를 사용하여 응답 생성
      const geminiClient = getGeminiClient();
      
      // 대화 히스토리 구성 (초기 봇 메시지 제외)
      const conversationHistory = messages
        .filter((msg, index) => !(index === 0 && msg.type === 'bot')) // 첫 번째 봇 메시지 제외
        .map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'model' as const,
          content: msg.content
        }));
      
      // 현재 메시지 추가
      conversationHistory.push({
        role: 'user' as const,
        content: currentInput
      });

      // 건강 데이터와 함께 프롬프트 생성
      const enhancedPrompt = createHealthPrompt(currentInput, healthSummary);
      
      // AI 응답 생성 (실제 사용자 대화가 있는 경우에만 히스토리 사용)
      const userMessagesCount = conversationHistory.filter(msg => msg.role === 'user').length;
      const aiResponse = userMessagesCount > 1
        ? await geminiClient.generateTextWithHistory(conversationHistory, {
            systemInstruction: enhancedPrompt
          })
        : await geminiClient.generateText(currentInput, {
            systemInstruction: enhancedPrompt
          });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI 응답 생성 오류:', error);
      
      // 오류 발생 시 폴백 응답
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '죄송합니다. 현재 AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요. 🤖',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };




  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  // 드래그 스크롤 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (suggestedQuestionsRef.current?.offsetLeft || 0));
    setScrollLeft(suggestedQuestionsRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (suggestedQuestionsRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    if (suggestedQuestionsRef.current) {
      suggestedQuestionsRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // 터치 이벤트 핸들러 (모바일 지원)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (suggestedQuestionsRef.current?.offsetLeft || 0));
    setScrollLeft(suggestedQuestionsRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (suggestedQuestionsRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (suggestedQuestionsRef.current) {
      suggestedQuestionsRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100 px-4 py-2"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => {
            scrollToTop();
            router.back();
          }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Health Chat</h1>
          </div>
        </div>
      </motion.div>

      {/* Suggested Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 mb-4 mt-2"
      >
        <div 
          ref={suggestedQuestionsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            userSelect: isDragging ? 'none' : 'auto'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {suggestedQuestions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(_e) => {
                if (!isDragging) {
                  handleSuggestedQuestion(question);
                }
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="px-4 py-2 bg-white text-sm text-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow whitespace-nowrap flex-shrink-0 pointer-events-auto"
              style={{ userSelect: 'none' }}
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                    }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                    }`}>
                    {message.type === 'bot' ? (
                      <MarkdownRenderer 
                        content={message.content}
                        className="text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      />
                    ) : (
                      <div className="whitespace-pre-line text-sm">{message.content}</div>
                    )}
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
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
    </div>
  );
}
