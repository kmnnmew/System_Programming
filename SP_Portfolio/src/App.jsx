import './App.css'

const portfolio = {
  name: "심하윤",
  tagline: "데이터와 기술로 가치를 만드는 웹 개발자",
  intro: "단순히 코드를 짜는 것을 넘어, 적극적인 소통으로 팀의 방향을 맞추고 함께 결과물을 만들어가는 개발자입니다. 공간 정보 데이터까지 다룰 줄 아는 준비된 신입 개발자 심하윤입니다.",
  github: "https://github.com/kmnnmew",
  email: "your@email.com", // 이메일 넣어주세요
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
  certificates: [
    "정보처리산업기사",
    "정보처리기능사",
    "지도제작기능사",
    "OA마스터 (KPC자격)"
  ]
}

export default function App() {
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
          <a href="#contact">Contact</a>
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

      {/* Contact */}
      <section id="contact" className="section contact">
        <h3 className="section-title">Contact</h3>
        <div className="contact-links">
          <a href={`mailto:${portfolio.email}`} className="contact-btn">✉ Email</a>
          <a href={portfolio.github} target="_blank" rel="noreferrer" className="contact-btn">⌥ GitHub</a>
        </div>
      </section>

      <footer className="footer">© 2026 심하윤. All rights reserved.</footer>
    </div>
  )
}