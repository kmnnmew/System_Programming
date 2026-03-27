import { useState } from 'react'
import './AppV2.css'

const portfolio = {
  name: "심하윤",
  tagline: "데이터와 기술로 가치를 만드는 웹 개발자",
  intro: "단순히 코드를 짜는 것을 넘어, 적극적인 소통으로 팀의 방향을 맞추고 함께 결과물을 만들어가는 개발자입니다. 공간 정보 데이터까지 다룰 줄 아는 준비된 신입 개발자 심하윤입니다.",
  github: "https://github.com/kmnnmew",
  email: "shimhayun08@gmail.com",
  about: {
    school: "서울디지텍고등학교 (2027 졸업 예정)",
    strengths: [
      { label: "성적 우수", desc: "평균 1점 후반대 유지, 전공 과목 95% 이상 A 학점" },
      { label: "수상 경력", desc: "국내외 3개 대회 수상 (최우수상 포함)" },
      { label: "풀스택 역량", desc: "설계부터 프론트·백엔드·DB까지 전 과정 주도 경험" },
    ],
    schoolLife: [
      "신입생 대표 선정 (성적 우수)",
      "기업은행 성적 우수 학생 장학금 2년 연속 선정",
      "웹개발 동아리 1년 이상 활동",
    ],
    certificates: [
      { name: "정보처리산업기사", org: "한국산업인력공단" },
      { name: "정보처리기능사", org: "한국산업인력공단" },
      { name: "지도제작기능사", org: "한국산업인력공단" },
      { name: "OA마스터", org: "KPC자격" },
    ],
    education: [
      "Skills2Work Seoul (KITRI × 아시아재단) — 2025.07",
      "데이터 안심구역 공간정보 활용 교육 — 2025.09",
      "청소년 SW동행 프로젝트 — 2025.04 ~ 07",
      "미래내일 일경험 — 2025.07 ~ 10",
      "서울 AI센터장 교육 — 2026.03",
      "레드브릭 디지털 새싹 코딩교육 (Python · AI · 3D 메타버스) — 2024.12",
    ],
  },
  skills: {
    core: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Java (JSP)", "Oracle", "MySQL"],
    experience: ["Vue.js", "Python", "C++", "C#", "Tomcat 10.1"]
  },
  projects: [
    {
      name: "하루틈",
      type: "개인 프로젝트",
      desc: "4가지 키워드(Person, Society, Harmony, AI)를 담은 공유 일기 플랫폼",
      period: "2025.12 ~ 진행 중",
      tech: ["React", "JavaScript"],
      highlight: "SPA 기반 완성도 있는 웹 서비스 구축"
    },
    {
      name: "Curely",
      type: "팀 프로젝트",
      desc: "AI 기반 위치 및 증상 관리 병원 탐색 웹",
      period: "2025.07",
      tech: ["PHP", "MySQL", "AI API"],
      highlight: "최근 진료 데이터 PDF 출력 모듈 구현"
    },
    {
      name: "학교 상담관리 시스템",
      type: "팀 프로젝트",
      desc: "실사용과 안정성에 집중한 통합 상담 관리 솔루션",
      period: "2025.09 ~ 2025.12",
      tech: ["JSP", "Java", "HTML/CSS", "JS", "Oracle"],
      highlight: "설계부터 프론트/백엔드 개발 90% 이상 주도"
    }
  ],
  awards: [
    { title: "최우수상", org: "HL FMA 자율주행 경진대회 aMAP Pioneer Championship (한라대학교)" },
    { title: "데이터미래인재특별상", org: "데이터안심구역 활용 공동경진대회 (한국데이터산업진흥원)" },
    { title: "장려상", org: "AI for Good Impact Initiative (NAVER CONNECT)" }
  ],
}

// ── 게시판 더미 데이터 ───────────────────────────────────────────
const BOARD_POSTS = [
  {
    id: 1,
    category: "React",
    title: "React useState & useEffect 완벽 정리",
    preview: "React 훅의 핵심인 useState와 useEffect의 동작 원리, 의존성 배열, 클린업 함수까지 실전 예제로 정리했습니다.",
    date: "2026.03.20",
    tags: ["React", "Hooks", "Frontend"],
    type: "text",
    content: `## useState란?\n\nuseState는 컴포넌트에 상태값을 추가할 수 있는 훅입니다.\n\n\`\`\`jsx\nconst [count, setCount] = useState(0)\n\`\`\`\n\n## useEffect란?\n\nuseEffect는 컴포넌트가 렌더링된 후 사이드 이펙트를 처리하는 훅입니다.\n\n\`\`\`jsx\nuseEffect(() => {\n  document.title = \`클릭 ${"{count}"}번\`\n  return () => { /* 클린업 */ }\n}, [count])\n\`\`\`\n\n의존성 배열을 빈 배열로 두면 마운트 시 1회만 실행됩니다.`,
  },
  {
    id: 2,
    category: "Java",
    title: "JSP & Servlet 동작 흐름 정리",
    preview: "클라이언트 요청부터 서버 응답까지의 전체 흐름, doGet/doPost 차이, 세션과 쿠키 처리 방법을 정리했습니다.",
    date: "2026.03.15",
    tags: ["Java", "JSP", "Servlet", "Backend"],
    type: "image",
    imagePlaceholder: "JSP 동작 흐름 다이어그램",
    content: `## JSP/Servlet 요청 처리 흐름\n\n1. 클라이언트가 URL로 HTTP 요청\n2. Tomcat이 요청을 받아 Servlet에 전달\n3. doGet / doPost 메서드 실행\n4. JSP로 응답 페이지 생성\n5. 클라이언트에 HTML 반환\n\n## doGet vs doPost\n\n| 구분 | doGet | doPost |\n|------|-------|--------|\n| 데이터 전송 | URL 파라미터 | Body |\n| 보안 | 낮음 | 높음 |\n| 사용 | 조회 | 수정/등록 |`,
  },
  {
    id: 3,
    category: "DB",
    title: "Oracle JOIN 종류와 실전 쿼리",
    preview: "INNER JOIN, LEFT OUTER JOIN, FULL OUTER JOIN의 차이와 실제 프로젝트에서 자주 쓰는 쿼리 패턴을 정리했습니다.",
    date: "2026.03.10",
    tags: ["Oracle", "SQL", "DB"],
    type: "text",
    content: `## JOIN 종류\n\n### INNER JOIN\n두 테이블 모두에 있는 데이터만 조회\n\n\`\`\`sql\nSELECT a.name, b.dept\nFROM employee a\nINNER JOIN department b ON a.dept_id = b.id\n\`\`\`\n\n### LEFT OUTER JOIN\n왼쪽 테이블 전체 + 오른쪽 일치 데이터\n\n\`\`\`sql\nSELECT a.name, b.dept\nFROM employee a\nLEFT OUTER JOIN department b ON a.dept_id = b.id\n\`\`\``,
  },
  {
    id: 4,
    category: "Python",
    title: "Pandas로 공간정보 데이터 분석하기",
    preview: "데이터안심구역 경진대회에서 활용한 Pandas + GeoPandas 기반 공간 데이터 전처리 및 시각화 과정을 기록했습니다.",
    date: "2026.02.28",
    tags: ["Python", "Pandas", "GIS", "데이터분석"],
    type: "video",
    videoPlaceholder: "분석 과정 화면 녹화",
    content: `## 공간정보 데이터 처리 흐름\n\n### 1. 데이터 로드\n\`\`\`python\nimport geopandas as gpd\ngdf = gpd.read_file('seoul_districts.geojson')\n\`\`\`\n\n### 2. 전처리\n\`\`\`python\ngdf = gdf.dropna(subset=['geometry'])\ngdf['area_km2'] = gdf.geometry.area / 1e6\n\`\`\`\n\n### 3. 시각화\n\`\`\`python\ngdf.plot(column='area_km2', cmap='Blues', legend=True)\n\`\`\``,
  },
  {
    id: 5,
    category: "JavaScript",
    title: "비동기 처리: Promise vs async/await",
    preview: "콜백 지옥부터 Promise 체이닝, async/await까지 자바스크립트 비동기 처리의 진화 과정과 각 패턴의 장단점을 비교했습니다.",
    date: "2026.02.20",
    tags: ["JavaScript", "비동기", "Promise"],
    type: "text",
    content: `## 비동기 처리 패턴 비교\n\n### 콜백 (문제점: 콜백 지옥)\n\`\`\`js\nfetchUser(id, (user) => {\n  fetchPosts(user.id, (posts) => {\n    fetchComments(posts[0].id, (comments) => {\n      // ... 깊어질수록 복잡\n    })\n  })\n})\n\`\`\`\n\n### Promise\n\`\`\`js\nfetchUser(id)\n  .then(user => fetchPosts(user.id))\n  .then(posts => fetchComments(posts[0].id))\n  .catch(err => console.error(err))\n\`\`\`\n\n### async/await (권장)\n\`\`\`js\nasync function loadData(id) {\n  const user = await fetchUser(id)\n  const posts = await fetchPosts(user.id)\n  return await fetchComments(posts[0].id)\n}\n\`\`\``,
  },
  {
    id: 6,
    category: "React",
    title: "React Router로 SPA 라우팅 구현",
    preview: "BrowserRouter, Routes, Link, useNavigate, useParams를 활용해 멀티 페이지처럼 동작하는 SPA를 구성하는 방법을 정리했습니다.",
    date: "2026.02.10",
    tags: ["React", "Router", "SPA"],
    type: "image",
    imagePlaceholder: "라우팅 구조 다이어그램",
    content: `## React Router v6 기본 구성\n\n\`\`\`jsx\nimport { BrowserRouter, Routes, Route } from 'react-router-dom'\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="/post/:id" element={<PostDetail />} />\n      </Routes>\n    </BrowserRouter>\n  )\n}\n\`\`\`\n\n## useParams로 동적 라우트 처리\n\n\`\`\`jsx\nfunction PostDetail() {\n  const { id } = useParams()\n  return <div>Post #{id}</div>\n}\n\`\`\``,
  },
]

const CATEGORIES = ["전체", "React", "JavaScript", "Java", "Python", "DB"]

export default function AppV2() {
  const [activeCategory, setActiveCategory] = useState("전체")
  const [selectedPost, setSelectedPost] = useState(null)

  const filtered = activeCategory === "전체"
    ? BOARD_POSTS
    : BOARD_POSTS.filter(p => p.category === activeCategory)

  return (
    <div className="portfolio">

      {/* Nav */}
      <nav className="nav">
        <span className="nav-name">심하윤</span>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#awards">Awards</a>
          <a href="#board">Board</a>
          <a href="#contact">Contact</a>
          <a href="#" onClick={e => { e.preventDefault(); window.location.hash = '' }} className="ver-badge">v2</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1>{portfolio.name}</h1>
        <h2>{portfolio.tagline}</h2>
        <p>{portfolio.intro}</p>
        <a href="#projects" className="btn">프로젝트 보기</a>
      </section>

      {/* About */}
      <section id="about" className="section">
        <h3 className="section-title">About Me</h3>
        <div className="about-wrap">
          <div className="about-top">
            <div className="about-bio">
              <p className="about-school">{portfolio.about.school}</p>
              <p className="about-desc">
                소통과 협업을 중심으로 설계부터 배포까지 직접 주도하는 풀스택 지향 개발자입니다.
                공간정보 데이터와 AI 활용 경험을 바탕으로, 기술로 실질적인 가치를 만드는 것을 목표로 합니다.
              </p>
            </div>
            <div className="about-strengths">
              {portfolio.about.strengths.map(s => (
                <div key={s.label} className="strength-card">
                  <span className="strength-label">{s.label}</span>
                  <span className="strength-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-grid">
            <div className="about-block">
              <h4>학교 생활</h4>
              <ul className="about-list">
                {portfolio.about.schoolLife.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="about-block">
              <h4>자격증</h4>
              <ul className="about-list">
                {portfolio.about.certificates.map(c => (
                  <li key={c.name}>
                    <span>
                      <strong>{c.name}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--text2)', fontWeight: 400, marginTop: '2px' }}>{c.org}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-block">
              <h4>교육 이수</h4>
              <ul className="about-list">
                {portfolio.about.education.map(e => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <h3 className="section-title">Tech Skills</h3>
        <div className="skills-wrap">
          <div className="skill-box">
            <h4>Core Stack</h4>
            <div className="tags">
              {portfolio.skills.core.map(s => <span key={s} className="tag core">{s}</span>)}
            </div>
          </div>
          <div className="skill-box">
            <h4>Experience</h4>
            <div className="tags">
              {portfolio.skills.experience.map(s => <span key={s} className="tag exp">{s}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <h3 className="section-title">Projects</h3>
        <div className="projects-grid">
          {portfolio.projects.map(p => (
            <div key={p.name} className="project-card">
              <div className="project-header">
                <span className="project-name">{p.name}</span>
                <span className="project-type">{p.type}</span>
              </div>
              <p className="project-desc">{p.desc}</p>
              <p className="project-highlight">✦ {p.highlight}</p>
              <div className="project-footer">
                <span className="project-period">{p.period}</span>
                <div className="tags">
                  {p.tech.map(t => <span key={t} className="tag tech">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="section">
        <h3 className="section-title">Awards & Certificates</h3>
        <div className="awards-grid">
          <div>
            <h4>수상</h4>
            {portfolio.awards.map(a => (
              <div key={a.title} className="award-item">
                <span className="award-title">{a.title}</span>
                <span className="award-org">{a.org}</span>
              </div>
            ))}
          </div>
          <div>
            <h4>자격증</h4>
            {portfolio.about.certificates.map(c => (
              <div key={c.name} className="cert-item">
                {c.name}
                <span>{c.org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board */}
      <section id="board" className="section">
        <h3 className="section-title">Study Board</h3>
        <p className="board-subtitle">공부한 내용을 기록하는 학습 노트입니다.</p>

        {/* Category Tabs */}
        <div className="board-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`board-tab${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="board-grid">
          {filtered.map(post => (
            <div key={post.id} className="board-card" onClick={() => setSelectedPost(post)}>
              {/* Thumbnail */}
              <div className={`board-thumb board-thumb--${post.type}`}>
                {post.type === 'image' && (
                  <>
                    <span className="thumb-icon">🖼</span>
                    <span className="thumb-label">{post.imagePlaceholder}</span>
                  </>
                )}
                {post.type === 'video' && (
                  <>
                    <span className="thumb-icon">▶</span>
                    <span className="thumb-label">{post.videoPlaceholder}</span>
                  </>
                )}
                {post.type === 'text' && (
                  <span className="thumb-icon">📝</span>
                )}
              </div>

              {/* Content */}
              <div className="board-card-body">
                <div className="board-meta">
                  <span className="board-cat-badge">{post.category}</span>
                  <span className="board-date">{post.date}</span>
                </div>
                <h4 className="board-card-title">{post.title}</h4>
                <p className="board-card-preview">{post.preview}</p>
                <div className="board-tags">
                  {post.tags.map(t => <span key={t} className="tag tech">#{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section contact">
        <h3 className="section-title">Contact</h3>
        <div className="contact-links">
          <a href={`mailto:${portfolio.email}`} className="contact-btn">✉ Email</a>
          <a href={portfolio.github} target="_blank" rel="noreferrer" className="contact-btn">⌥ GitHub</a>
        </div>
      </section>

      <footer className="footer">© 2026 심하윤. All rights reserved. — v2</footer>

      {/* Post Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-meta">
                <span className="board-cat-badge">{selectedPost.category}</span>
                <span className="board-date">{selectedPost.date}</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedPost(null)}>✕</button>
            </div>
            <h2 className="modal-title">{selectedPost.title}</h2>
            <div className="modal-tags">
              {selectedPost.tags.map(t => <span key={t} className="tag tech">#{t}</span>)}
            </div>

            {selectedPost.type === 'image' && (
              <div className="modal-media modal-media--image">
                <span className="thumb-icon">🖼</span>
                <span>{selectedPost.imagePlaceholder}</span>
              </div>
            )}
            {selectedPost.type === 'video' && (
              <div className="modal-media modal-media--video">
                <span className="thumb-icon">▶</span>
                <span>{selectedPost.videoPlaceholder}</span>
              </div>
            )}

            <div className="modal-content">
              {selectedPost.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h3 key={i} className="md-h2">{line.slice(3)}</h3>
                if (line.startsWith('### ')) return <h4 key={i} className="md-h3">{line.slice(4)}</h4>
                if (line.startsWith('```')) return null
                if (line.startsWith('|')) return <p key={i} className="md-table-line">{line}</p>
                if (line.trim() === '') return <br key={i} />
                return <p key={i} className="md-p">{line}</p>
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
