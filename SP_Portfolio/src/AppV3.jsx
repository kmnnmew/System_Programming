import { useState, useRef, useEffect } from 'react'
import './AppV3.css'
import { supabase } from './supabase'

// ── 포트폴리오 데이터 ─────────────────────────────────────────────
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
      name: "하루틈", type: "개인 프로젝트",
      desc: "4가지 키워드(Person, Society, Harmony, AI)를 담은 공유 일기 플랫폼",
      period: "2025.12 ~ 진행 중", tech: ["React", "JavaScript"],
      highlight: "SPA 기반 완성도 있는 웹 서비스 구축"
    },
    {
      name: "Curely", type: "팀 프로젝트",
      desc: "AI 기반 위치 및 증상 관리 병원 탐색 웹",
      period: "2025.07", tech: ["PHP", "MySQL", "AI API"],
      highlight: "최근 진료 데이터 PDF 출력 모듈 구현"
    },
    {
      name: "학교 상담관리 시스템", type: "팀 프로젝트",
      desc: "실사용과 안정성에 집중한 통합 상담 관리 솔루션",
      period: "2025.09 ~ 2025.12", tech: ["JSP", "Java", "HTML/CSS", "JS", "Oracle"],
      highlight: "설계부터 프론트/백엔드 개발 90% 이상 주도"
    }
  ],
  awards: [
    { title: "최우수상", org: "HL FMA 자율주행 경진대회 aMAP Pioneer Championship (한라대학교)" },
    { title: "데이터미래인재특별상", org: "데이터안심구역 활용 공동경진대회 (한국데이터산업진흥원)" },
    { title: "장려상", org: "AI for Good Impact Initiative (NAVER CONNECT)" }
  ],
}

// ── 게시판 설정 ────────────────────────────────────────────────────
const BOARD_CATS = ["전체", "자유", "질문", "정보", "이슈", "기타"]
const STUDY_CATS = ["전체", "React", "JavaScript", "Java", "Python", "DB", "기타"]
const VOTES_KEY  = 'v3_votes' // { postId: 'like' | 'dislike' }

// ── Study Board 더미 게시글 ────────────────────────────────────────
const STUDY_DUMMY = [
  {
    id: 'sd-1', category: 'React', title: 'React useState & useEffect 완벽 정리',
    preview: 'React 훅의 핵심인 useState와 useEffect의 동작 원리, 의존성 배열, 클린업 함수까지 실전 예제로 정리했습니다.',
    date: '2026.03.20', tags: ['React', 'Hooks', 'Frontend'], type: 'text',
    content: `## useState란?\n\nuseState는 컴포넌트에 상태값을 추가할 수 있는 훅입니다.\n\`\`\`jsx\nconst [count, setCount] = useState(0)\n\`\`\`\n\n## useEffect란?\n\n의존성 배열을 빈 배열로 두면 마운트 시 1회만 실행됩니다.`,
  },
  {
    id: 'sd-2', category: 'Java', title: 'JSP & Servlet 동작 흐름 정리',
    preview: '클라이언트 요청부터 서버 응답까지의 전체 흐름, doGet/doPost 차이, 세션과 쿠키 처리 방법을 정리했습니다.',
    date: '2026.03.15', tags: ['Java', 'JSP', 'Servlet'], type: 'text',
    content: `## JSP/Servlet 요청 처리 흐름\n\n1. 클라이언트 HTTP 요청\n2. Tomcat → Servlet 전달\n3. doGet / doPost 실행\n4. JSP 응답 페이지 생성\n5. 클라이언트에 HTML 반환`,
  },
  {
    id: 'sd-3', category: 'DB', title: 'Oracle JOIN 종류와 실전 쿼리',
    preview: 'INNER JOIN, LEFT OUTER JOIN, FULL OUTER JOIN의 차이와 실제 프로젝트에서 자주 쓰는 쿼리 패턴을 정리했습니다.',
    date: '2026.03.10', tags: ['Oracle', 'SQL', 'DB'], type: 'text',
    content: `## JOIN 종류\n\n### INNER JOIN\n두 테이블 모두에 있는 데이터만 조회\n\`\`\`sql\nSELECT a.name, b.dept FROM employee a INNER JOIN department b ON a.dept_id = b.id\n\`\`\`\n\n### LEFT OUTER JOIN\n왼쪽 테이블 전체 + 오른쪽 일치 데이터`,
  },
  {
    id: 'sd-4', category: 'Python', title: 'Pandas로 공간정보 데이터 분석하기',
    preview: '데이터안심구역 경진대회에서 활용한 Pandas + GeoPandas 기반 공간 데이터 전처리 및 시각화 과정을 기록했습니다.',
    date: '2026.02.28', tags: ['Python', 'Pandas', 'GIS'], type: 'text',
    content: `## 공간정보 데이터 처리 흐름\n\n### 1. 데이터 로드\n\`\`\`python\nimport geopandas as gpd\ngdf = gpd.read_file('seoul.geojson')\n\`\`\`\n\n### 2. 전처리 & 시각화\n\`\`\`python\ngdf.plot(column='area_km2', cmap='Blues', legend=True)\n\`\`\``,
  },
  {
    id: 'sd-5', category: 'JavaScript', title: '비동기 처리: Promise vs async/await',
    preview: '콜백 지옥부터 async/await까지 자바스크립트 비동기 처리의 진화 과정과 각 패턴의 장단점을 비교했습니다.',
    date: '2026.02.20', tags: ['JavaScript', '비동기', 'Promise'], type: 'text',
    content: `## async/await (권장)\n\`\`\`js\nasync function loadData(id) {\n  const user = await fetchUser(id)\n  const posts = await fetchPosts(user.id)\n  return posts\n}\n\`\`\``,
  },
]

// ── 더미 게시글 ───────────────────────────────────────────────────
const DUMMY_POSTS = [
  {
    id: 'dummy-1', category: '자유', title: '포트폴리오 사이트 드디어 완성했습니다 🎉',
    content: 'React + Supabase로 포트폴리오 사이트를 만들었어요. 처음에는 단순한 정적 페이지였는데 이제 게시판까지 붙었네요. 앞으로도 계속 기능을 추가할 예정입니다!',
    views: 142, likes: 18, dislikes: 0,
    date: '2026.03.27', type: 'text',
  },
  {
    id: 'dummy-2', category: '질문', title: 'React useEffect 의존성 배열 관련 질문이요',
    content: 'useEffect에서 의존성 배열을 빈 배열로 두면 마운트 시 한 번만 실행된다고 알고 있는데, 그럼 특정 state가 변경될 때마다 실행하려면 어떻게 해야 하나요?\n\n예를 들어 count가 바뀔 때마다 API를 호출하고 싶은 경우요.',
    views: 87, likes: 7, dislikes: 1,
    date: '2026.03.26', type: 'text',
  },
  {
    id: 'dummy-3', category: '정보', title: 'Supabase 무료 플랜 제한 정리 (2026 기준)',
    content: 'Supabase 무료 플랜 주요 제한 사항 정리:\n\n- DB 용량: 500MB\n- 파일 스토리지: 1GB\n- 월간 API 요청: 무제한\n- 동시 접속: 최대 50개\n- 프로젝트 2개까지 무료\n- 비활성 1주일 시 자동 일시정지\n\n포트폴리오 정도 규모라면 무료 플랜으로 충분합니다.',
    views: 203, likes: 31, dislikes: 2,
    date: '2026.03.25', type: 'text',
  },
  {
    id: 'dummy-4', category: '이슈', title: 'GitHub Pages 배포 후 새로고침하면 404 뜨는 문제',
    content: 'SPA를 GitHub Pages에 배포하면 새로고침 시 404가 뜨는 문제가 있습니다.\n\n해결책:\n1. vite.config.js에서 base 경로 설정\n2. 404.html을 index.html로 복사하는 방법\n3. HashRouter 사용 (#/ 방식)\n\n저는 HashRouter 방식으로 해결했어요. 가장 간단합니다.',
    views: 156, likes: 22, dislikes: 1,
    date: '2026.03.24', type: 'text',
  },
  {
    id: 'dummy-5', category: '자유', title: '데이터안심구역 경진대회 수상 후기',
    content: '한국데이터산업진흥원 주관 데이터안심구역 활용 경진대회에서 데이터미래인재특별상을 받았습니다.\n\n공간정보 데이터를 활용해서 분석 모델을 만들었는데 생각보다 결과가 좋게 나왔어요. GeoPandas로 지역별 데이터를 시각화한 게 심사위원들한테 인상 깊었던 것 같습니다.',
    views: 98, likes: 14, dislikes: 0,
    date: '2026.03.22', type: 'text',
  },
  {
    id: 'dummy-6', category: '질문', title: 'JSP에서 파일 업로드 구현하는 방법',
    content: 'JSP + Servlet 환경에서 이미지 파일 업로드를 구현하려고 합니다.\nMultipart 처리를 어떻게 하면 좋을까요?\n\nApache Commons FileUpload 라이브러리를 써야 하나요, 아니면 다른 방법이 있나요?',
    views: 64, likes: 3, dislikes: 0,
    date: '2026.03.21', type: 'text',
  },
  {
    id: 'dummy-7', category: '정보', title: 'Git 브랜치 전략 — 혼자 쓸 때 추천 방법',
    content: '개인 프로젝트에서 쓰기 좋은 간단한 브랜치 전략:\n\n- main: 배포 브랜치 (항상 배포 가능 상태)\n- develop: 개발 브랜치\n- feature/기능명: 새 기능 개발\n\n혼자 할 때는 main + feature 정도만 써도 충분합니다. 너무 복잡하게 나눌 필요 없어요.',
    views: 177, likes: 25, dislikes: 0,
    date: '2026.03.20', type: 'text',
  },
]

// ── 유틸 ───────────────────────────────────────────────────────────
function getYoutubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m ? m[1] : null
}
function formatDate(date = new Date()) {
  return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')}`
}
function formatShortDate(str) {
  if (!str) return ''
  return str.slice(5) // "2026.03.27" → "03.27"
}

const EMPTY_FORM       = { title:'', category:'자유',  type:'text', imageData:'', videoUrl:'', content:'', password:'' }
const EMPTY_STUDY_FORM = { title:'', category:'React', type:'text', imageData:'', videoUrl:'', tags:'', content:'' }
const DUMMY_VOTES_KEY  = 'v3_dummy_votes' // { postId: { likes, dislikes } }

// ── 컴포넌트 ──────────────────────────────────────────────────────
export default function AppV3() {
  // ── 공통
  const [boardMode,    setBoardMode]   = useState('community')
  const [showWrite,    setShowWrite]   = useState(false)
  const [imgPreview,   setImgPreview]  = useState('')
  const [formErr,      setFormErr]     = useState('')
  const [submitting,   setSubmitting]  = useState(false)
  const fileRef     = useRef(null)
  const fileRef2    = useRef(null)
  const editFileRef = useRef(null)

  // ── 게시판 (community)
  const [dbPosts,      setDbPosts]     = useState([])
  const [loading,      setLoading]     = useState(true)
  const [activeCat,    setActiveCat]   = useState("전체")
  const [selectedPost, setSelectedPost]= useState(null)
  const [form,         setForm]        = useState(EMPTY_FORM)
  const [votes, setVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}') } catch { return {} }
  })
  // 더미 포스트 추천/비추천 수 (localStorage 저장)
  const [dummyCounts, setDummyCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DUMMY_VOTES_KEY) || '{}') } catch { return {} }
  })

  // ── 댓글
  const [comments,        setComments]        = useState([])
  const [commentText,     setCommentText]     = useState('')
  const [commentPwd,      setCommentPwd]      = useState('')
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentCounts,   setCommentCounts]   = useState({}) // { postId: count }

  // ── 수정 모달
  const [editingPost, setEditingPost] = useState(null)
  const [editForm,    setEditForm]    = useState(EMPTY_FORM)

  // ── 비밀번호 확인 모달
  const [pwdModal, setPwdModal] = useState(null) // { title, onConfirm }
  const [pwdInput, setPwdInput] = useState('')
  const [pwdError, setPwdError] = useState('')

  // ── Study Board
  const [studyDbPosts,  setStudyDbPosts]  = useState([])
  const [studyLoading,  setStudyLoading]  = useState(true)
  const [studyCat,      setStudyCat]      = useState("전체")
  const [studySelected, setStudySelected] = useState(null)
  const [studyForm,     setStudyForm]     = useState(EMPTY_STUDY_FORM)

  // ── 전체 게시글: DB + 더미 ───────────────────────────────────────
  // 더미 포스트에 최신 추천/비추천 수 반영
  const mergedDummy = DUMMY_POSTS.map(p => ({
    ...p,
    likes:    dummyCounts[p.id]?.likes    ?? p.likes,
    dislikes: dummyCounts[p.id]?.dislikes ?? p.dislikes,
  }))
  const allPosts = [...dbPosts, ...mergedDummy]
  const filtered = activeCat === "전체" ? allPosts : allPosts.filter(p => p.category === activeCat)
  const withIndex = filtered.map((p, i) => ({ ...p, num: filtered.length - i }))

  // ── Supabase 로드 (게시판) ────────────────────────────────────────
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const { data } = await supabase.from('board_posts').select('*').order('created_at', { ascending: false })
      if (data) setDbPosts(data)
      setLoading(false)
    })()
  }, [])

  // ── Supabase 로드 (Study Board) ───────────────────────────────────
  useEffect(() => {
    ;(async () => {
      setStudyLoading(true)
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      if (data) {
        setStudyDbPosts(data.map(p => ({
          id: p.id, userCreated: true,
          category: p.category, title: p.title,
          preview: p.preview, date: p.date,
          tags: p.tags || [], type: p.type,
          imageData: p.image_data, videoUrl: p.video_url, content: p.content,
        })))
      }
      setStudyLoading(false)
    })()
  }, [])

  // ── 게시글 열기 (조회수 증가 + 댓글 로드) ─────────────────────
  async function handleOpen(post) {
    const fresh = { ...post }
    if (!String(post.id).startsWith('dummy')) {
      const newViews = (post.views || 0) + 1
      await supabase.from('board_posts').update({ views: newViews }).eq('id', post.id)
      fresh.views = newViews
      setDbPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: newViews } : p))
    }
    setSelectedPost(fresh)
    setComments([])
    setCommentText('')
    if (!String(post.id).startsWith('dummy')) {
      setCommentsLoading(true)
      const { data } = await supabase.from('comments').select('*').eq('post_id', post.id).order('created_at', { ascending: true })
      setComments(data || [])
      setCommentsLoading(false)
    }
  }

  // ── 추천 / 비추천 ────────────────────────────────────────────────
  async function handleVote(postId, type) {
    const isDummy = String(postId).startsWith('dummy')
    const current = votes[postId]
    if (current === type) return // 이미 같은 투표

    const newVotes = { ...votes, [postId]: type }
    setVotes(newVotes)
    localStorage.setItem(VOTES_KEY, JSON.stringify(newVotes))

    if (isDummy) {
      const base = DUMMY_POSTS.find(p => p.id === postId)
      const prev = dummyCounts[postId] || { likes: base.likes, dislikes: base.dislikes }
      const upd = { ...prev }
      if (type === 'like') {
        upd.likes = upd.likes + 1
        if (current === 'dislike') upd.dislikes = Math.max(0, upd.dislikes - 1)
      } else {
        upd.dislikes = upd.dislikes + 1
        if (current === 'like') upd.likes = Math.max(0, upd.likes - 1)
      }
      const newDummy = { ...dummyCounts, [postId]: upd }
      setDummyCounts(newDummy)
      localStorage.setItem(DUMMY_VOTES_KEY, JSON.stringify(newDummy))
      setSelectedPost(p => p?.id === postId ? { ...p, ...upd } : p)
    } else {
      const target = dbPosts.find(p => p.id === postId)
      if (!target) return
      const upd = {}
      if (type === 'like') {
        upd.likes = (target.likes || 0) + 1
        if (current === 'dislike') upd.dislikes = Math.max(0, (target.dislikes || 0) - 1)
      } else {
        upd.dislikes = (target.dislikes || 0) + 1
        if (current === 'like') upd.likes = Math.max(0, (target.likes || 0) - 1)
      }
      await supabase.from('board_posts').update(upd).eq('id', postId)
      setDbPosts(prev => prev.map(p => p.id === postId ? { ...p, ...upd } : p))
      setSelectedPost(p => p?.id === postId ? { ...p, ...upd } : p)
    }
  }

  // ── 댓글 ─────────────────────────────────────────────────────────
  async function handleAddComment() {
    if (!commentText.trim() || !selectedPost || String(selectedPost.id).startsWith('dummy')) return
    const { data, error } = await supabase.from('comments').insert([{
      post_id:  selectedPost.id,
      content:  commentText.trim(),
      date:     formatDate(),
      password: commentPwd.trim() || null,
    }]).select().single()
    if (error) { alert('댓글 저장 실패: ' + error.message); return }
    setComments(prev => [...prev, data])
    setCommentText('')
    setCommentPwd('')
    setCommentCounts(prev => ({ ...prev, [selectedPost.id]: (prev[selectedPost.id] || 0) + 1 }))
  }
  async function handleDeleteComment(comment) {
    if (!comment.password) {
      if (!confirm('댓글을 삭제할까요?')) return
      await _doDeleteComment(comment.id)
      return
    }
    openPwdModal('댓글 삭제', async (pwd) => {
      if (pwd !== comment.password) { setPwdError('비밀번호가 틀렸습니다.'); return }
      closePwdModal()
      await _doDeleteComment(comment.id)
    })
  }
  async function _doDeleteComment(commentId) {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (error) { alert('삭제 실패: ' + error.message); return }
    setComments(prev => prev.filter(c => c.id !== commentId))
    if (selectedPost) {
      setCommentCounts(prev => ({ ...prev, [selectedPost.id]: Math.max(0, (prev[selectedPost.id] || 0) - 1) }))
    }
  }

  // ── 글 쓰기 ──────────────────────────────────────────────────────
  function handleForm(field, val) { setForm(prev => ({ ...prev, [field]: val })) }
  function handleTypeChange(type) {
    setForm(prev => ({ ...prev, type, imageData: '', videoUrl: '' }))
    setImgPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }
  function handleImgFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setFormErr('이미지는 3MB 이하만 가능합니다.'); return }
    setFormErr('')
    const reader = new FileReader()
    reader.onload = ev => {
      setImgPreview(ev.target.result)
      setForm(prev => ({ ...prev, imageData: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    if (!form.title.trim())                              { setFormErr('제목을 입력해주세요.'); return }
    if (!form.content.trim())                            { setFormErr('내용을 입력해주세요.'); return }
    if (form.type === 'image' && !form.imageData)        { setFormErr('이미지를 업로드해주세요.'); return }
    if (form.type === 'video' && !form.videoUrl.trim())  { setFormErr('동영상 URL을 입력해주세요.'); return }

    setSubmitting(true)
    const { data, error } = await supabase.from('board_posts').insert([{
      title:      form.title.trim(),
      content:    form.content.trim(),
      category:   form.category,
      type:       form.type,
      image_data: form.imageData || null,
      video_url:  form.videoUrl.trim() || null,
      views: 0, likes: 0, dislikes: 0,
      date:       formatDate(),
      password:   form.password.trim() || null,
    }]).select().single()
    setSubmitting(false)

    if (error) { setFormErr('저장 중 오류: ' + error.message); return }
    setDbPosts(prev => [data, ...prev])
    setForm(EMPTY_FORM); setImgPreview(''); setFormErr(''); setShowWrite(false)
  }

  // ── 비밀번호 모달 ─────────────────────────────────────────────────
  function openPwdModal(title, onConfirm) {
    setPwdModal({ title, onConfirm })
    setPwdInput('')
    setPwdError('')
  }
  function closePwdModal() {
    setPwdModal(null); setPwdInput(''); setPwdError('')
  }
  async function confirmPwd() {
    if (pwdModal) await pwdModal.onConfirm(pwdInput)
  }

  // ── 게시글 삭제 (비밀번호) ────────────────────────────────────────
  async function handleDeleteRequest(id, e) {
    e.stopPropagation()
    const post = dbPosts.find(p => p.id === id)
    if (!post) return
    if (!post.password) {
      if (!confirm('게시글을 삭제할까요?')) return
      await _doDeletePost(id)
      return
    }
    openPwdModal('게시글 삭제', async (pwd) => {
      if (pwd !== post.password) { setPwdError('비밀번호가 틀렸습니다.'); return }
      closePwdModal()
      await _doDeletePost(id)
    })
  }
  async function _doDeletePost(id) {
    const { error } = await supabase.from('board_posts').delete().eq('id', id)
    if (error) { alert('삭제 실패: ' + error.message); return }
    setDbPosts(prev => prev.filter(p => p.id !== id))
    if (selectedPost?.id === id) setSelectedPost(null)
  }

  // ── 게시글 수정 ───────────────────────────────────────────────────
  async function handleEditRequest(post, e) {
    e.stopPropagation()
    const open = () => {
      setEditingPost(post)
      setEditForm({
        title:     post.title,
        category:  post.category,
        type:      post.type,
        imageData: post.image_data || '',
        videoUrl:  post.video_url  || '',
        content:   post.content,
        password:  post.password   || '',
      })
      setImgPreview(post.image_data || '')
      setFormErr('')
    }
    if (!post.password) { open(); return }
    openPwdModal('게시글 수정', async (pwd) => {
      if (pwd !== post.password) { setPwdError('비밀번호가 틀렸습니다.'); return }
      closePwdModal(); open()
    })
  }
  function handleEditForm(field, val) { setEditForm(prev => ({ ...prev, [field]: val })) }
  function handleEditTypeChange(type) {
    setEditForm(prev => ({ ...prev, type, imageData: '', videoUrl: '' }))
    setImgPreview('')
    if (editFileRef.current) editFileRef.current.value = ''
  }
  function handleEditImgFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setFormErr('이미지는 3MB 이하만 가능합니다.'); return }
    setFormErr('')
    const reader = new FileReader()
    reader.onload = ev => {
      setImgPreview(ev.target.result)
      setEditForm(prev => ({ ...prev, imageData: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }
  async function handleEditSubmit() {
    if (!editForm.title.trim())   { setFormErr('제목을 입력해주세요.'); return }
    if (!editForm.content.trim()) { setFormErr('내용을 입력해주세요.'); return }
    if (editForm.type === 'image' && !editForm.imageData) { setFormErr('이미지를 업로드해주세요.'); return }
    if (editForm.type === 'video' && !editForm.videoUrl.trim()) { setFormErr('동영상 URL을 입력해주세요.'); return }

    setSubmitting(true)
    const { data, error } = await supabase.from('board_posts').update({
      title:      editForm.title.trim(),
      content:    editForm.content.trim(),
      category:   editForm.category,
      type:       editForm.type,
      image_data: editForm.imageData || null,
      video_url:  editForm.videoUrl.trim() || null,
    }).eq('id', editingPost.id).select().single()
    setSubmitting(false)

    if (error) { setFormErr('수정 중 오류: ' + error.message); return }
    setDbPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...data } : p))
    if (selectedPost?.id === editingPost.id) setSelectedPost(prev => ({ ...prev, ...data }))
    closeEdit()
  }
  function closeEdit() {
    setEditingPost(null); setEditForm(EMPTY_FORM)
    setImgPreview(''); setFormErr('')
    if (editFileRef.current) editFileRef.current.value = ''
  }

  function closeWrite() {
    setShowWrite(false)
    setForm(EMPTY_FORM); setStudyForm(EMPTY_STUDY_FORM)
    setImgPreview(''); setFormErr('')
    if (fileRef.current)  fileRef.current.value = ''
    if (fileRef2.current) fileRef2.current.value = ''
  }

  // ── Study Board 핸들러 ────────────────────────────────────────────
  function handleStudyForm(field, val) { setStudyForm(prev => ({ ...prev, [field]: val })) }
  function handleStudyTypeChange(type) {
    setStudyForm(prev => ({ ...prev, type, imageData: '', videoUrl: '' }))
    setImgPreview('')
    if (fileRef2.current) fileRef2.current.value = ''
  }
  function handleStudyImgFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setFormErr('이미지는 3MB 이하만 가능합니다.'); return }
    setFormErr('')
    const reader = new FileReader()
    reader.onload = ev => {
      setImgPreview(ev.target.result)
      setStudyForm(prev => ({ ...prev, imageData: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }
  async function handleStudySubmit() {
    setFormErr('Study Board 작성은 v4 로그인 후 이용해주세요.'); return
    if (!studyForm.title.trim())                                   { setFormErr('제목을 입력해주세요.'); return }
    if (!studyForm.content.trim())                                 { setFormErr('내용을 입력해주세요.'); return }
    if (studyForm.type === 'image' && !studyForm.imageData)        { setFormErr('이미지를 업로드해주세요.'); return }
    if (studyForm.type === 'video' && !studyForm.videoUrl.trim())  { setFormErr('동영상 URL을 입력해주세요.'); return }

    setSubmitting(true)
    const { data, error } = await supabase.from('posts').insert([{
      title:      studyForm.title.trim(),
      content:    studyForm.content.trim(),
      preview:    studyForm.content.trim().slice(0, 120),
      category:   studyForm.category,
      tags:       studyForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      type:       studyForm.type,
      image_data: studyForm.imageData || null,
      video_url:  studyForm.videoUrl.trim() || null,
      date:       formatDate(),
    }]).select().single()
    setSubmitting(false)

    if (error) { setFormErr('저장 중 오류: ' + error.message); return }
    const newPost = {
      id: data.id, userCreated: true,
      category: data.category, title: data.title,
      preview: data.preview, date: data.date,
      tags: data.tags || [], type: data.type,
      imageData: data.image_data, videoUrl: data.video_url, content: data.content,
    }
    setStudyDbPosts(prev => [newPost, ...prev])
    closeWrite()
  }
  async function handleStudyDelete(id, e) {
    e.stopPropagation()
    if (!confirm('게시글을 삭제할까요?')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) { alert('삭제 실패: ' + error.message); return }
    setStudyDbPosts(prev => prev.filter(p => p.id !== id))
    if (studySelected?.id === id) setStudySelected(null)
  }

  // ── 렌더 ─────────────────────────────────────────────────────────
  return (
    <div className="portfolio v3">

      {/* Nav */}
      <nav className="nav">
        <div className="nav-left">
          <span className="nav-name">심하윤</span>
          <span className="ver-badge v3-badge">v3</span>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#awards">Awards</a>
          <a href="#board">Board</a>
          <a href="#contact">Contact</a>
          <a href="#v4" className="nav-ver-switch">v4 →</a>
          <a href="#v2" className="nav-ver-switch">← v2</a>
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
              <ul className="about-list">{portfolio.about.schoolLife.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="about-block">
              <h4>자격증</h4>
              <ul className="about-list">
                {portfolio.about.certificates.map(c => (
                  <li key={c.name}>
                    <span>
                      <strong>{c.name}</strong>
                      <span style={{display:'block',fontSize:'12px',color:'var(--text2)',fontWeight:400,marginTop:'2px'}}>{c.org}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-block">
              <h4>교육 이수</h4>
              <ul className="about-list">{portfolio.about.education.map(e => <li key={e}>{e}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <h3 className="section-title">Tech Skills</h3>
        <div className="skills-wrap">
          <div className="skill-box"><h4>Core Stack</h4>
            <div className="tags">{portfolio.skills.core.map(s => <span key={s} className="tag core">{s}</span>)}</div>
          </div>
          <div className="skill-box"><h4>Experience</h4>
            <div className="tags">{portfolio.skills.experience.map(s => <span key={s} className="tag exp">{s}</span>)}</div>
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
                <div className="tags">{p.tech.map(t => <span key={t} className="tag tech">{t}</span>)}</div>
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
              <div key={c.name} className="cert-item">{c.name}<span>{c.org}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Board (게시판 + Study Board 통합) ─────────────────────── */}
      <section id="board" className="section">
        {/* 헤더 */}
        <div className="board-header-row">
          <h3 className="section-title" style={{ marginBottom:0, borderBottom:'none' }}>Board</h3>
          <button className="write-btn" onClick={() => setShowWrite(true)}>+ 글 쓰기</button>
        </div>

        {/* 모드 전환 탭 */}
        <div className="board-mode-tabs">
          <button
            className={`board-mode-tab${boardMode === 'community' ? ' active' : ''}`}
            onClick={() => setBoardMode('community')}
          >💬 게시판</button>
          <button
            className={`board-mode-tab${boardMode === 'study' ? ' active' : ''}`}
            onClick={() => setBoardMode('study')}
          >📚 Study Board</button>
        </div>

        {/* ── 커뮤니티 게시판 ──────────────────────────────────────── */}
        {boardMode === 'community' && (() => {
          return (
            <>
              <p className="board-subtitle">자유롭게 글을 작성하고 소통하는 공간입니다.</p>
              <div className="board-tabs">
                {BOARD_CATS.map(cat => (
                  <button key={cat} className={`board-tab${activeCat === cat ? ' active' : ''}`}
                    onClick={() => setActiveCat(cat)}>{cat}</button>
                ))}
              </div>
              <div className="blist">
                <div className="blist-header">
                  <span className="blist-col-num">번호</span>
                  <span className="blist-col-cat">분류</span>
                  <span className="blist-col-title">제목</span>
                  <span className="blist-col-stat">👍</span>
                  <span className="blist-col-stat">👁</span>
                  <span className="blist-col-date">날짜</span>
                </div>
                {loading ? (
                  <div className="blist-empty">불러오는 중...</div>
                ) : withIndex.length === 0 ? (
                  <div className="blist-empty">아직 게시글이 없습니다. 첫 글을 작성해보세요!</div>
                ) : withIndex.map(post => (
                  <div key={post.id} className="blist-row" onClick={() => handleOpen(post)}>
                    <span className="blist-col-num blist-num">{post.num}</span>
                    <span className="blist-col-cat"><span className="blist-cat-badge">{post.category}</span></span>
                    <span className="blist-col-title blist-title">
                      {post.title}
                      {post.type === 'image' && <span className="blist-media-icon">🖼</span>}
                      {post.type === 'video' && <span className="blist-media-icon">▶</span>}
                      {!String(post.id).startsWith('dummy') && (
                        <span className="blist-actions">
                          <button className="blist-edit-btn" onClick={e => handleEditRequest(post, e)} title="수정">✏</button>
                          <button className="blist-del-btn"  onClick={e => handleDeleteRequest(post.id, e)} title="삭제">✕</button>
                        </span>
                      )}
                    </span>
                    <span className="blist-col-stat blist-likes">
                      {(post.likes||0) > 0
                        ? <span className="blist-likes-hot">{post.likes}</span>
                        : <span className="blist-likes-zero">{post.likes||0}</span>}
                    </span>
                    <span className="blist-col-stat blist-views">{post.views||0}</span>
                    <span className="blist-col-date blist-date">{formatShortDate(post.date)}</span>
                  </div>
                ))}
              </div>
            </>
          )
        })()}

        {/* ── Study Board ──────────────────────────────────────────── */}
        {boardMode === 'study' && (() => {
          const allStudy = [...studyDbPosts, ...STUDY_DUMMY]
          const filteredStudy = studyCat === "전체" ? allStudy : allStudy.filter(p => p.category === studyCat)
          return (
            <>
              <p className="board-subtitle">공부한 내용을 기록하는 학습 노트입니다.</p>
              <div className="board-tabs">
                {STUDY_CATS.map(cat => (
                  <button key={cat} className={`board-tab${studyCat === cat ? ' active' : ''}`}
                    onClick={() => setStudyCat(cat)}>{cat}</button>
                ))}
              </div>
              {studyLoading ? (
                <div className="blist-empty">불러오는 중...</div>
              ) : filteredStudy.length === 0 ? (
                <div className="blist-empty">아직 게시글이 없습니다. 첫 글을 작성해보세요!</div>
              ) : (
                <div className="board-grid">
                  {filteredStudy.map(post => (
                    <div key={post.id} className="board-card" onClick={() => setStudySelected(post)}>
                      <div className={`board-thumb board-thumb--${post.type}`}>
                        {post.type === 'image' && post.imageData
                          ? <img src={post.imageData} alt={post.title} className="thumb-img" />
                          : post.type === 'image'
                            ? <><span className="thumb-icon">🖼</span></>
                          : post.type === 'video' && post.videoUrl && getYoutubeId(post.videoUrl)
                            ? <img src={`https://img.youtube.com/vi/${getYoutubeId(post.videoUrl)}/mqdefault.jpg`} alt={post.title} className="thumb-img" />
                            : post.type === 'video'
                              ? <><span className="thumb-icon">▶</span><span className="thumb-label">동영상</span></>
                              : <span className="thumb-icon">📝</span>
                        }
                        {post.userCreated && (
                          <button className="card-delete-btn" onClick={e => handleStudyDelete(post.id, e)} title="삭제">✕</button>
                        )}
                      </div>
                      <div className="board-card-body">
                        <div className="board-meta">
                          <span className="board-cat-badge">{post.category}</span>
                          <span className="board-date">{post.date}</span>
                        </div>
                        <h4 className="board-card-title">{post.title}</h4>
                        <p className="board-card-preview">{post.preview}</p>
                        <div className="board-tags">
                          {(post.tags||[]).map(t => <span key={t} className="tag tech">#{t}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        })()}
      </section>

      {/* Contact */}
      <section id="contact" className="section contact">
        <h3 className="section-title">Contact</h3>
        <div className="contact-links">
          <a href={`mailto:${portfolio.email}`} className="contact-btn">✉ Email</a>
          <a href={portfolio.github} target="_blank" rel="noreferrer" className="contact-btn">⌥ GitHub</a>
        </div>
      </section>

      <footer className="footer">© 2026 심하윤. All rights reserved. — v3</footer>

      {/* ── 게시글 상세 모달 ─────────────────────────────────────── */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal post-modal" onClick={e => e.stopPropagation()}>
            {/* 헤더 */}
            <div className="post-modal-header">
              <span className="blist-cat-badge">{selectedPost.category}</span>
              <div className="post-modal-header-actions">
                {!String(selectedPost.id).startsWith('dummy') && (<>
                  <button className="post-modal-edit-btn" onClick={e => { handleEditRequest(selectedPost, e) }}>✏ 수정</button>
                  <button className="post-modal-del-btn"  onClick={e => { handleDeleteRequest(selectedPost.id, e) }}>🗑 삭제</button>
                </>)}
                <button className="modal-close" onClick={() => setSelectedPost(null)}>✕</button>
              </div>
            </div>
            <h2 className="post-modal-title">{selectedPost.title}</h2>
            <div className="post-modal-meta">
              <span>조회 {selectedPost.views || 0}</span>
              <span>{selectedPost.date}</span>
            </div>
            <div className="post-modal-divider" />

            {/* 미디어 */}
            {selectedPost.type === 'image' && selectedPost.image_data && (
              <img src={selectedPost.image_data} alt={selectedPost.title} className="modal-img" />
            )}
            {selectedPost.type === 'image' && !selectedPost.image_data && selectedPost.imageData && (
              <img src={selectedPost.imageData} alt={selectedPost.title} className="modal-img" />
            )}
            {selectedPost.type === 'video' && (selectedPost.video_url || selectedPost.videoUrl) &&
              getYoutubeId(selectedPost.video_url || selectedPost.videoUrl) && (
              <div className="modal-video-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(selectedPost.video_url || selectedPost.videoUrl)}`}
                  title={selectedPost.title} allowFullScreen className="modal-iframe"
                />
              </div>
            )}

            {/* 내용 */}
            <div className="post-modal-content">
              {selectedPost.content.split('\n').map((line, i) =>
                line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
              )}
            </div>

            {/* 추천 / 비추천 */}
            <div className="post-vote-area">
              <button
                className={`vote-btn vote-like${votes[selectedPost.id] === 'like' ? ' voted' : ''}`}
                onClick={() => handleVote(selectedPost.id, 'like')}
              >
                👍 추천 <span className="vote-count">{selectedPost.likes || 0}</span>
              </button>
              <button
                className={`vote-btn vote-dislike${votes[selectedPost.id] === 'dislike' ? ' voted' : ''}`}
                onClick={() => handleVote(selectedPost.id, 'dislike')}
              >
                👎 비추천 <span className="vote-count">{selectedPost.dislikes || 0}</span>
              </button>
            </div>

            {/* 댓글 */}
            <div className="post-comments">
              <h4 className="comments-title">
                💬 댓글{comments.length > 0 ? ` (${comments.length})` : ''}
              </h4>
              {String(selectedPost.id).startsWith('dummy') ? (
                <p className="comments-notice">샘플 게시글에는 댓글을 작성할 수 없습니다.</p>
              ) : (
                <>
                  {commentsLoading ? (
                    <p className="comments-loading">댓글 불러오는 중...</p>
                  ) : comments.length === 0 ? (
                    <p className="comments-empty">첫 댓글을 남겨보세요!</p>
                  ) : (
                    <div className="comments-list">
                      {comments.map(c => (
                        <div key={c.id} className="comment-item">
                          <div className="comment-content">{c.content}</div>
                          <div className="comment-footer">
                            <span className="comment-date">{c.date}{c.password && <span className="comment-has-pwd" title="비밀번호 설정됨"> 🔒</span>}</span>
                            <button className="comment-del-btn" onClick={() => handleDeleteComment(c)}>삭제</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="comment-write-area">
                    <textarea
                      className="comment-textarea"
                      placeholder="댓글을 입력하세요..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment() } }}
                      rows={2}
                    />
                    <div className="comment-write-bottom">
                      <input
                        className="comment-pwd-input"
                        type="password"
                        placeholder="🔒 비밀번호 (선택)"
                        value={commentPwd}
                        onChange={e => setCommentPwd(e.target.value)}
                        maxLength={20}
                      />
                      <button className="comment-submit-btn" onClick={handleAddComment}>등록</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Study Board 상세 모달 ────────────────────────────────── */}
      {studySelected && (
        <div className="modal-overlay" onClick={() => setStudySelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-meta">
                <span className="board-cat-badge">{studySelected.category}</span>
                <span className="board-date">{studySelected.date}</span>
              </div>
              <button className="modal-close" onClick={() => setStudySelected(null)}>✕</button>
            </div>
            <h2 className="modal-title">{studySelected.title}</h2>
            <div className="modal-tags">
              {(studySelected.tags||[]).map(t => <span key={t} className="tag tech">#{t}</span>)}
            </div>
            {studySelected.type === 'image' && studySelected.imageData && (
              <img src={studySelected.imageData} alt={studySelected.title} className="modal-img" />
            )}
            {studySelected.type === 'video' && studySelected.videoUrl && getYoutubeId(studySelected.videoUrl) && (
              <div className="modal-video-wrap">
                <iframe src={`https://www.youtube.com/embed/${getYoutubeId(studySelected.videoUrl)}`}
                  title={studySelected.title} allowFullScreen className="modal-iframe" />
              </div>
            )}
            <div className="modal-content">
              {studySelected.content.split('\n').map((line, i) => {
                if (line.startsWith('## '))  return <h3 key={i} className="md-h2">{line.slice(3)}</h3>
                if (line.startsWith('### ')) return <h4 key={i} className="md-h3">{line.slice(4)}</h4>
                if (line.startsWith('```'))  return null
                if (line.trim() === '')      return <br key={i} />
                return <p key={i} className="md-p">{line}</p>
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 글 쓰기 모달 (모드별 분기) ──────────────────────────── */}
      {showWrite && (
        <div className="modal-overlay" onClick={closeWrite}>
          <div className="modal write-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="write-modal-title">
                {boardMode === 'study' ? '📚 학습 노트 작성' : '💬 새 글 작성'}
              </h2>
              <button className="modal-close" onClick={closeWrite}>✕</button>
            </div>

            {/* ── 게시판 폼 ── */}
            {boardMode === 'community' && (<>
              <div className="form-group">
                <label className="form-label">제목 <span className="required">*</span></label>
                <input className="form-input" type="text" placeholder="제목을 입력하세요"
                  value={form.title} onChange={e => handleForm('title', e.target.value)} maxLength={100} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">분류 <span className="required">*</span></label>
                  <select className="form-input form-select" value={form.category}
                    onChange={e => handleForm('category', e.target.value)}>
                    {BOARD_CATS.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">미디어 타입</label>
                  <div className="type-toggle">
                    {['text','image','video'].map(t => (
                      <button key={t} className={`type-btn${form.type === t ? ' active' : ''}`}
                        onClick={() => handleTypeChange(t)}>
                        {t === 'text' ? '📝 텍스트' : t === 'image' ? '🖼 이미지' : '▶ 동영상'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {form.type === 'image' && (
                <div className="form-group">
                  <label className="form-label">이미지 <span className="required">*</span> <span className="form-hint">최대 3MB</span></label>
                  <input ref={fileRef} type="file" accept="image/*" className="form-file" onChange={handleImgFile} />
                  {imgPreview && <img src={imgPreview} alt="미리보기" className="image-preview" />}
                </div>
              )}
              {form.type === 'video' && (
                <div className="form-group">
                  <label className="form-label">동영상 URL <span className="required">*</span></label>
                  <input className="form-input" type="url" placeholder="https://www.youtube.com/watch?v=..."
                    value={form.videoUrl} onChange={e => handleForm('videoUrl', e.target.value)} />
                  {form.videoUrl && getYoutubeId(form.videoUrl) && (
                    <img src={`https://img.youtube.com/vi/${getYoutubeId(form.videoUrl)}/mqdefault.jpg`}
                      alt="썸네일" className="image-preview" />
                  )}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">내용 <span className="required">*</span></label>
                <textarea className="form-textarea" placeholder="내용을 자유롭게 작성하세요."
                  value={form.content} onChange={e => handleForm('content', e.target.value)} rows={10} />
              </div>
              <div className="form-group">
                <label className="form-label">🔒 비밀번호 <span className="form-hint">수정·삭제 시 사용 (선택)</span></label>
                <input className="form-input" type="password" placeholder="비밀번호를 설정하면 수정·삭제에 필요합니다"
                  value={form.password} onChange={e => handleForm('password', e.target.value)} maxLength={30} />
              </div>
            </>)}

            {/* ── Study Board 폼 ── */}
            {boardMode === 'study' && (<>
              <div className="form-group">
                <label className="form-label">제목 <span className="required">*</span></label>
                <input className="form-input" type="text" placeholder="학습 노트 제목을 입력하세요"
                  value={studyForm.title} onChange={e => handleStudyForm('title', e.target.value)} maxLength={100} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">카테고리 <span className="required">*</span></label>
                  <select className="form-input form-select" value={studyForm.category}
                    onChange={e => handleStudyForm('category', e.target.value)}>
                    {STUDY_CATS.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">미디어 타입</label>
                  <div className="type-toggle">
                    {['text','image','video'].map(t => (
                      <button key={t} className={`type-btn${studyForm.type === t ? ' active' : ''}`}
                        onClick={() => handleStudyTypeChange(t)}>
                        {t === 'text' ? '📝 텍스트' : t === 'image' ? '🖼 이미지' : '▶ 동영상'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">태그 <span className="form-hint">쉼표로 구분 (예: React, Hooks)</span></label>
                <input className="form-input" type="text" placeholder="React, Hooks, Frontend"
                  value={studyForm.tags} onChange={e => handleStudyForm('tags', e.target.value)} />
              </div>
              {studyForm.type === 'image' && (
                <div className="form-group">
                  <label className="form-label">이미지 <span className="required">*</span> <span className="form-hint">최대 3MB</span></label>
                  <input ref={fileRef2} type="file" accept="image/*" className="form-file" onChange={handleStudyImgFile} />
                  {imgPreview && <img src={imgPreview} alt="미리보기" className="image-preview" />}
                </div>
              )}
              {studyForm.type === 'video' && (
                <div className="form-group">
                  <label className="form-label">동영상 URL <span className="required">*</span></label>
                  <input className="form-input" type="url" placeholder="https://www.youtube.com/watch?v=..."
                    value={studyForm.videoUrl} onChange={e => handleStudyForm('videoUrl', e.target.value)} />
                  {studyForm.videoUrl && getYoutubeId(studyForm.videoUrl) && (
                    <img src={`https://img.youtube.com/vi/${getYoutubeId(studyForm.videoUrl)}/mqdefault.jpg`}
                      alt="썸네일" className="image-preview" />
                  )}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">내용 <span className="required">*</span></label>
                <textarea className="form-textarea" placeholder="공부한 내용을 자유롭게 작성하세요."
                  value={studyForm.content} onChange={e => handleStudyForm('content', e.target.value)} rows={10} />
              </div>
            </>)}

            {formErr && <p className="form-error">{formErr}</p>}
            <div className="form-actions">
              <button className="form-cancel" onClick={closeWrite} disabled={submitting}>취소</button>
              <button className="form-submit"
                onClick={boardMode === 'study' ? handleStudySubmit : handleSubmit}
                disabled={submitting}>
                {submitting ? '저장 중...' : '게시하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 게시글 수정 모달 ────────────────────────────────────── */}
      {editingPost && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal write-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="write-modal-title">✏ 게시글 수정</h2>
              <button className="modal-close" onClick={closeEdit}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">제목 <span className="required">*</span></label>
              <input className="form-input" type="text" placeholder="제목을 입력하세요"
                value={editForm.title} onChange={e => handleEditForm('title', e.target.value)} maxLength={100} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">분류 <span className="required">*</span></label>
                <select className="form-input form-select" value={editForm.category}
                  onChange={e => handleEditForm('category', e.target.value)}>
                  {BOARD_CATS.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">미디어 타입</label>
                <div className="type-toggle">
                  {['text','image','video'].map(t => (
                    <button key={t} className={`type-btn${editForm.type === t ? ' active' : ''}`}
                      onClick={() => handleEditTypeChange(t)}>
                      {t === 'text' ? '📝 텍스트' : t === 'image' ? '🖼 이미지' : '▶ 동영상'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {editForm.type === 'image' && (
              <div className="form-group">
                <label className="form-label">이미지 <span className="form-hint">새 이미지로 교체하려면 업로드 (최대 3MB)</span></label>
                <input ref={editFileRef} type="file" accept="image/*" className="form-file" onChange={handleEditImgFile} />
                {imgPreview && <img src={imgPreview} alt="미리보기" className="image-preview" />}
              </div>
            )}
            {editForm.type === 'video' && (
              <div className="form-group">
                <label className="form-label">동영상 URL <span className="required">*</span></label>
                <input className="form-input" type="url" placeholder="https://www.youtube.com/watch?v=..."
                  value={editForm.videoUrl} onChange={e => handleEditForm('videoUrl', e.target.value)} />
                {editForm.videoUrl && getYoutubeId(editForm.videoUrl) && (
                  <img src={`https://img.youtube.com/vi/${getYoutubeId(editForm.videoUrl)}/mqdefault.jpg`}
                    alt="썸네일" className="image-preview" />
                )}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">내용 <span className="required">*</span></label>
              <textarea className="form-textarea" placeholder="내용을 자유롭게 작성하세요."
                value={editForm.content} onChange={e => handleEditForm('content', e.target.value)} rows={10} />
            </div>
            {formErr && <p className="form-error">{formErr}</p>}
            <div className="form-actions">
              <button className="form-cancel" onClick={closeEdit} disabled={submitting}>취소</button>
              <button className="form-submit" onClick={handleEditSubmit} disabled={submitting}>
                {submitting ? '저장 중...' : '수정 완료'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 비밀번호 확인 모달 ──────────────────────────────────── */}
      {pwdModal && (
        <div className="modal-overlay pwd-overlay" onClick={closePwdModal}>
          <div className="modal pwd-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="pwd-modal-title">🔒 {pwdModal.title}</h3>
              <button className="modal-close" onClick={closePwdModal}>✕</button>
            </div>
            <p className="pwd-modal-desc">비밀번호를 입력해주세요.</p>
            <input
              className="form-input"
              type="password"
              placeholder="비밀번호"
              value={pwdInput}
              onChange={e => setPwdInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmPwd()}
              autoFocus
            />
            {pwdError && <p className="form-error" style={{marginTop:'8px'}}>{pwdError}</p>}
            <div className="form-actions" style={{marginTop:'16px'}}>
              <button className="form-cancel" onClick={closePwdModal}>취소</button>
              <button className="form-submit" onClick={confirmPwd}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
