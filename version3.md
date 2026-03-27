# 개인 홈페이지 계획서 — Version 3

> **버전:** v3.2
> **최초 작성일:** 2026-03-27
> **최종 수정일:** 2026-03-27
> **상태:** 비밀번호 기반 게시글 수정·삭제 + 댓글 수정·삭제 구현 완료

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 포트폴리오 홈페이지 v3 |
| 목적 | v2 포트폴리오 + Study Board 유지 → 커뮤니티 게시판 추가 |
| v2와 차이 | Study Board 탭 유지 + 커뮤니티 게시판 탭 추가 (리스트형 · 추천/비추천 · 댓글 · 수정/삭제) |
| URL 구조 | `/#v3` 진입 시 v3 페이지 렌더링 |
| 배포 URL | https://kmnnmew.github.io/System_Programming/ |

---

## 2. 버전별 게시판 비교

| 항목 | v2 Study Board | v3 커뮤니티 게시판 |
|------|----------------|-------------------|
| 목적 | 개인 학습 기록 | 자유로운 소통 공간 |
| 레이아웃 | 카드 그리드 (3열) | 리스트 (테이블형) |
| 카테고리 | React / JS / Java / Python / DB / 기타 | 자유 / 질문 / 정보 / 이슈 / 기타 |
| 추천/비추천 | ✗ | ✅ |
| 댓글 | ✗ | ✅ |
| 조회수 | ✗ | ✅ |
| 수정/삭제 | ✗ | ✅ (비밀번호 인증) |
| Supabase 테이블 | `posts` | `board_posts` · `comments` |

> v3에서는 두 게시판이 Board 섹션 내 탭(💬 게시판 / 📚 Study Board)으로 통합 운영된다.

---

## 3. 기능 정의

### 3-1. v2 유지 기능 ✅

| 기능 | 상태 |
|------|------|
| 포트폴리오 전 섹션 (Hero / About / Skills / Projects / Awards / Contact) | ✅ |
| 반응형 레이아웃 | ✅ |
| v1 ↔ v2 ↔ v3 버전 전환 버튼 | ✅ |
| Study Board (카드형 · Supabase `posts` 테이블) | ✅ |

### 3-2. v3 신규 기능 — 커뮤니티 게시판

| 기능 ID | 기능명 | 설명 | 상태 |
|---------|--------|------|------|
| C-01 | 게시글 목록 | 번호·분류·제목·추천수·조회수·날짜 리스트 표시 | ✅ |
| C-02 | 카테고리 탭 | 자유 / 질문 / 정보 / 이슈 / 기타 필터 | ✅ |
| C-03 | 게시글 작성 | 제목·분류·내용 + 이미지/동영상 타입 + 비밀번호 설정 | ✅ |
| C-04 | 게시글 수정 | 비밀번호 인증 후 제목·분류·내용·미디어 전체 수정 | ✅ |
| C-05 | 게시글 삭제 | 비밀번호 인증 후 삭제 (미설정 시 confirm) | ✅ |
| C-06 | 게시글 상세 | 클릭 시 모달로 전체 내용 표시 | ✅ |
| C-07 | 추천 (👍) | 전체 게시글 추천, 중복 방지 (localStorage) | ✅ |
| C-08 | 비추천 (👎) | 전체 게시글 비추천, 중복 방지 (localStorage) | ✅ |
| C-09 | 조회수 | 게시글 열람 시 자동 증가 (Supabase UPDATE) | ✅ |
| C-10 | 이미지 첨부 | 파일 업로드 → base64 저장 (3MB 이하) | ✅ |
| C-11 | 동영상 첨부 | YouTube URL 입력 + 썸네일 미리보기 | ✅ |
| C-12 | 댓글 작성 | 댓글 입력 (Enter 키 단축키) + 비밀번호 설정 + Supabase 저장 | ✅ |
| C-13 | 댓글 삭제 | 비밀번호 인증 후 삭제 (미설정 시 confirm) | ✅ |
| C-14 | 추천순 정렬 | 추천 많은 순으로 정렬 | 🔜 추후 |
| C-15 | 검색 기능 | 제목·내용 키워드 검색 | 🔜 추후 |
| C-16 | 페이지네이션 | 게시글 목록 페이지 분할 | 🔜 추후 |
| C-17 | 로그인 연동 | Supabase Auth로 작성자 식별 | 🔜 추후 |

### 3-3. 비밀번호 인증 규칙

| 대상 | 비밀번호 설정 시 | 비밀번호 미설정 시 |
|------|-----------------|-------------------|
| 게시글 수정 | 비밀번호 확인 모달 → 일치 시 수정 폼 오픈 | 바로 수정 폼 오픈 |
| 게시글 삭제 | 비밀번호 확인 모달 → 일치 시 삭제 | confirm 창 → 삭제 |
| 댓글 삭제 | 비밀번호 확인 모달 → 일치 시 삭제 | confirm 창 → 삭제 |

> 비밀번호는 DB에 텍스트로 저장되며, 분실 시 복구 불가.
> 샘플(더미) 게시글은 수정·삭제 버튼 미노출.
> 샘플 게시글에는 댓글 미지원 (안내 메시지 표시).

---

## 4. 화면 레이아웃

### 4-1. 전체 페이지 구조 (v3)

```
┌──────────────────────────────────────────────────────────────┐
│  [심하윤 v3]  About / Skills / Projects / Awards / Board / Contact / [← v2]  │
├──────────────────────────────────────────────────────────────┤
│  (v1 · v2와 동일한 포트폴리오 섹션들)                         │
├──────────────────────────────────────────────────────────────┤
│  Board                                        [+ 글 쓰기]    │
│  ─────────────────────────────────────────────────────────   │
│  [ 💬 게시판 ]  [ 📚 Study Board ]                           │
│  ═════════════════════════════════════════════════════════   │
│  [ 전체 ][ 자유 ][ 질문 ][ 정보 ][ 이슈 ][ 기타 ]            │
│  ─────────────────────────────────────────────────────────   │
│  번호  분류    제목              [✏][✕]  👍   👁   날짜      │
│  ─────────────────────────────────────────────────────────   │
│   7   [자유]  포트폴리오 완성 🎉  ✏ ✕   18  142  03.27      │
│   6   [정보]  Supabase 무료 플랜  ✏ ✕   31  203  03.25      │
│  ─────────────────────────────────────────────────────────   │
├──────────────────────────────────────────────────────────────┤
│  Contact / Footer                                             │
└──────────────────────────────────────────────────────────────┘
```

> ✏ 수정 / ✕ 삭제 버튼은 hover 시에만 표시되며, 내가 쓴 게시글(DB 저장)에만 노출됨.

### 4-2. 게시글 상세 모달

```
┌──────────────────────────────────────────────┐
│  [자유]         [✏ 수정] [🗑 삭제]     [✕]  │
│  제목 (대형 텍스트)                           │
│  조회 142  2026.03.27                        │
│  ────────────────────────────────────────    │
│  본문 내용                                    │
│  (이미지 or YouTube 임베드)                   │
│                                              │
│  ────────────────────────────────────────    │
│       [👍 추천  18]   [👎 비추천  2]         │
│  ────────────────────────────────────────    │
│  💬 댓글 (3)                                 │
│  ┌──────────────────────────────────────┐   │
│  │ 댓글 내용              2026.03.27 🔒 삭제│ │
│  └──────────────────────────────────────┘   │
│  [댓글 입력창...                         ]   │
│  [🔒 비밀번호 (선택)    ]      [ 등록 ]      │
└──────────────────────────────────────────────┘
```

### 4-3. 비밀번호 확인 모달

```
┌─────────────────────────────┐
│  🔒 게시글 수정 (삭제)  [✕] │
│  비밀번호를 입력해주세요.    │
│  [비밀번호 입력창        ]   │
│  오류 시: 비밀번호가 틀렸습니다. │
│      [취소]    [확인]        │
└─────────────────────────────┘
```

---

## 5. 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | React (Vite) | useState, useEffect, useRef |
| 데이터베이스 | Supabase (PostgreSQL) | board_posts · comments 테이블 |
| 추천/비추천 중복 방지 | localStorage | `v3_votes: { postId: 'like'\|'dislike' }` |
| 더미 게시글 투표 수 | localStorage | `v3_dummy_votes: { postId: { likes, dislikes } }` |
| 배포 | GitHub Pages | `npm run deploy` |

### DB 스키마 (Supabase)

#### `board_posts` — 커뮤니티 게시글

```sql
CREATE TABLE public.board_posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  title       text NOT NULL,
  content     text NOT NULL,
  category    text NOT NULL DEFAULT '자유',
  type        text NOT NULL DEFAULT 'text'
              CHECK (type IN ('text','image','video')),
  image_data  text,        -- base64 (3MB 이하)
  video_url   text,        -- YouTube URL
  views       int  NOT NULL DEFAULT 0,
  likes       int  NOT NULL DEFAULT 0,
  dislikes    int  NOT NULL DEFAULT 0,
  date        text,        -- YYYY.MM.DD 표시용
  password    text         -- 수정·삭제용 비밀번호 (nullable)
);

-- RLS: SELECT / INSERT / UPDATE / DELETE 모두 허용
```

#### `comments` — 댓글

```sql
CREATE TABLE public.comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  post_id    uuid NOT NULL,   -- board_posts.id 참조
  content    text NOT NULL,
  date       text,            -- YYYY.MM.DD 표시용
  password   text             -- 삭제용 비밀번호 (nullable)
);

-- RLS: SELECT / INSERT / DELETE 허용
```

### 아키텍처

```
[사용자 브라우저]
       │
       ▼
[React 앱 - GitHub Pages]  ← /#v3 진입 시 AppV3 렌더링
       │
       ├─ 추천/비추천 중복 확인 ── localStorage (v3_votes)
       ├─ 더미 게시글 투표 수 ──── localStorage (v3_dummy_votes)
       │
       └─ Supabase (PostgreSQL)
            ├─ board_posts  : 게시글 SELECT / INSERT / UPDATE / DELETE
            │                  ↳ views, likes UPDATE (조회수·추천)
            │                  ↳ 수정 시 title/content/category/type UPDATE
            └─ comments     : 댓글 SELECT / INSERT / DELETE
```

---

## 6. 개발 로드맵

| 단계 | 작업 | 상태 |
|------|------|------|
| 1단계 | v1 포트폴리오 구현 | ✅ 완료 |
| 2단계 | v2 Study Board 구현 | ✅ 완료 |
| 3단계 | v3 커뮤니티 게시판 구현 (추천/비추천/조회수) | ✅ 완료 |
| 4단계 | v2 Study Board를 v3에 통합 (탭 전환) | ✅ 완료 |
| 5단계 | 댓글 기능 (Supabase `comments` 테이블) | ✅ 완료 |
| 6단계 | 비밀번호 기반 게시글 수정·삭제 / 댓글 삭제 | ✅ 완료 |
| 7단계 | 추천순 정렬 | 🔜 예정 |
| 8단계 | 검색 기능 | 🔜 예정 |
| 9단계 | Supabase Auth 로그인 | 🔜 예정 |
| 10단계 | 페이지네이션 | 🔜 예정 |

---

## 7. 파일 구조

```
System_Programming/
├── plan.MD
├── version2.md
├── version3.md        ← 이 문서
└── SP_Portfolio/src/
    ├── main.jsx       ← v1/v2/v3 hash 라우팅
    ├── App.jsx        ← v1
    ├── AppV2.jsx      ← v2 (Study Board)
    ├── AppV2.css
    ├── AppV3.jsx      ← v3 (커뮤니티 게시판 + Study Board 통합)
    ├── AppV3.css
    └── supabase.js
```
