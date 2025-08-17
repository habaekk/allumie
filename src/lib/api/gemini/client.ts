import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiConfig {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

class GeminiClient {
  private client: GoogleGenerativeAI;
  private defaultConfig: GeminiConfig;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.defaultConfig = {
      model: 'gemini-2.0-flash-exp',
      temperature: 0.7,
      maxOutputTokens: 8192,
    };
  }

  async generateText(
    prompt: string,
    config?: GeminiConfig
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const model = this.client.getGenerativeModel({
      model: finalConfig.model!,
      systemInstruction: finalConfig.systemInstruction,
      generationConfig: {
        temperature: finalConfig.temperature,
        maxOutputTokens: finalConfig.maxOutputTokens,
      },
    });

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI 응답을 생성하는 중 오류가 발생했습니다.');
    }
  }

  async generateTextWithHistory(
    messages: Array<{ role: 'user' | 'model'; content: string }>,
    config?: GeminiConfig
  ): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    const model = this.client.getGenerativeModel({
      model: finalConfig.model!,
      systemInstruction: finalConfig.systemInstruction,
      generationConfig: {
        temperature: finalConfig.temperature,
        maxOutputTokens: finalConfig.maxOutputTokens,
      },
    });

    try {
      // 사용자 메시지만 필터링하여 유효한 히스토리 생성
      const userMessages = messages.filter(msg => msg.role === 'user');
      
      // 히스토리가 비어있거나 첫 번째 메시지가 user가 아닌 경우 단순 생성 사용
      if (userMessages.length === 0 || messages[0]?.role !== 'user') {
        const lastUserMessage = messages[messages.length - 1];
        return await this.generateText(lastUserMessage.content, config);
      }

      // 마지막 메시지를 제외한 대화 히스토리 생성
      const history = messages.slice(0, -1)
        .filter(msg => msg.role === 'user' || msg.role === 'model')
        .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        }));

      // 히스토리가 비어있으면 단순 생성 사용
      if (history.length === 0) {
        const lastMessage = messages[messages.length - 1];
        return await this.generateText(lastMessage.content, config);
      }

      // 첫 번째 히스토리 항목이 user인지 확인
      if (history[0]?.role !== 'user') {
        // 첫 번째가 model이면 해당 항목 제거
        history.shift();
      }

      const chat = model.startChat({ history });
      
      // 마지막 메시지 전송
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI 응답을 생성하는 중 오류가 발생했습니다.');
    }
  }
}

export default GeminiClient;
export type { GeminiConfig };
