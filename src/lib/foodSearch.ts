import foodsData from './data/foods.json';

export interface FoodNutrition {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  코드: string;
}

interface FoodRecord {
  식품코드: string;
  식품명: string;
  '에너지(kcal)': string;
  '단백질(g)': string;
  '탄수화물(g)': string;
  '지방(g)': string;
  '식이섬유(g)': string;
}

// 음식 데이터를 FoodNutrition 형태로 변환
export function convertToFoodNutrition(record: FoodRecord): FoodNutrition {
  return {
    name: record.식품명,
    calories: parseFloat(record['에너지(kcal)']) || 0,
    protein: parseFloat(record['단백질(g)']) || 0,
    carbohydrates: parseFloat(record['탄수화물(g)']) || 0,
    fat: parseFloat(record['지방(g)']) || 0,
    fiber: parseFloat(record['식이섬유(g)']) || 0,
    코드: record.식품코드,
  };
}

// 음식 이름으로 검색
export function searchFoods(query: string, limit: number = 10): FoodNutrition[] {
  if (!query || query.trim().length < 1) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const records = foodsData.records as FoodRecord[];
  
  const matches = records
    .filter((record) => 
      record.식품명.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit)
    .map(convertToFoodNutrition);

  return matches;
}

// 정확한 음식 이름으로 찾기
export function findFoodByName(name: string): FoodNutrition | null {
  const records = foodsData.records as FoodRecord[];
  const record = records.find(r => r.식품명 === name);
  
  if (record) {
    return convertToFoodNutrition(record);
  }
  
  return null;
}

// 음식 코드로 찾기
export function findFoodByCode(code: string): FoodNutrition | null {
  const records = foodsData.records as FoodRecord[];
  const record = records.find(r => r.식품코드 === code);
  
  if (record) {
    return convertToFoodNutrition(record);
  }
  
  return null;
}
