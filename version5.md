# 개인 홈페이지 계획서 — Version 5

> **버전:** v5.0
> **최초 작성일:** 2026-04-03
> **최종 수정일:** 2026-04-03
> **상태:** GitHub API + Solved.ac API 연동 완료

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 포트폴리오 홈페이지 v5 |
| 목적 | 외부 API 연동으로 포트폴리오 데이터 자동화 (GitHub 레포 + 백준 전적) |
| v4와 차이 | 기존 하드코딩 Projects/Skills 데이터 → API 실시간 연동으로 보강 |
| 진입 URL | https://kmnnmew.github.io/System_Programming/ |

---

## 2. v4 → v5 변경 사항 비교

| 항목 | v4 | v5 |
|------|----|----|
| Projects 섹션 | 하드코딩 프로젝트 카드 | 하드코딩 카드 유지 + GitHub Pinned Repos 자동 표시 |
| Skills 섹션 | 기술 스택 태그만 | 기술 스택 태그 + Solved.ac 전적 위젯 추가 |
| GitHub API | 없음 | GraphQL API (pinned repos) |
| Solved.ac | 없음 | Edge Function 프록시 경유 |
| 환경변수 | 없음 | `VITE_GITHUB_TOKEN` (빌드 타임 포함) |

---

## 3. 기능 정의

### 3-1. v4에서 유지된 기능

| 기능 | 상태 |
|------|------|
| 포트폴리오 전 섹션 (Hero / About / Skills / Projects / Awards / Contact) | ✅ |
| Supabase Auth 로그인/회원가입/로그아웃 | ✅ |
| 커뮤니티 게시판 (CRUD · 추천/비추천 · 댓글) | ✅ |
| Study Board (관리자 전용 작성) | ✅ |

### 3-2. v5 신규 기능 — 외부 API 연동

| 기능 ID | 기능명 | 설명 | 상태 |
|---------|--------|------|------|
| G-01 | GitHub Pinned Repos 표시 | GraphQL API로 핀된 레포 최대 6개 자동 표시 | ✅ |
| G-02 | 레포 정보 카드 | 레포명·설명·언어·스타·포크 수 표시 | ✅ |
| G-03 | Solved.ac 전적 위젯 | 티어 뱃지·해결한 문제·레이팅·전체 랭킹 표시 | ✅ |
| G-04 | CORS 프록시 | Supabase Edge Function `solved-proxy`로 브라우저 CORS 우회 | ✅ |
| G-05 | API 오류 무시 | 네트워크 오류 시 해당 위젯만 숨김 (페이지 정상 동작) | ✅ |
| G-06 | GitHub Actions 자동 배포 | push 시 자동 build + deploy | 🔜 추후 |
| G-07 | 저장소 클릭 → GitHub 이동 | 레포 카드 클릭 시 GitHub 레포로 새 탭 이동 | ✅ |

### 3-3. 동작 규칙

| 상황 | 동작 |
|------|------|
| GitHub API 응답 정상 | Projects 섹션 하단에 "GitHub Repositories" 카드 그리드 표시 |
| GitHub API 응답 없음/오류 | GitHub 섹션 숨김, 기존 프로젝트 카드만 표시 |
| Solved.ac 응답 정상 | Skills 섹션 하단에 전적 위젯 표시 |
| Solved.ac 응답 없음/오류 | 위젯 숨김, 기술 스택 태그만 표시 |
| GitHub PAT 만료 | API 응답 실패 → GitHub 섹션 자동 숨김 |

---

## 4. 화면 레이아웃

### 4-1. Skills 섹션 (Solved.ac 위젯 추가)

```
┌─────────────────────────────────────────────────────────┐
│  Tech Skills                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ Core Stack           │  │ Experience           │    │
│  │ HTML5 CSS3 React ... │  │ Vue.js Python ...    │    │
│  └──────────────────────┘  └──────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [티어 뱃지] shy3411          해결한 문제  레이팅  랭킹│
│  │             Baekjoon/solved.ac   342       1487  12,045│
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4-2. Projects 섹션 (GitHub Repos 추가)

```
┌─────────────────────────────────────────────────────────┐
│  Projects                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 하루틈             개인 프로젝트                  │  │
│  │ 4가지 키워드를 담은 공유 일기 플랫폼              │  │
│  └──────────────────────────────────────────────────┘  │
│  (기존 프로젝트 카드들 ...)                              │
│                                                         │
│  🐙 GitHub Repositories                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │ System_Programming    │  │ haruteum              │  │
│  │ 포트폴리오 사이트      │  │ 공유 일기 플랫폼       │  │
│  │ 🟡 JavaScript         │  │ 🟨 JavaScript ⭐ 1    │  │
│  └───────────────────────┘  └───────────────────────┘  │
│  (핀된 레포 최대 6개 카드 그리드)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 5. 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | React (Vite) | useState, useEffect |
| GitHub API | REST v4 (GraphQL) | Personal Access Token 필요 |
| Solved.ac API | solved.ac REST API v3 | CORS 우회 필요 |
| CORS 프록시 | Supabase Edge Function | `solved-proxy` 함수 |
| 환경변수 | Vite `.env` | `VITE_GITHUB_TOKEN` (빌드 시 번들 포함) |
| 인증 | Supabase Auth | v4에서 유지 |
| 데이터베이스 | Supabase (PostgreSQL) | v4에서 유지 |
| 배포 | GitHub Pages | `npm run deploy` |

### Supabase Edge Function

#### `solved-proxy`

```ts
// supabase/functions/solved-proxy/index.ts
Deno.serve(async (req) => {
  const { handle } = await req.json();
  const res = await fetch(`https://solved.ac/api/v3/user/show?handle=${handle}`);
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
});
```

- `verify_jwt: false` (공개 접근 허용)
- 응답에 `Access-Control-Allow-Origin: *` 헤더 포함

### GitHub GraphQL 쿼리

```graphql
{
  user(login: "kmnnmew") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name description url
          stargazerCount forkCount
          primaryLanguage { name color }
          updatedAt
        }
      }
    }
  }
}
```

### 아키텍처

```
[사용자 브라우저]
       │
       ▼
[React 앱 - GitHub Pages]
       │
       ├─ GitHub GraphQL API ───────────── PAT 인증 (VITE_GITHUB_TOKEN)
       │    └─ pinnedItems → Projects 섹션 카드 렌더링
       │
       ├─ Supabase Edge Function (solved-proxy)
       │    └─ solved.ac API 프록시 → Skills 섹션 위젯 렌더링
       │
       ├─ Supabase Auth (v4 유지)
       │
       └─ Supabase DB (v4 유지)
            ├─ v4_board_posts
            └─ v4_comments
```

---

## 6. 개발 로드맵

| 단계 | 작업 | 상태 |
|------|------|------|
| 1~6단계 | v1~v4 구현 (포트폴리오 · 게시판 · Auth) | ✅ 완료 |
| 7단계 | GitHub Pinned Repos → Projects 섹션 자동 연동 | ✅ 완료 |
| 8단계 | Solved.ac 전적 → Skills 섹션 위젯 | ✅ 완료 |
| 9단계 | Supabase Edge Function `solved-proxy` 배포 | ✅ 완료 |
| 10단계 | GitHub Actions 자동 배포 | 🔜 예정 |
| 11단계 | 비밀번호 재설정 (이메일) | 🔜 예정 |
| 12단계 | 검색·정렬·페이지네이션 | 🔜 예정 |

---

## 7. 파일 구조

```
System_Programming/
├── version2.md
├── version3.md
├── version4.md
├── version5.md        ← 이 문서
└── SP_Portfolio/
    ├── .env           ← VITE_GITHUB_TOKEN (git 제외, 빌드 시 번들 포함)
    ├── .gitignore     ← .env 추가
    └── src/
        ├── main.jsx
        ├── AppV4.jsx  ← GitHub·Solved.ac fetch 추가
        ├── AppV4.css  ← solved-widget·gh-card 스타일 추가
        └── supabase.js
```
