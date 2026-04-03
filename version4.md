# 개인 홈페이지 계획서 — Version 4

> **버전:** v4.1
> **최초 작성일:** 2026-04-03
> **최종 수정일:** 2026-04-03
> **상태:** v4 단일 페이지 운영 중, Supabase Auth 기반 로그인/회원가입 완료

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 포트폴리오 홈페이지 v4 |
| 목적 | v3 포트폴리오 + 게시판 유지 → Supabase Auth 기반 로그인 추가, v4 단일 페이지로 통합 |
| v3와 차이 | 비밀번호 방식 → Supabase Auth / 버전 전환 제거 → v4 메인 페이지화 / 더미 데이터 제거 |
| 진입 URL | https://kmnnmew.github.io/System_Programming/ (루트 진입 시 바로 v4 렌더링) |

---

## 2. v3 → v4 변경 사항 비교

| 항목 | v3 | v4 |
|------|----|----|
| 인증 방식 | 게시글 작성 시 비밀번호 설정 | Supabase Auth 계정 로그인 |
| 글쓰기 | 누구나 가능 | 로그인 필수 |
| 수정·삭제 | 비밀번호 일치 시 | 내가 쓴 글만 (user_id 비교) |
| 댓글 | 누구나 + 비밀번호(선택) | 로그인 필수, 내 댓글만 삭제 |
| Study Board 작성 | 누구나 (v3에서 비활성화됨) | 관리자 계정만 (`OWNER_EMAIL`) |
| 더미 게시글 | 있음 | 없음 (실제 데이터만) |
| 버전 전환 버튼 | v1 ↔ v2 ↔ v3 ↔ v4 | 없음 (v4가 메인) |
| accent 색상 | 초록 (`#3fb950`) | 보라 (`#a371f7`) |
| Supabase 테이블 | `board_posts` · `comments` | `v4_board_posts` · `v4_comments` |

---

## 3. 기능 정의

### 3-1. v3에서 유지된 기능

| 기능 | 상태 |
|------|------|
| 포트폴리오 전 섹션 (Hero / About / Skills / Projects / Awards / Contact) | ✅ |
| 반응형 레이아웃 | ✅ |
| 커뮤니티 게시판 (리스트형 · 추천/비추천 · 조회수) | ✅ |
| Study Board (카드형 · `v4_board_posts` 테이블) | ✅ |
| 게시글 상세 모달 + 댓글 | ✅ |

### 3-2. v4 신규 기능 — Supabase Auth

| 기능 ID | 기능명 | 설명 | 상태 |
|---------|--------|------|------|
| A-01 | 회원가입 | 이메일 + 비밀번호(6자↑)로 계정 생성, 이메일 인증 필요 | ✅ |
| A-02 | 로그인 | 이메일 + 비밀번호 로그인, 세션 자동 유지 | ✅ |
| A-03 | 로그아웃 | nav 로그아웃 버튼 클릭 시 세션 종료 | ✅ |
| A-04 | 게시글 작성 | 로그인 상태에서만 작성 가능, user_id 저장 | ✅ |
| A-05 | 게시글 수정 | 내가 쓴 글(user_id 일치)만 수정 버튼 노출 | ✅ |
| A-06 | 게시글 삭제 | 내가 쓴 글(user_id 일치)만 삭제 버튼 노출 | ✅ |
| A-07 | 댓글 작성 | 로그인 상태에서만 작성 가능, user_id 저장 | ✅ |
| A-08 | 댓글 삭제 | 내가 쓴 댓글(user_id 일치)만 삭제 버튼 노출 | ✅ |
| A-09 | 비로그인 유도 | 글쓰기·댓글 시 로그인 모달 자동 오픈 | ✅ |
| A-10 | Study Board 관리자 전용 | `OWNER_EMAIL` 계정만 글쓰기 버튼 표시 및 작성 가능 | ✅ |
| A-11 | 비밀번호 재설정 | Supabase 이메일 재설정 링크 | 🔜 추후 |
| A-12 | OAuth 소셜 로그인 | GitHub / Google | 🔜 추후 |
| A-13 | 프로필 수정 | 닉네임 · 아바타 | 🔜 추후 |

### 3-3. 인증 동작 규칙

| 상황 | 동작 |
|------|------|
| 비로그인 상태에서 커뮤니티 글쓰기 버튼 클릭 | 로그인 모달 자동 오픈 |
| 비로그인 상태에서 댓글 입력 시도 | "로그인하면 댓글 가능" 안내 + 로그인 링크 |
| Study Board 글쓰기 버튼 표시 조건 | `session.user.email === OWNER_EMAIL` |
| 커뮤니티 게시글 수정·삭제 버튼 표시 조건 | `session.user.id === post.user_id` |
| 로그인 후 nav 표시 | 이메일 앞 두 글자 + `***` + 도메인 + 로그아웃 버튼 |

### 3-4. 표시 규칙

| 항목 | 규칙 |
|------|------|
| 추천수 | 1 이상일 때만 표시, 0이면 빈칸 |
| 조회수 | 1 이상일 때만 표시, 0이면 빈칸 |
| 더미 데이터 | 없음 — 실제 Supabase DB 데이터만 표시 |

---

## 4. 화면 레이아웃

### 4-1. Nav (로그인 상태)

```
[심하윤]  About / Skills / Projects / Awards / Board / Contact  sh***@sdh.hs.kr  [로그아웃]
```

### 4-2. Nav (비로그인 상태)

```
[심하윤]  About / Skills / Projects / Awards / Board / Contact  [로그인]
```

### 4-3. 로그인 / 회원가입 모달

```
┌──────────────────────────────────┐
│  🔐                          [✕] │
│  심하윤 포트폴리오                │
│  로그인하면 게시글·댓글 작성 가능  │
│  ─────────────────────────────   │
│  [ 로그인 ]     [ 회원가입 ]      │
│  ─────────────────────────────   │
│  이메일  [                    ]  │
│  비밀번호 [                   ]  │
│  (회원가입 탭: 비밀번호 확인 추가) │
│  오류 메시지 (있을 경우)           │
│      [취소]        [로그인]       │
│  계정이 없으신가요? [회원가입]      │
└──────────────────────────────────┘
```

### 4-4. Board 섹션 — 커뮤니티 탭

```
┌──────────────────────────────────────────────────────────────┐
│  Board                   [로그인]하면 글을 작성할 수 있어요.  │
│                                                [+ 글 쓰기]   │
│  ─────────────────────────────────────────────────────────   │
│  [ 💬 게시판 ]  [ 📚 Study Board ]                           │
│  ═════════════════════════════════════════════════════════   │
│  [ 전체 ][ 자유 ][ 질문 ][ 정보 ][ 이슈 ][ 기타 ]            │
│  ─────────────────────────────────────────────────────────   │
│  번호  분류   제목                  [✏][✕]  👍   👁   날짜   │
│  ─────────────────────────────────────────────────────────   │
│   1   [자유]  첫 번째 게시글                                  │
│  ─────────────────────────────────────────────────────────   │
└──────────────────────────────────────────────────────────────┘
```

> ✏ 수정 / ✕ 삭제 버튼은 내가 쓴 글(user_id 일치)에만 노출됨.
> 추천수·조회수는 1 이상일 때만 표시.

### 4-5. Board 섹션 — Study Board 탭

```
┌──────────────────────────────────────────────────────────────┐
│  Board                                                        │
│                              (관리자 로그인 시만 [+ 글 쓰기]) │
│  ─────────────────────────────────────────────────────────   │
│  [ 💬 게시판 ]  [ 📚 Study Board ]                           │
│  ═════════════════════════════════════════════════════════   │
│  [ 전체 ][ React ][ JavaScript ][ Java ][ Python ][ DB ]     │
│  ─────────────────────────────────────────────────────────   │
│  카드 그리드 (학습 노트 카드들)                                │
└──────────────────────────────────────────────────────────────┘
```

> `+ 글 쓰기` 버튼은 `OWNER_EMAIL` 계정으로 로그인했을 때만 표시.

### 4-6. 게시글 상세 모달

```
┌──────────────────────────────────────────────┐
│  [자유]         [✏ 수정] [🗑 삭제]     [✕]  │
│  제목 (대형 텍스트)                           │
│  조회 5  ·  2026.04.03   (0이면 조회수 숨김) │
│  ────────────────────────────────────────    │
│  본문 내용                                    │
│  (이미지 or YouTube 임베드)                   │
│                                              │
│  ────────────────────────────────────────    │
│     [👍 추천  3]   [👎 비추천]  (0이면 숨김) │
│  ────────────────────────────────────────    │
│  💬 댓글 (2)                                 │
│  ┌──────────────────────────────────────┐   │
│  │ 댓글 내용           sh***@gmail.com  삭제│ │
│  └──────────────────────────────────────┘   │
│  [댓글 입력창...                        ]    │
│                                  [ 등록 ]    │
└──────────────────────────────────────────────┘
```

---

## 5. 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | React (Vite) | useState, useEffect, useRef |
| 인증 | Supabase Auth | 이메일/비밀번호, onAuthStateChange |
| 데이터베이스 | Supabase (PostgreSQL) | v4_board_posts · v4_comments |
| 추천/비추천 중복 방지 | localStorage | `v4_votes: { postId: 'like'\|'dislike' }` |
| 배포 | GitHub Pages | `npm run deploy` |

### DB 스키마 (Supabase)

#### `v4_board_posts` — 커뮤니티 + Study Board 게시글

```sql
CREATE TABLE public.v4_board_posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  user_id     uuid,               -- auth.users.id (작성자)
  title       text NOT NULL,
  content     text NOT NULL,
  category    text NOT NULL DEFAULT '자유',
  type        text NOT NULL DEFAULT 'text' CHECK (type IN ('text','image','video')),
  image_data  text,               -- base64 (3MB 이하)
  video_url   text,               -- YouTube URL
  views       int  NOT NULL DEFAULT 0,
  likes       int  NOT NULL DEFAULT 0,
  dislikes    int  NOT NULL DEFAULT 0,
  date        text                -- YYYY.MM.DD 표시용
);

-- RLS: SELECT / INSERT / UPDATE / DELETE 모두 허용 (소유권은 UI 레벨에서 제어)
```

#### `v4_comments` — 댓글

```sql
CREATE TABLE public.v4_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  post_id    uuid NOT NULL,       -- v4_board_posts.id 참조
  user_id    uuid,                -- auth.users.id (작성자)
  content    text NOT NULL,
  date       text                 -- YYYY.MM.DD 표시용
);

-- RLS: SELECT / INSERT / DELETE 허용
```

### 아키텍처

```
[사용자 브라우저]
       │
       ▼
[React 앱 - GitHub Pages]  ← 루트 진입 시 바로 AppV4 렌더링 (버전 라우팅 없음)
       │
       ├─ Supabase Auth
       │    ├─ signUp / signInWithPassword / signOut
       │    └─ onAuthStateChange → session 상태 실시간 감지
       │
       ├─ 추천/비추천 중복 확인 ── localStorage (v4_votes)
       │
       └─ Supabase (PostgreSQL)
            ├─ v4_board_posts  : 게시글 CRUD (user_id 저장)
            │                    ↳ views, likes/dislikes UPDATE (조회수·추천)
            └─ v4_comments     : 댓글 SELECT / INSERT / DELETE (user_id 저장)
```

---

## 6. 개발 로드맵

| 단계 | 작업 | 상태 |
|------|------|------|
| 1단계 | v1 포트폴리오 구현 | ✅ 완료 |
| 2단계 | v2 Study Board (Supabase) | ✅ 완료 |
| 3단계 | v3 커뮤니티 게시판 (추천/비추천/댓글/비밀번호) | ✅ 완료 |
| 4단계 | v4 Supabase Auth 로그인/회원가입 | ✅ 완료 |
| 5단계 | Study Board 관리자 전용 제한 | ✅ 완료 |
| 6단계 | 더미 데이터 제거, v4 단일 페이지로 통합 | ✅ 완료 |
| 7단계 | 비밀번호 재설정 (이메일) | 🔜 예정 |
| 8단계 | OAuth 소셜 로그인 (GitHub / Google) | 🔜 예정 |
| 9단계 | 프로필 페이지 (닉네임·아바타) | 🔜 예정 |
| 10단계 | 검색·정렬·페이지네이션 | 🔜 예정 |

---

## 7. 파일 구조

```
System_Programming/
├── version2.md
├── version3.md
├── version4.md        ← 이 문서
└── SP_Portfolio/src/
    ├── main.jsx       ← AppV4 단독 렌더링 (버전 라우팅 없음)
    ├── AppV4.jsx      ← v4 메인 (포트폴리오 + Auth + 게시판)
    ├── AppV4.css
    └── supabase.js
```
