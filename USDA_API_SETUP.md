# USDA FoodData Central API 설정 가이드

이 프로젝트에서 구현된 USDA FoodData Central API 서비스 사용법과 설정 방법을 안내합니다.

## 📋 개요

USDA FoodData Central API는 미국 농무부에서 제공하는 공식 영양소 데이터베이스 API입니다. 이 서비스를 통해 다음과 같은 기능을 제공합니다:

- **정확한 영양소 정보**: 정부 공인 데이터로 신뢰성 높은 영양소 정보
- **다양한 식품 데이터**: Foundation Foods, SR Legacy, Branded Foods 등
- **무료 사용**: 시간당 1000회 요청까지 무료
- **오프라인 대체**: API 사용 불가 시 로컬 데이터로 대체

## 🔑 API 키 발급

### 1. USDA API 키 발급
1. [Data.gov](https://api.data.gov/signup/) 방문
2. 회원가입 및 이메일 인증
3. API 키 발급 (즉시 사용 가능)

### 2. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일 생성:

```env
# USDA FoodData Central API
NEXT_PUBLIC_USDA_API_KEY=your_actual_api_key_here

# 더 이상 Nutritionix API는 사용하지 않습니다.
# USDA API와 로컬 데이터만 사용
```

### 3. DEMO_KEY 사용 (개발 중)
API 키가 없어도 `DEMO_KEY`로 테스트 가능하지만 제한사항이 있습니다:
- 시간당 30회 요청 제한
- 프로덕션 사용 불가

## 🚀 사용법

### 기본 음식 검색
```typescript
import { FoodDataService } from '@/lib/mealService';

// 통합 검색 (USDA + 로컬 데이터)
const results = await FoodDataService.searchFood('apple', {
  includeUSDA: true,
  dataTypes: ['Foundation', 'SR Legacy', 'Branded'],
  maxResults: 20
});

// USDA만 검색
import { usdaApi } from '@/lib/usdaService';
const usdaResults = await usdaApi.search('chicken breast');
```

### 영양소 정보 조회
```typescript
// 통합 영양소 조회
const nutrition = await FoodDataService.getFoodNutrition('usda_123456', 1.5);

// USDA 상세 정보
const foodDetail = await FoodDataService.getUSDAFoodDetail(123456);
```

### API 상태 확인
```typescript
const status = await FoodDataService.checkAPIStatus();
console.log(status);
// { usda: true, offline: true }
```

### 검색 제안
```typescript
const suggestions = await FoodDataService.getSearchSuggestions('chick');
// ['Chicken breast', 'Chicken thigh', 'Chicken soup', ...]
```

## 📊 API 엔드포인트

### 1. 음식 검색 (`/foods/search`)
```typescript
import { USDAFoodService } from '@/lib/usdaService';

const results = await USDAFoodService.searchFoods({
  query: 'banana',
  dataType: ['Foundation', 'Branded'],
  pageSize: 25,
  sortBy: 'relevance'
});
```

### 2. 음식 상세 정보 (`/food/{fdcId}`)
```typescript
const foodDetail = await USDAFoodService.getFoodDetail(123456);
```

### 3. 다중 음식 조회 (`/foods`)
```typescript
const foods = await USDAFoodService.getMultipleFoods([123456, 789012]);
```

### 4. 음식 목록 (`/foods/list`)
```typescript
const foodList = await USDAFoodService.getFoodsList({
  dataType: ['Foundation'],
  pageSize: 50,
  sortBy: 'fdcId'
});
```

## 🏗️ 구조

### 주요 파일
- `src/lib/usdaService.ts` - USDA API 서비스 클래스
- `src/lib/usdaUtils.ts` - USDA 데이터 처리 유틸리티
- `src/lib/types.ts` - USDA API 타입 정의
- `src/lib/mealService.ts` - 통합 식품 데이터 서비스

### 타입 정의
```typescript
// 검색 결과
interface USDAFoodSearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner?: string;
  score?: number;
}

// 상세 정보
interface USDAFoodDetail {
  fdcId: number;
  description: string;
  foodNutrients: USDAFoodNutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}
```

## 🔄 데이터 흐름

1. **사용자 검색** → `FoodDataService.searchFood()`
2. **USDA API 호출** → 정부 데이터베이스에서 검색
3. **결과 변환** → 표준 `FoodSearchResult` 형식으로 변환
4. **로컬 데이터 보완** → 오프라인 및 로컬 저장 데이터로 보완
5. **중복 제거** → 유사한 결과 제거
6. **결과 반환** → 통합된 검색 결과 제공

## 📈 성능 최적화

### 캐싱 전략
```typescript
// 로컬 스토리지 캐싱
import { LocalFoodService } from '@/lib/mealService';

// 자주 검색하는 음식 저장
LocalFoodService.saveLocalFood(foodResult);

// 로컬 캐시에서 빠른 검색
const cachedResults = LocalFoodService.searchLocalFood('chicken');
```

### 오프라인 지원
```typescript
// 네트워크 오류 시 자동으로 오프라인 데이터 사용
try {
  const onlineResults = await USDAFoodService.searchFoods(params);
} catch (error) {
  const offlineResults = getOfflineFoodResults(query);
  return offlineResults;
}
```

## 🚨 제한사항 및 주의사항

### API 제한
- **요청 한도**: 시간당 1,000회 (IP 주소별)
- **페이지 크기**: 최대 200개 결과
- **다중 조회**: 최대 20개 FDC ID

### 오류 처리
```typescript
try {
  const results = await usdaApi.search('apple');
} catch (error) {
  if (error.message.includes('429')) {
    // 요청 한도 초과 - 1시간 후 재시도
    console.log('API 요청 한도 초과');
  } else if (error.message.includes('401')) {
    // 인증 오류 - API 키 확인
    console.log('API 키 확인 필요');
  }
}
```

### 데이터 품질
```typescript
import { calculateFoodQualityScore } from '@/lib/usdaUtils';

// 음식 데이터 품질 점수 (0-100)
const qualityScore = calculateFoodQualityScore(foodDetail);
if (qualityScore < 50) {
  console.warn('낮은 품질의 데이터');
}
```

## 🔧 디버깅

### API 키 검증
```typescript
const isValid = await USDAFoodService.validateApiKey();
if (!isValid) {
  console.error('USDA API 키가 유효하지 않습니다');
}
```

### 디버그 정보
```typescript
import { generateDebugInfo } from '@/lib/usdaUtils';

const debugInfo = generateDebugInfo(foodDetail);
console.log('디버그 정보:', debugInfo);
```

### API 한도 확인
```typescript
const limits = USDAFoodService.getApiLimits();
console.log('API 제한:', limits);
// { requestsPerHour: 1000, maxPageSize: 200, maxFoodIds: 20, usingDemoKey: false }
```

## 📚 추가 리소스

- [USDA FoodData Central 공식 문서](https://fdc.nal.usda.gov/api-guide)
- [Data.gov API 키 관리](https://api.data.gov/docs/api-key/)
- [FDC 데이터 타입 설명](https://fdc.nal.usda.gov/data-documentation)
- [OpenAPI 스펙](https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1)

## 🎯 다음 단계

1. **프로덕션 배포 전**: 실제 API 키 설정
2. **성능 모니터링**: API 요청 수 추적
3. **캐싱 최적화**: Redis 등을 이용한 서버 사이드 캐싱
4. **에러 리포팅**: Sentry 등을 이용한 오류 추적
