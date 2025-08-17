// Gemini API 메인 export 파일
export { default as GeminiClient } from './client';
export type { GeminiConfig } from './client';
export {
  HEALTH_ASSISTANT_PROMPT,
  PROMPT_TEMPLATES,
  createHealthPrompt,
  type HealthData,
} from './prompts';

// 싱글톤 인스턴스를 위한 팩토리 함수
import GeminiClientClass from './client';

let geminiClientInstance: GeminiClientClass | null = null;

export function getGeminiClient() {
  if (!geminiClientInstance) {
    geminiClientInstance = new GeminiClientClass();
  }
  return geminiClientInstance;
}
