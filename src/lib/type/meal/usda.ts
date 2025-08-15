export interface USDAFoodSearchResult {
    fdcId: number;
    description: string;
    dataType: string;
    gtinUpc?: string;
    publishedDate?: string;
    brandOwner?: string;
    ingredients?: string;
    allHighlightFields?: string;
    score?: number;
  }
  
  export interface USDAFoodSearchResponse {
    foods?: USDAFoodSearchResult[];
    totalHits?: number;
    currentPage?: number;
    totalPages?: number;
  }
  
  export interface USDAFoodNutrient {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    derivationCode?: string;
    derivationDescription?: string;
    derivationId?: number;
    value: number;
    foodNutrientSourceId?: number;
    foodNutrientSourceCode?: string;
    foodNutrientSourceDescription?: string;
    rank?: number;
    indentLevel?: number;
    foodNutrientId?: number;
  }
  
  export interface USDAFoodDetail {
    fdcId: number;
    description: string;
    dataType: string;
    gtinUpc?: string;
    publishedDate?: string;
    brandOwner?: string;
    brandName?: string;
    ingredients?: string;
    marketCountry?: string;
    foodCategory?: string;
    modifiedDate?: string;
    dataSource?: string;
    packageWeight?: string;
    servingSizeUnit?: string;
    servingSize?: number;
    householdServingFullText?: string;
    foodNutrients: USDAFoodNutrient[];
    foodAttributes?: Array<{
      id: number;
      name: string;
      value: string;
    }>;
    foodVersionIds?: number[];
  }
  
  export interface USDANutrientMap {
    Energy: number; // 208 - kcal
    Protein: number; // 203 - g
    'Total lipid (fat)': number; // 204 - g
    'Carbohydrate, by difference': number; // 205 - g
    'Fiber, total dietary'?: number; // 291 - g
    'Sugars, total including NLEA'?: number; // 269 - g
    'Sodium, Na'?: number; // 307 - mg
    'Cholesterol'?: number; // 601 - mg
    'Calcium, Ca'?: number; // 301 - mg
    'Iron, Fe'?: number; // 303 - mg
    'Vitamin C, total ascorbic acid'?: number; // 401 - mg
    'Vitamin A, IU'?: number; // 318 - IU
  }
  
  // USDA API 요청 파라미터
  export interface USDASearchParams {
    query: string;
    dataType?: string[];
    pageSize?: number;
    pageNumber?: number;
    sortBy?: 'dataType.keyword' | 'lowercaseDescription.keyword' | 'fdcId' | 'publishedDate';
    sortOrder?: 'asc' | 'desc';
    brandOwner?: string;
  }
  
  export interface USDAFoodListParams {
    dataType?: string[];
    pageSize?: number;
    pageNumber?: number;
    sortBy?: 'dataType.keyword' | 'lowercaseDescription.keyword' | 'fdcId' | 'publishedDate';
    sortOrder?: 'asc' | 'desc';
  }

  export interface NutritionInfo {
    calories: number;      // 칼로리 (kcal)
    protein: number;       // 단백질 (g)
    carbs: number;         // 탄수화물 (g)
    fat: number;           // 지방 (g)
    fiber?: number;        // 섬유질 (g)
    sugar?: number;        // 당류 (g)
    sodium?: number;       // 나트륨 (mg)
    cholesterol?: number;  // 콜레스테롤 (mg)
  }
  
  // USDA API 응답 포맷터용 타입
  export interface ConvertedUSDAFood {
    id: string;
    fdcId: number;
    name: string;
    category: string;
    brand?: string;
    dataType: string;
    nutrition: NutritionInfo;
    servingSize?: {
      amount: number;
      unit: string;
      description?: string;
    };
    ingredients?: string;
  }