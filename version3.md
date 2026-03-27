# 개인 홈페이지 계획서 — Version 3

> **버전:** v3.0
> **최초 작성일:** 2026-03-27
> **상태:** 게시판 구현 완료 (Supabase 연동, 추천/비추천, 조회수)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 포트폴리오 홈페이지 v3 |
| 목적 | v2 포트폴리오 유지 + 일반 커뮤니티 게시판 추가 |
| v2와 차이 | Study Board(학습 노트 카드형) → 커뮤니티 게시판(리스트형 + 추천/비추천) |
| URL 구조 | `/#v3` 진입 시 v3 페이지 렌더링 |
| 배포 URL | https://kmnnmew.github.io/System_Programming/ |

---

## 2. 버전별 게시판 비교

| 항목 | v2 Study Board | v3 게시판 |
|------|----------------|-----------|
| 목적 | 개인 학습 기록 | 자유로운 소통 공간 |
| 레이아웃 | 카드 그리드 (3열) | 리스트 (테이블형) |
| 카테고리 | React / JS / Java / Python / DB | 자유 / 질문 / 정보 / 이슈 / 기타 |
| 추천/비추천 | ✗ | ✅ |
| 조회수 | ✗ | ✅ |
| Supabase 테이블 | `posts` | `board_posts` |

---

## 3. 기능 정의

### 3-1. v2 유지 기능 ✅

| 기능 | 상태 |
|------|------|
| 포트폴리오 전 섹션 (Hero / About / Skills / Projects / Awards / Contact) | ✅ |
| 반응형 레이아웃 | ✅ |
| v1 ↔ v2 ↔ v3 버전 전환 버튼 | ✅ |

### 3-2. v3 신규 기능 — 커뮤니티 게시판

| 기능 ID | 기능명 | 설명 | 상태 |
|---------|--------|------|------|
| C-01 | 게시글 목록 | 번호·분류·제목·추천수·조회수·날짜 리스트 표시 | ✅ |
| C-02 | 카테고리 탭 | 자유 / 질문 / 정보 / 이슈 / 기타 필터 | ✅ |
| C-03 | 게시글 작성 | 제목·분류·내용 + 이미지/동영상 타입 | ✅ |
| C-04 | 게시글 삭제 | 내가 쓴 글 삭제 (확인 후 DB 반영) | ✅ |
| C-05 | 게시글 상세 | 클릭 시 모달로 전체 내용 표시 | ✅ |
| C-06 | 추천 (👍) | 게시글 추천, 중복 방지 (localStorage) | ✅ |
| C-07 | 비추천 (👎) | 게시글 비추천, 중복 방지 (localStorage) | ✅ |
| C-08 | 조회수 | 게시글 열람 시 자동 증가 (Supabase UPDATE) | ✅ |
| C-09 | 이미지 첨부 | 파일 업로드 → base64 저장 (3MB 이하) | ✅ |
| C-10 | 동영상 첨부 | YouTube URL 입력 + 썸네일 미리보기 | ✅ |
| C-11 | 추천순 정렬 | 추천 많은 순으로 정렬 | 🔜 추후 |
| C-12 | 댓글 기능 | 게시글 댓글 작성·조회 | 🔜 추후 |
| C-13 | 검색 기능 | 제목·내용 키워드 검색 | 🔜 추후 |
| C-14 | 페이지네이션 | 게시글 목록 페이지 분할 | 🔜 추후 |
| C-15 | 로그인 연동 | Supabase Auth로 작성자 식별 | 🔜 추후 |

---

## 4. 화면 레이아웃

### 4-1. 전체 페이지 구조 (v3)

```
┌──────────────────────────────────────────────────────┐
│  [심하윤 v3]  About / Skills / Projects / Awards / Board / Contact / [← v2]  │
├──────────────────────────────────────────────────────┤
│  (v1 · v2와 동일한 포트폴리오 섹션들)                 │
├──────────────────────────────────────────────────────┤
│  게시판                                [+ 글 쓰기]   │
│  ─────────────────────────────────────────────────   │
│  [ 전체 ][ 자유 ][ 질문 ][ 정보 ][ 이슈 ][ 기타 ]    │
│  ═════════════════════════════════════════════════   │
│  번호  분류    제목                   👍   👁   날짜  │
│  ─────────────────────────────────────────────────   │
│   7   [자유]  포트폴리오 완성 🎉       18  142  03.27 │
│   6   [정보]  Supabase 무료 플랜 정리  31  203  03.25 │
│   5   [이슈]  GitHub Pages 404 해결   22  156  03.24 │
│  ─────────────────────────────────────────────────   │
├──────────────────────────────────────────────────────┤
│  Contact / Footer                                     │
└──────────────────────────────────────────────────────┘
```

### 4-2. 게시글 상세 모달

```
┌─────────────────────────────────────────┐
│  [자유]                            [✕]  │
│  제목 (대형 텍스트)                      │
│  조회 142  2026.03.27                   │
│  ─────────────────────────────────────  │
│  본문 내용                              │
│  (이미지 or YouTube 임베드)             │
│                                         │
│  ─────────────────────────────────────  │
│       [👍 추천  18]   [👎 비추천  2]    │
└─────────────────────────────────────────┘
```

---

## 5. 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | React (Vite) | useState, useEffect, useRef |
| 데이터베이스 | Supabase (PostgreSQL) | board_posts 테이블 |
| 추천/비추천 중복 방지 | localStorage | `v3_votes: { postId: 'like'|'dislike' }` |
| 배포 | GitHub Pages | `npm run deploy` |

### DB 스키마 (Supabase — `board_posts`)

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
  views       int NOT NULL DEFAULT 0,
  likes       int NOT NULL DEFAULT 0,
  dislikes    int NOT NULL DEFAULT 0,
  date        text         -- YYYY.MM.DD 표시용
);

-- RLS: SELECT / INSERT / UPDATE / DELETE 모두 허용
-- 추후 로그인 도입 시 정책 변경
```

### 아키텍처

```
[사용자 브라우저]
       │
       ▼
[React 앱 - GitHub Pages]  ← /#v3 진입 시 AppV3 렌더링
       │
       ├─ 추천/비추천 중복 확인 ── localStorage (v3_votes)
       │
       └─ 게시글 CRUD ────────── Supabase (board_posts)
                                 SELECT / INSERT / UPDATE(views, likes) / DELETE
```

---

## 6. 개발 로드맵

| 단계 | 작업 | 상태 |
|------|------|------|
| 1단계 | v1 포트폴리오 구현 | ✅ 완료 |
| 2단계 | v2 Study Board 구현 | ✅ 완료 |
| 3단계 | v3 커뮤니티 게시판 구현 (추천/비추천/조회수) | ✅ 완료 |
| 4단계 | 댓글 기능 | 🔜 예정 |
| 5단계 | 검색 / 정렬 기능 | 🔜 예정 |
| 6단계 | Supabase Auth 로그인 | 🔜 예정 |
| 7단계 | 페이지네이션 | 🔜 예정 |

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
    ├── AppV3.jsx      ← v3 (커뮤니티 게시판)
    ├── AppV3.css
    └── supabase.js
```
