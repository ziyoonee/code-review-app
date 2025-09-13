---

# 화면 구성(IA) & UX 흐름

본 섹션은 **MVP 기준 화면 구조와 사용자 흐름**을 정의합니다. 각 컴포넌트는 이후 구현 시 `id`를 유지하여 **로그/분석/테스트 자동화**에 재사용합니다.

## 1) 정보구조(IA)

- **홈/입력 화면** (`/`)
  - `ReviewStartForm`: 코드 입력 TextArea 또는 파일 드롭(후순위), 언어 뱃지(자동감지 결과), 스타일 프로필 선택(`detail|bug|refactor|test`), [리뷰 시작] 버튼
  - `RecentSessions`(선택): 최근 5개 세션 링크
- **리뷰 화면** (`/reviews/:id`)
  - 상단 헤더: `SummaryBar`(요약, 처리시간, 모델명), `FilterChips`(severity/tags), `SseStatusDot`
  - 메인 2열 레이아웃:
    - 좌측: `CodeEditor`(Monaco, 인라인 배지/밑줄/툴팁)
    - 우측: `SuggestionList`(가상 스크롤)
      - 각 항목: `SuggestionCard`(severity badge, title, rationale, tags, actions)
  - 하단 고정 패널: `DiffPanel`(unified/side-by-side는 MVP에서 unified), `ActionBar`(Format, Export)
- **충돌 해소 모달** `ConflictModal` (Accept 시 패치 충돌 발생한 경우)
- **Export 모달** `ExportModal` (patch/zip 선택)
- **에러/빈 상태 컴포넌트**: `EmptyState`, `ErrorState`, `Skeletons`

## 2) 주요 사용자 흐름

### A. 코드 리뷰 시작

1. 사용자가 코드 붙여넣기 → 스타일 선택 → **[리뷰 시작]**
2. 백엔드 `POST /api/reviews` 호출 → `reviewId` 수신 → `/reviews/:id`로 이동
3. 리뷰 화면 진입 즉시 `GET /api/reviews/{id}/stream`(SSE) 또는 폴링 시작
   - `status` 이벤트 → 상단 `SseStatusDot` 업데이트
   - `partial` 이벤트 → `SuggestionList` 항목 점진적 렌더
   - `complete` 이벤트 → 최종 `ReviewJson` 수신 및 요약/메트릭 갱신

### B. 제안 검토/적용

1. `SuggestionCard` 클릭 → `DiffPanel`에 해당 `fix.diff` 표시
2. **[Accept]** 클릭 → `POST /api/suggestions/{suggestionId}/decision` (`{ decision: "accept" }`)
3. 성공 시 `CodeEditor`에 패치 적용, 해당 카드 상태 `accepted`로 변경
4. 실패 시 `ConflictModal` 열고 안내(우선순위 규칙 설명/되돌리기 버튼)

### C. 포맷팅/내보내기

- **Format**: `POST /api/format`(선택 구현) → 성공 시 편집기 코드 교체, 로그 토스트 노출
- **Export**: `POST /api/export` (`{ sessionId, type: "patch|zip" }`) → 파일 다운로드

## 3) 컴포넌트 명세(핵심)

### `CodeEditor`

- Monaco 기반, 읽기/쓰기 모드
- **인라인 표시**: severity 색상 배지 + hover 툴팁( `title`, `rationale`, `tags` )
- 커서가 제안 범위(`range`) 진입 시 해당 카드 하이라이트 동기화
- 단축키: `Ctrl/⌘ + Enter`(리뷰 시작), `j/k`(다음/이전 제안 이동)

### `SuggestionList`

- 목록 가상화(>50개 제안 시)
- `FilterChips`와 연동: severity(`info|minor|major|critical`), tags
- 각 카드 필드: `title`, `rationale(최대 3줄 ellipsis)`, `tags`, `confidence%`, 액션 버튼( Accept / Reject / View Diff )
- 카드 상태 뱃지: `pending|accepted|rejected`

### `DiffPanel`

- unified diff 전용(MVP)
- 적용/미적용 상태에 따라 배경색 톤 차등
- **복사 버튼** 제공(코드 블록 복사)

### `ActionBar`

- 좌측: 요약/메트릭 미니 배지(처리시간, 모델)
- 우측: [Format] [Export]

## 4) 상태/예외 케이스

- **Skeleton**: 리뷰 시작 직후 `SuggestionCard` 5~8개 자리홀더
- **EmptyState**: 제안 0건 → “문제 없음. 스타일 프로필 변경을 시도해보세요.”
- **에러 처리**
  - `MODEL_TIMEOUT`: 상단 배너 + [다시 시도] 버튼
  - `SCHEMA_INVALID`: 자동 재시도 1회 후 폴백 메시지
  - `PATCH_CONFLICT`: `ConflictModal` 표시
  - `RATE_LIMIT`: 쿨다운 타이머 표시
- **네트워크 중단**: SSE 연결 끊김 표시, 폴백 폴링 안내

## 5) 접근성(a11y) & 반응형

- 키보드 내비게이션: 목록/에디터 포커스 이동, 모든 액션 버튼에 ARIA 라벨
- 명암비 준수(AAA는 권장, 최소 AA)
- 반응형
  - ≥1280px: 2열(에디터:리스트 = 7:5)
  - 1024–1279px: 2열(6:6), DiffPanel는 오버레이
  - &lt;1024px: 탭 전환(에디터/제안/디프)

## 6) 관측/로그(필수 이벤트)

- `review_start`(payload: language, style, codeSize)
- `review_stream_event`(type: status|partial|complete|error, counts)
- `suggestion_view` / `suggestion_accept` / `suggestion_reject`(id, severity, tags)
- `format_run`(tool, ms, success) / `export_click`(type)
- `error_toast_show`(code)

## 7) 성능 기준(MVP)

- TTFT ≤ **5s**, 완료 ≤ **15s** (500 LoC 기준)
- 스크롤 성능: 60fps 유지(가상화 필수)
- 메모리: 단일 세션 렌더 시 200MB 이하(브라우저 탭)

## 8) UI ↔ API 매핑 표

| UI 동작   | API                                           | 메모                                   |
| --------- | --------------------------------------------- | -------------------------------------- |
| 리뷰 시작 | `POST /api/reviews`                           | `reviewId` 반환, 라우팅 `/reviews/:id` |
| 진행 표시 | `GET /api/reviews/{id}/stream`(SSE) 또는 폴링 | `status/partial/complete/error` 이벤트 |
| 제안 확인 | (서버 응답 내 `comments`)                     | `SuggestionCard` 데이터 소스           |
| 제안 적용 | `POST /api/suggestions/{sid}/decision`        | 적용 후 코드/상태 갱신                 |
| 포맷팅    | `POST /api/format`(선택)                      | 성공 시 코드 치환                      |
| 내보내기  | `POST /api/export`                            | 파일 다운로드                          |

## 9) 수용 기준(샘플)

- [ ] Monaco 에디터에서 인라인 배지/툴팁이 `range`에 정확히 표시된다.
- [ ] SSE `partial` 수신 시 Suggestion이 누락/중복 없이 누적된다.
- [ ] Accept/Reject 후 카드 상태가 즉시 반영되고, 에디터가 최신 코드로 갱신된다.
- [ ] 1024px 미만에서 에디터/제안/디프 탭 전환 UI가 동작한다.
- [ ] 오류코드별 사용자 피드백(UI 배너/토스트/모달)이 명세대로 노출된다.

> 필요 시 이 섹션을 Figma 레퍼런스와 컴포넌트 스펙 문서로 분리할 수 있습니다.
