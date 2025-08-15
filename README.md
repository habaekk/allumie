# Allumie - NextJS MVP

NextJS 15 기반의 빠른 MVP 개발을 위한 프로젝트입니다. 모든 주요 기능과 라이브러리가 통합되어 있어 즉시 개발을 시작할 수 있습니다.

## 🚀 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: SWR (향후 TanStack Query로 전환 예정)
- **Form Validation**: React Hook Form
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## ✨ 주요 기능

- **Zustand 상태 관리**: 간단한 카운터 예제로 상태 관리 구현
- **React Hook Form**: 폼 검증과 상태 관리
- **Framer Motion**: 부드러운 애니메이션 효과
- **Recharts**: 데이터 시각화 차트
- **Responsive Design**: 모바일과 데스크톱 모두 지원
- **Modern UI**: shadcn/ui 컴포넌트로 일관된 디자인

## 🛠️ 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # 전역 스타일
│   ├── layout.tsx      # 루트 레이아웃
│   └── page.tsx        # 메인 페이지
├── components/          # UI 컴포넌트
│   └── ui/            # shadcn/ui 컴포넌트
└── lib/                # 유틸리티 및 설정
    ├── store.ts        # Zustand 스토어
    ├── swr.ts          # SWR 설정
    └── utils.ts        # shadcn/ui 유틸리티
```

## 🔧 사용법

### Zustand 스토어 사용
```typescript
import { useAppStore } from '@/lib/store'

const { count, increment, decrement } = useAppStore()
```

### SWR로 데이터 페칭
```typescript
import useSWR from 'swr'
import { fetcher } from '@/lib/swr'

const { data, error, isLoading } = useSWR('/api/data', fetcher)
```

### React Hook Form 사용
```typescript
import { useForm } from 'react-hook-form'

const form = useForm({
  defaultValues: { name: '', email: '' }
})
```

## 🎯 향후 계획

- [ ] TanStack Query로 전환
- [ ] 추가 shadcn/ui 컴포넌트
- [ ] 테스트 코드 작성
- [ ] API 엔드포인트 추가
- [ ] 데이터베이스 연동

## 📝 라이선스

MIT License
