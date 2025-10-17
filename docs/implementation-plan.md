# 코드 리뷰 애플리케이션 구현 계획

## 📋 프로젝트 개요
- **목적**: PRD 기반 코드 리뷰 에디터 MVP 구현
- **우선순위**: 에디터 기능 완벽 구현 > UI/UX > API 연동(2차)
- **접근방식**: Mock 데이터로 전체 플로우 구현 후 API 연동

## 🎯 핵심 요구사항
1. Monaco Editor 기반 코드 에디터 (인라인 배지, 툴팁, 구문 강조)
2. 실시간 제안 표시 및 적용/거부 기능
3. Diff 패널 (Unified 형식)
4. 가상 스크롤 (50개 이상 제안 시)
5. 반응형 레이아웃 (3단계)
6. 키보드 단축키 지원

## 📚 설치된 기술 스택

### UI 프레임워크
- **shadcn/ui**: 2024년 최신 UI 컴포넌트 라이브러리
  - dialog, tabs, sonner, dropdown-menu, badge, skeleton, button, card, tooltip

### 핵심 라이브러리
| 라이브러리 | 용도 | 버전 |
|-----------|------|------|
| @monaco-editor/react | 코드 에디터 | 4.7.0 |
| @tanstack/react-virtual | 가상 스크롤 | 3.13.12 |
| diff2html | Diff 표시 | 3.4.52 |
| diff | Diff 처리 | 8.0.2 |
| zustand | 상태 관리 | 5.0.8 |
| shiki | 구문 강조 | 3.12.2 |
| sonner | 토스트 알림 | 2.0.7 |
| lucide-react | 아이콘 | 0.544.0 |
| react-hook-form | 폼 관리 | 7.62.0 |
| zod | 스키마 검증 | 4.1.8 |
| date-fns | 날짜 처리 | 4.1.0 |
| framer-motion | 애니메이션 | 12.23.12 |

## 📁 프로젝트 구조

```
/app
├── page.tsx                    # 홈 화면 (ReviewStartForm)
├── reviews/
│   └── [id]/
│       └── page.tsx           # 리뷰 화면 (메인 레이아웃)
└── api/                       # 2차 작업 시 구현

/components
├── editor/
│   ├── CodeEditor.tsx         # Monaco Editor 래퍼
│   ├── DiffPanel.tsx          # Diff 표시 컴포넌트
│   └── EditorDecorations.tsx  # 인라인 배지/툴팁
├── review/
│   ├── ReviewStartForm.tsx    # 코드 입력 폼
│   ├── SuggestionList.tsx     # 제안 목록 (가상 스크롤)
│   ├── SuggestionCard.tsx     # 개별 제안 카드
│   ├── FilterChips.tsx        # severity/tags 필터
│   ├── SummaryBar.tsx         # 상단 요약 바
│   ├── ActionBar.tsx          # 하단 액션 바
│   └── SseStatusDot.tsx       # 연결 상태 표시
├── modals/
│   ├── ConflictModal.tsx      # 충돌 해소 모달
│   └── ExportModal.tsx        # 내보내기 모달
└── ui/                        # shadcn/ui 컴포넌트

/lib
├── store/
│   ├── reviewStore.ts         # Zustand 스토어
│   └── editorStore.ts         # 에디터 상태
├── utils/
│   ├── mockData.ts            # Mock 데이터 생성
│   ├── codeUtils.ts           # 코드 처리 유틸
│   ├── diffUtils.ts           # Diff/패치 유틸
│   └── languageDetection.ts  # 언어 자동 감지
└── hooks/
    ├── useKeyboardShortcuts.ts # 키보드 단축키
    ├── useCodeSync.ts         # 에디터-제안 동기화
    └── useResponsive.ts       # 반응형 브레이크포인트

/types
├── review.types.ts            # 리뷰 관련 타입
├── editor.types.ts            # 에디터 관련 타입
└── api.types.ts              # API 관련 타입 (2차)
```

## 🔨 구현 단계

### ✅ Phase 1: 기반 설정 (완료)
- [x] Next.js 프로젝트 초기 설정
- [x] 필요 패키지 설치
- [x] shadcn/ui 초기화 및 컴포넌트 추가
- [x] 프로젝트 디렉토리 구조 생성
- [ ] 타입 정의 파일 작성
- [ ] Zustand 스토어 구조 설계
- [ ] Mock 데이터 생성기 구현

### Phase 2: 홈 화면 (Day 1)
- [ ] ReviewStartForm 컴포넌트
  - [ ] 코드 입력 TextArea
  - [ ] 언어 자동 감지 배지 (shiki)
  - [ ] 스타일 프로필 선택 (detail|bug|refactor|test)
  - [ ] 리뷰 시작 버튼
  - [ ] 입력 검증 (zod)
- [ ] RecentSessions 컴포넌트 (선택)
- [ ] 라우팅 처리 (/reviews/:id)

### Phase 3: 에디터 핵심 기능 (Day 2-3) ⭐
- [ ] Monaco Editor 통합
  - [ ] 기본 에디터 설정
  - [ ] 읽기/쓰기 모드 전환
  - [ ] 테마 설정 (다크/라이트)
- [ ] 인라인 장식 (Decorations)
  - [ ] severity별 색상 배지
  - [ ] 라인 하이라이트
  - [ ] 호버 툴팁 (title, rationale, tags)
- [ ] 에디터 인터랙션
  - [ ] 커서 위치 ↔ 제안 카드 동기화
  - [ ] 제안 범위 클릭 시 카드 포커스
- [ ] 키보드 단축키
  - [ ] Ctrl/⌘ + Enter: 리뷰 시작
  - [ ] j/k: 다음/이전 제안 이동
  - [ ] a/r: Accept/Reject (포커스된 제안)

### Phase 4: Diff 패널 (Day 3)
- [ ] DiffPanel 컴포넌트
  - [ ] diff2html 통합
  - [ ] Unified diff 렌더링
  - [ ] 구문 강조 적용 (shiki)
  - [ ] 복사 버튼
- [ ] 패치 적용 로직
  - [ ] 코드 업데이트
  - [ ] 충돌 감지
  - [ ] 되돌리기 기능

### Phase 5: 제안 시스템 (Day 4-5)
- [ ] SuggestionList 컴포넌트
  - [ ] @tanstack/react-virtual 가상 스크롤
  - [ ] 50개 이상 항목 성능 테스트
- [ ] SuggestionCard 컴포넌트
  - [ ] severity 배지 (info|minor|major|critical)
  - [ ] title, rationale (3줄 ellipsis)
  - [ ] tags 표시
  - [ ] confidence 퍼센트
  - [ ] 액션 버튼 (Accept/Reject/View Diff)
  - [ ] 상태 표시 (pending|accepted|rejected)
- [ ] FilterChips 컴포넌트
  - [ ] severity 필터
  - [ ] tags 필터
  - [ ] 필터 조합 로직
- [ ] 상태 동기화
  - [ ] 에디터 ↔ 카드 하이라이트
  - [ ] Accept/Reject 즉시 반영

### Phase 6: UI 컴포넌트 (Day 5-6)
- [ ] SummaryBar
  - [ ] 요약 텍스트
  - [ ] 처리 시간
  - [ ] 모델명
  - [ ] SseStatusDot
- [ ] ActionBar
  - [ ] 메트릭 배지
  - [ ] Format 버튼
  - [ ] Export 버튼
- [ ] 모달 구현
  - [ ] ConflictModal (충돌 해소)
  - [ ] ExportModal (patch/zip 선택)
- [ ] 상태 컴포넌트
  - [ ] EmptyState
  - [ ] ErrorState
  - [ ] Skeleton (5-8개 카드)

### Phase 7: 반응형 & 최적화 (Day 6-7)
- [ ] 반응형 레이아웃
  - [ ] ≥1280px: 2열 (에디터:리스트 = 7:5)
  - [ ] 1024-1279px: 2열 (6:6), DiffPanel 오버레이
  - [ ] <1024px: 탭 전환 (에디터/제안/디프)
- [ ] 성능 최적화
  - [ ] React.memo 적용
  - [ ] useMemo/useCallback 최적화
  - [ ] 코드 스플리팅
  - [ ] 번들 사이즈 분석
- [ ] 접근성 (a11y)
  - [ ] ARIA 라벨 추가
  - [ ] 키보드 내비게이션
  - [ ] 포커스 관리
  - [ ] 명암비 AAA 준수

### Phase 8: 테스트 & 마무리 (Day 7)
- [ ] 단위 테스트
  - [ ] 유틸 함수
  - [ ] 스토어 로직
- [ ] 통합 테스트
  - [ ] 전체 플로우
  - [ ] 에러 케이스
- [ ] 성능 테스트
  - [ ] TTFT ≤ 5s
  - [ ] 완료 ≤ 15s (500 LoC)
  - [ ] 60fps 스크롤
  - [ ] 메모리 < 200MB

## 🎬 Mock 데이터 시나리오

### 시나리오 1: 정상 플로우
```typescript
{
  reviewId: "mock-review-1",
  status: "complete",
  suggestions: [
    {
      id: "sug-1",
      severity: "major",
      title: "Potential null reference",
      rationale: "This variable might be null...",
      range: { start: 10, end: 15 },
      fix: { diff: "..." },
      tags: ["null-safety", "bug"],
      confidence: 85
    }
    // ... 더 많은 제안
  ]
}
```

### 시나리오 2: 충돌 케이스
- Accept 시 패치 충돌 시뮬레이션
- ConflictModal 테스트

### 시나리오 3: 에러 케이스
- MODEL_TIMEOUT
- RATE_LIMIT
- NETWORK_ERROR

## 📊 성능 기준

| 메트릭 | 목표 | 측정 방법 |
|--------|------|----------|
| TTFT | ≤ 5s | Performance API |
| 완료 시간 | ≤ 15s (500 LoC) | Mock 타이머 |
| 스크롤 FPS | 60fps | Chrome DevTools |
| 메모리 사용량 | < 200MB | Performance Monitor |
| 번들 크기 | < 500KB (gzip) | Webpack Bundle Analyzer |

## 🚀 2차 작업 준비사항

### API 연동 포인트
1. `POST /api/reviews` - 리뷰 시작
2. `GET /api/reviews/{id}/stream` - SSE 스트림
3. `POST /api/suggestions/{id}/decision` - Accept/Reject
4. `POST /api/format` - 코드 포맷팅
5. `POST /api/export` - 내보내기

### 준비된 인터페이스
- API 타입 정의 완료
- Mock → Real API 전환 가능한 서비스 레이어
- 에러 핸들링 로직
- 로딩/에러 상태 UI

## ✅ 체크리스트

### 필수 기능
- [ ] Monaco 에디터 인라인 배지/툴팁
- [ ] 제안 가상 스크롤 (60fps)
- [ ] Accept/Reject 즉시 반영
- [ ] Diff 패널 표시
- [ ] 반응형 3단계 레이아웃
- [ ] 키보드 단축키

### 품질 기준
- [ ] TypeScript 100% 적용
- [ ] 에러 핸들링 완료
- [ ] 접근성 AA 이상
- [ ] 성능 목표 달성
- [ ] Mock 데이터로 전체 플로우 가능

## 📝 참고사항

### Monaco Editor 주요 API
- `editor.deltaDecorations()` - 인라인 장식
- `monaco.languages.registerHoverProvider()` - 툴팁
- `editor.addCommand()` - 단축키
- `editor.getModel().applyEdits()` - 코드 수정

### 가상 스크롤 설정
```typescript
const rowVirtualizer = useVirtualizer({
  count: suggestions.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 120, // 카드 높이
  overscan: 5 // 버퍼 항목 수
});
```

### Zustand 스토어 구조
```typescript
interface ReviewStore {
  // 상태
  reviewId: string;
  code: string;
  suggestions: Suggestion[];
  appliedSuggestions: Set<string>;
  
  // 액션
  setSuggestions: (suggestions: Suggestion[]) => void;
  applySuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
}
```

### diff2html 설정
```typescript
import { html } from 'diff2html';
import 'diff2html/bundles/css/diff2html.min.css';

const diffHtml = html(diffString, {
  drawFileList: false,
  matching: 'lines',
  outputFormat: 'side-by-side'
});
```

### Shiki 구문 강조 설정
```typescript
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  langs: ['javascript', 'typescript', 'python', 'java']
});
```

---

이 계획서를 기반으로 2차 API 연동 작업을 진행할 수 있습니다.
최신 라이브러리 스택으로 업데이트되었습니다.