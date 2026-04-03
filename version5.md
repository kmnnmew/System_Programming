# 개인 홈페이지 계획서 — Version 5

> **버전:** v5.1
> **최초 작성일:** 2026-04-03
> **최종 수정일:** 2026-04-03
> **상태:** GitHub API (잔디·레포) + Solved.ac API (전적·태그 차트) 연동 완료

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 포트폴리오 홈페이지 v5 |
| 목적 | 외부 API 연동으로 포트폴리오 데이터 자동화 — GitHub 활동량 시각화 + 백준 역량 수치화 |
| v4와 차이 | 정적 텍스트 → 실시간 GitHub 잔디·레포 + Solved.ac 전적·유형별 차트 |
| 진입 URL | https://kmnnmew.github.io/System_Programming/ |

---

## 2. v4 → v5 변경 사항 비교

| 항목 | v4 | v5 |
|------|----|----|
| About 섹션 | 텍스트/카드 정보만 | **GitHub 잔디 그래프** 추가 |
| Skills 섹션 | 기술 스택 태그만 | **Solved.ac 전적 위젯 + 유형별 바 차트** 추가 |
| Projects 섹션 | 하드코딩 카드만 | 하드코딩 카드 유지 + **GitHub 핀 레포 카드** 자동 표시 |
| 외부 API | 없음 | GitHub GraphQL API + Solved.ac REST API v3 |
| PAT 보관 위치 | 없음 | Supabase Edge Function 내부 (프론트 번들 비노출) |
| Edge Functions | `(없음)` | `github-repos` · `github-contributions` · `solved-proxy` |

---

## 3. 기능 정의

### 3-1. v4에서 유지된 기능

| 기능 | 상태 |
|------|------|
| 포트폴리오 전 섹션 (Hero / About / Skills / Projects / Awards / Contact) | ✅ |
| Supabase Auth 로그인/회원가입/로그아웃 | ✅ |
| 커뮤니티 게시판 (CRUD · 추천/비추천 · 댓글) | ✅ |
| Study Board (관리자 전용 작성) | ✅ |

### 3-2. v5 신규 기능

| 기능 ID | 기능명 | 위치 | 설명 | 상태 |
|---------|--------|------|------|------|
| E-01 | GitHub 잔디 그래프 | About 섹션 | 52주 × 7일 컨트리뷰션 캘린더, GitHub 원본 색상, 총 기여 수 표시 | ✅ |
| E-02 | GitHub 핀 레포 카드 | Projects 섹션 | 핀된 레포 최대 6개 — 레포명·설명·언어·⭐·🍴 카드 그리드 | ✅ |
| E-03 | Solved.ac 전적 위젯 | Skills 섹션 | 티어 뱃지·해결한 문제·레이팅·전체 랭킹 | ✅ |
| E-04 | 유형별 해결 문제 차트 | Skills 섹션 | 상위 8개 태그 가로 바 차트 (한국어 태그명) | ✅ |
| E-05 | API 실패 시 graceful hide | 전체 | 오류 시 해당 위젯만 숨김, 페이지 정상 유지 | ✅ |
| E-06 | 레포 카드 → GitHub 이동 | Projects 섹션 | 카드 클릭 시 해당 GitHub 레포 새 탭 | ✅ |

### 3-3. 동작 규칙

| 상황 | 동작 |
|------|------|
| GitHub 잔디 응답 정상 | About 섹션 about-grid 위에 캘린더 표시 |
| GitHub 핀 레포 응답 정상 + 레포 있음 | Projects 하단 "GitHub Repositories" 그리드 표시 |
| GitHub 핀 레포 없음 (`[]`) | GitHub Repositories 섹션 숨김 |
| Solved.ac 전적 응답 정상 | Skills 하단 전적 위젯 표시 |
| Solved.ac 태그 응답 정상 | Skills 전적 위젯 아래 유형별 차트 표시 |
| 어떤 API든 오류/타임아웃 | 해당 위젯 숨김, `.catch(() => {})` 무시 |

---

## 4. 화면 레이아웃

### 4-1. About 섹션 (잔디 그래프 추가)

```
┌─────────────────────────────────────────────────────────┐
│  About Me                                                │
│  (학교·소개·강점 카드 ...)                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ GitHub Contributions    139 contributions in ... │   │
│  │ ░░░░▒▒░░░░▒▒░░░░░░░░░░░░▓▓░░▒▒▓▓▓▓▓▓▓▓░░░░░░  │   │
│  │ (52주 × 7일 그리드)                              │   │
│  │                              Less ░▒▓█ More     │   │
│  └─────────────────────────────────────────────────┘   │
│  (학교 생활 / 자격증 / 교육 이수 ...)                    │
└─────────────────────────────────────────────────────────┘
```

### 4-2. Skills 섹션 (전적 위젯 + 태그 차트)

```
┌─────────────────────────────────────────────────────────┐
│  Tech Skills                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │ Core Stack           │  │ Experience           │    │
│  │ HTML5 CSS3 React ... │  │ Vue.js Python ...    │    │
│  └──────────────────────┘  └──────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [티어뱃지] shy3411    해결한 문제  레이팅   랭킹 │   │
│  │            Baekjoon/solved.ac  11      26  190,794│  │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 유형별 해결 문제                                  │   │
│  │  수학    ████████████████████████████████  10   │   │
│  │  구현    ██████████████████████████████     9   │   │
│  │  사칙연산 ██████████████████████████████    9   │   │
│  │  ...                                             │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4-3. Projects 섹션 (핀 레포 카드 추가)

```
┌─────────────────────────────────────────────────────────┐
│  Projects                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 하루틈     개인 프로젝트                          │  │
│  │ ...                                               │  │
│  └──────────────────────────────────────────────────┘  │
│  (기존 프로젝트 카드들...)                               │
│                                                         │
│  🐙 GitHub Repositories   (핀 레포 있을 때만 표시)      │
│  ┌───────────────────┐  ┌───────────────────┐          │
│  │ repo-name         │  │ repo-name         │          │
│  │ description       │  │ description       │          │
│  │ 🟡 JavaScript     │  │ 🔵 Python  ⭐ 2  │          │
│  └───────────────────┘  └───────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

---

## 5. 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | React (Vite) | useState, useEffect |
| GitHub API | GraphQL API v4 | PAT는 Edge Function에 보관 |
| Solved.ac API | REST API v3 | CORS 우회 필요 (`/user/show`, `/user/problem_tag_stats`) |
| Edge Functions | Supabase (Deno) | `github-repos` · `github-contributions` · `solved-proxy` |
| API 호출 방식 | 브라우저 `fetch` | `supabase.functions.invoke` 대신 직접 fetch 사용 |
| 인증 | Supabase Auth | v4에서 유지 |
| 데이터베이스 | Supabase (PostgreSQL) | v4에서 유지 |
| 배포 | GitHub Pages | `npm run deploy` |

### Supabase Edge Functions

#### `github-repos`
- GitHub GraphQL API로 핀된 레포 최대 6개 조회
- PAT를 함수 내부에 보관 (프론트 번들 비노출)
- `verify_jwt: false`

```graphql
user(login: "kmnnmew") {
  pinnedItems(first: 6, types: REPOSITORY) {
    nodes { name description url stargazerCount forkCount
            primaryLanguage { name color } }
  }
}
```

#### `github-contributions`
- GitHub GraphQL API로 최근 1년 컨트리뷰션 캘린더 조회
- `totalContributions`, `weeks[].contributionDays[].{ date, contributionCount, color }` 반환
- PAT를 함수 내부에 보관

```graphql
user(login: "kmnnmew") {
  contributionsCollection {
    contributionCalendar {
      totalContributions
      months { name firstDay }
      weeks { firstDay contributionDays { contributionCount date color } }
    }
  }
}
```

#### `solved-proxy`
- `type` 파라미터로 두 가지 엔드포인트 분기
  - `type` 없음 → `GET /user/show?handle=` (전적)
  - `type: 'tags'` → `GET /user/problem_tag_stats?handle=` (유형별 통계)
- `verify_jwt: false`

### 아키텍처

```
[사용자 브라우저]
       │
       ├─ fetch POST → Supabase Edge Function: github-contributions
       │    └─ GitHub GraphQL API (PAT 서버사이드) → 잔디 데이터 → About 섹션
       │
       ├─ fetch POST → Supabase Edge Function: github-repos
       │    └─ GitHub GraphQL API (PAT 서버사이드) → 핀 레포 → Projects 섹션
       │
       ├─ fetch POST → Supabase Edge Function: solved-proxy (user)
       │    └─ solved.ac /user/show → 전적 위젯 → Skills 섹션
       │
       ├─ fetch POST → Supabase Edge Function: solved-proxy (tags)
       │    └─ solved.ac /user/problem_tag_stats → 태그 차트 → Skills 섹션
       │
       ├─ Supabase Auth (v4 유지)
       │
       └─ Supabase DB (v4 유지)
            ├─ v4_board_posts
            └─ v4_comments
```

> PAT는 Edge Function 코드에만 존재. git 저장소 및 프론트엔드 번들에 포함되지 않음.

---

## 6. 개발 로드맵

| 단계 | 작업 | 상태 |
|------|------|------|
| 1~6단계 | v1~v4 구현 (포트폴리오 · 게시판 · Auth) | ✅ 완료 |
| 7단계 | GitHub Pinned Repos → Projects 섹션 카드 | ✅ 완료 |
| 8단계 | GitHub Contribution Graph → About 섹션 잔디 | ✅ 완료 |
| 9단계 | Solved.ac 전적 위젯 → Skills 섹션 | ✅ 완료 |
| 10단계 | Solved.ac 유형별 차트 → Skills 섹션 | ✅ 완료 |
| 11단계 | PAT를 Edge Function으로 이전 (보안) | ✅ 완료 |
| 12단계 | GitHub Actions 자동 배포 | 🔜 예정 |
| 13단계 | 비밀번호 재설정 (이메일) | 🔜 예정 |
| 14단계 | 검색·정렬·페이지네이션 | 🔜 예정 |

---

## 7. 파일 구조

```
System_Programming/
├── version2.md
├── version3.md
├── version4.md
├── version5.md        ← 이 문서
└── SP_Portfolio/
    ├── .gitignore     ← .env 추가
    └── src/
        ├── main.jsx
        ├── AppV4.jsx  ← E-01~E-06 기능 추가 (fetch 직접 호출)
        ├── AppV4.css  ← contrib-wrap·solved-section·tag-chart·gh-grid 스타일
        └── supabase.js

* Supabase Edge Functions (git 미포함, MCP 배포)
  ├─ github-repos           ← 핀 레포 (PAT 포함)
  ├─ github-contributions   ← 잔디 캘린더 (PAT 포함)
  └─ solved-proxy           ← solved.ac 프록시 (user + tags)
```
