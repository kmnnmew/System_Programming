import { useState, useRef, useEffect } from 'react'
import './AppV4.css'
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
const BOARD_CATS    = ["전체", "자유", "질문", "정보", "이슈", "기타"]
const STUDY_CATS    = ["전체", "React", "JavaScript", "Java", "Python", "DB", "기타"]
const VOTES_KEY = 'v4_votes'

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
  return str.slice(5)
}
function shortEmail(email) {
  if (!email) return ''
  const at = email.indexOf('@')
  if (at <= 2) return email
  return email.slice(0, 2) + '***' + email.slice(at)
}

const OWNER_EMAIL      = 'sdh240411@sdh.hs.kr'
const EMPTY_FORM       = { title:'', category:'자유',  type:'text', imageData:'', videoUrl:'', content:'' }
const EMPTY_STUDY_FORM = { title:'', category:'React', type:'text', imageData:'', videoUrl:'', tags:'', content:'' }

// ── 컴포넌트 ──────────────────────────────────────────────────────
export default function AppV4() {
  // ── Auth
  const [session,        setSession]        = useState(null)
  const [authModal,      setAuthModal]      = useState(false)
  const [authTab,        setAuthTab]        = useState('login')
  const [authEmail,      setAuthEmail]      = useState('')
  const [authPwd,        setAuthPwd]        = useState('')
  const [authPwdConfirm, setAuthPwdConfirm] = useState('')
  const [authErr,        setAuthErr]        = useState('')
  const [authSuccess,    setAuthSuccess]    = useState('')
  const [authLoading,    setAuthLoading]    = useState(false)

  // ── 공통
  const [boardMode,    setBoardMode]   = useState('community')
  const [showWrite,    setShowWrite]   = useState(false)
  const [imgPreview,   setImgPreview]  = useState('')
  const [formErr,      setFormErr]     = useState('')
  const [submitting,   setSubmitting]  = useState(false)
  const fileRef   = useRef(null)
  const fileRef2  = useRef(null)
  const editFileRef = useRef(null)

  // ── 게시판 (community)
  const [dbPosts,      setDbPosts]     = useState([])
  const [loading,      setLoading]     = useState(true)
  const [activeCat,    setActiveCat]   = useState("전체")
  const [selectedPost, setSelectedPost]= useState(null)
  const [form,         setForm]        = useState(EMPTY_FORM)
  const [votes,        setVotes]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}') } catch { return {} }
  })
  const [editingPost,  setEditingPost] = useState(null)
  const [editForm,     setEditForm]    = useState(EMPTY_FORM)

  // ── 댓글
  const [comments,        setComments]        = useState([])
  const [commentText,     setCommentText]     = useState('')
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentCounts,   setCommentCounts]   = useState({})

  // ── Study Board
  const [studyDbPosts,  setStudyDbPosts]  = useState([])
  const [studyLoading,  setStudyLoading]  = useState(true)
  const [studyCat,      setStudyCat]      = useState("전체")
  const [studySelected, setStudySelected] = useState(null)
  const [studyForm,     setStudyForm]     = useState(EMPTY_STUDY_FORM)

  // ── GitHub Repos
  const [githubRepos,    setGithubRepos]    = useState([])

  // ── GitHub Contributions
  const [contributions,  setContributions]  = useState(null)

  // ── Solved.ac
  const [solvedData,     setSolvedData]     = useState(null)
  const [solvedTags,     setSolvedTags]     = useState([])

  const filtered  = activeCat === "전체" ? dbPosts : dbPosts.filter(p => p.category === activeCat)
  const withIndex = filtered.map((p, i) => ({ ...p, num: filtered.length - i }))

  // ── Auth 세션 감지
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // ── Supabase 로드 (게시판)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const { data } = await supabase.from('v4_board_posts').select('*').order('created_at', { ascending: false })
      if (data) setDbPosts(data)
      setLoading(false)
    })()
  }, [])

  // ── Supabase 로드 (Study Board)
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

  // ── 공통 Edge Function 호출 헬퍼
  const FN_URL = 'https://izdhrcrrsaapbnclzcsp.supabase.co/functions/v1'
  const FN_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZGhyY3Jyc2FhcGJuY2x6Y3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NzU0MzAsImV4cCI6MjA5MDE1MTQzMH0.yi1XfEkk5CXmtVhJ2sPDsIwLw-N4rfycNOr9kw1Xksc'
  const fnFetch = (name, body = {}) =>
    fetch(`${FN_URL}/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${FN_KEY}` },
      body: JSON.stringify(body),
    }).then(r => r.json())

  // ── GitHub 핀 레포 로드
  useEffect(() => {
    fnFetch('github-repos')
      .then(data => { if (Array.isArray(data)) setGithubRepos(data) })
      .catch(() => {})
  }, [])

  // ── GitHub 잔디 로드
  useEffect(() => {
    fnFetch('github-contributions')
      .then(data => { if (data && data.weeks) setContributions(data) })
      .catch(() => {})
  }, [])

  // ── Solved.ac 로드
  useEffect(() => {
    fnFetch('solved-proxy', { handle: 'shy3411' })
      .then(data => { if (data && data.handle) setSolvedData(data) })
      .catch(() => {})
    fnFetch('solved-proxy', { handle: 'shy3411', type: 'tags' })
      .then(data => {
        if (data && Array.isArray(data.items)) {
          const top = [...data.items]
            .sort((a, b) => b.solved - a.solved)
            .slice(0, 8)
            .map(item => ({
              name: item.tag.displayNames?.find(d => d.language === 'ko')?.name || item.tag.key,
              solved: item.solved,
            }))
          setSolvedTags(top)
        }
      })
      .catch(() => {})
  }, [])

  // ── Auth 핸들러
  function openAuth(tab = 'login') {
    setAuthTab(tab); setAuthEmail(''); setAuthPwd(''); setAuthPwdConfirm('')
    setAuthErr(''); setAuthSuccess(''); setAuthModal(true)
  }
  function closeAuth() {
    setAuthModal(false); setAuthErr(''); setAuthSuccess('')
  }
  async function handleLogin() {
    setAuthErr(''); setAuthSuccess(''); setAuthLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(), password: authPwd,
    })
    setAuthLoading(false)
    if (error) { setAuthErr(error.message); return }
    closeAuth()
  }
  async function handleSignup() {
    setAuthErr(''); setAuthSuccess('')
    if (!authEmail.trim()) { setAuthErr('이메일을 입력해주세요.'); return }
    if (authPwd.length < 6) { setAuthErr('비밀번호는 6자 이상이어야 합니다.'); return }
    if (authPwd !== authPwdConfirm) { setAuthErr('비밀번호가 일치하지 않습니다.'); return }
    setAuthLoading(true)
    const { error } = await supabase.auth.signUp({ email: authEmail.trim(), password: authPwd })
    setAuthLoading(false)
    if (error) { setAuthErr(error.message); return }
    setAuthSuccess('가입 완료! 이메일을 확인하여 인증 후 로그인해주세요.')
    setAuthEmail(''); setAuthPwd(''); setAuthPwdConfirm('')
  }
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  // ── 게시글 열기 (조회수 + 댓글 로드)
  async function handleOpen(post) {
    const fresh = { ...post }
    const newViews = (post.views || 0) + 1
    await supabase.from('v4_board_posts').update({ views: newViews }).eq('id', post.id)
    fresh.views = newViews
    setDbPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: newViews } : p))
    setSelectedPost(fresh)
    setComments([])
    setCommentText('')
    setCommentsLoading(true)
    const { data } = await supabase.from('v4_comments').select('*')
      .eq('post_id', post.id).order('created_at', { ascending: true })
    setComments(data || [])
    setCommentsLoading(false)
  }

  // ── 추천 / 비추천
  async function handleVote(postId, type) {
    const current = votes[postId]
    if (current === type) return

    const newVotes = { ...votes, [postId]: type }
    setVotes(newVotes)
    localStorage.setItem(VOTES_KEY, JSON.stringify(newVotes))

    const target = dbPosts.find(p => p.id === postId)
    if (!target) return
    const upd = {}
    if (type === 'like')    { upd.likes    = (target.likes||0)+1;    if (current==='dislike') upd.dislikes = Math.max(0,(target.dislikes||0)-1) }
    else                    { upd.dislikes = (target.dislikes||0)+1; if (current==='like')    upd.likes    = Math.max(0,(target.likes||0)-1) }
    await supabase.from('v4_board_posts').update(upd).eq('id', postId)
    setDbPosts(prev => prev.map(p => p.id === postId ? { ...p, ...upd } : p))
    setSelectedPost(p => p?.id === postId ? { ...p, ...upd } : p)
  }

  // ── 댓글
  async function handleAddComment() {
    if (!commentText.trim() || !selectedPost) return
    if (!session) { openAuth('login'); return }
    const { data, error } = await supabase.from('v4_comments').insert([{
      post_id: selectedPost.id,
      user_id: session.user.id,
      content: commentText.trim(),
      date:    formatDate(),
    }]).select().single()
    if (error) { alert('댓글 저장 실패: ' + error.message); return }
    setComments(prev => [...prev, data])
    setCommentText('')
    setCommentCounts(prev => ({ ...prev, [selectedPost.id]: (prev[selectedPost.id]||0)+1 }))
  }
  async function handleDeleteComment(comment) {
    if (session?.user?.id !== comment.user_id) return
    if (!confirm('댓글을 삭제할까요?')) return
    const { error } = await supabase.from('v4_comments').delete().eq('id', comment.id)
    if (error) { alert('삭제 실패: ' + error.message); return }
    setComments(prev => prev.filter(c => c.id !== comment.id))
    if (selectedPost) {
      setCommentCounts(prev => ({ ...prev, [selectedPost.id]: Math.max(0,(prev[selectedPost.id]||0)-1) }))
    }
  }

  // ── 글 쓰기
  function handleForm(field, val) { setForm(prev => ({ ...prev, [field]: val })) }
  function handleTypeChange(type) {
    setForm(prev => ({ ...prev, type, imageData:'', videoUrl:'' }))
    setImgPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }
  function handleImgFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3*1024*1024) { setFormErr('이미지는 3MB 이하만 가능합니다.'); return }
    setFormErr('')
    const reader = new FileReader()
    reader.onload = ev => { setImgPreview(ev.target.result); setForm(prev => ({ ...prev, imageData: ev.target.result })) }
    reader.readAsDataURL(file)
  }
  async function handleSubmit() {
    if (!session) { openAuth('login'); return }
    if (!form.title.trim())                             { setFormErr('제목을 입력해주세요.'); return }
    if (!form.content.trim())                           { setFormErr('내용을 입력해주세요.'); return }
    if (form.type === 'image' && !form.imageData)       { setFormErr('이미지를 업로드해주세요.'); return }
    if (form.type === 'video' && !form.videoUrl.trim()) { setFormErr('동영상 URL을 입력해주세요.'); return }

    setSubmitting(true)
    const { data, error } = await supabase.from('v4_board_posts').insert([{
      title:      form.title.trim(),
      content:    form.content.trim(),
      category:   form.category,
      type:       form.type,
      image_data: form.imageData || null,
      video_url:  form.videoUrl.trim() || null,
      views: 0, likes: 0, dislikes: 0,
      date:       formatDate(),
      user_id:    session.user.id,
    }]).select().single()
    setSubmitting(false)
    if (error) { setFormErr('저장 중 오류: ' + error.message); return }
    setDbPosts(prev => [data, ...prev])
    setForm(EMPTY_FORM); setImgPreview(''); setFormErr(''); setShowWrite(false)
  }

  // ── 게시글 수정
  async function handleEditRequest(post, e) {
    e.stopPropagation()
    if (session?.user?.id !== post.user_id) return
    setEditingPost(post)
    setEditForm({
      title:     post.title,
      category:  post.category,
      type:      post.type,
      imageData: post.image_data || '',
      videoUrl:  post.video_url  || '',
      content:   post.content,
    })
    setImgPreview(post.image_data || '')
    setFormErr('')
  }
  function handleEditForm(field, val) { setEditForm(prev => ({ ...prev, [field]: val })) }
  function handleEditTypeChange(type) {
    setEditForm(prev => ({ ...prev, type, imageData:'', videoUrl:'' }))
    setImgPreview('')
    if (editFileRef.current) editFileRef.current.value = ''
  }
  function handleEditImgFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3*1024*1024) { setFormErr('이미지는 3MB 이하만 가능합니다.'); return }
    setFormErr('')
    const reader = new FileReader()
    reader.onload = ev => { setImgPreview(ev.target.result); setEditForm(prev => ({ ...prev, imageData: ev.target.result })) }
    reader.readAsDataURL(file)
  }
  async function handleEditSubmit() {
    if (!editForm.title.trim())                              { setFormErr('제목을 입력해주세요.'); return }
    if (!editForm.content.trim())                            { setFormErr('내용을 입력해주세요.'); return }
    if (editForm.type === 'image' && !editForm.imageData)   { setFormErr('이미지를 업로드해주세요.'); return }
    if (editForm.type === 'video' && !editForm.videoUrl.trim()) { setFormErr('동영상 URL을 입력해주세요.'); return }

    setSubmitting(true)
    const { data, error } = await supabase.from('v4_board_posts').update({
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

  // ── 게시글 삭제
  async function handleDeleteRequest(id, e) {
    e.stopPropagation()
    const post = dbPosts.find(p => p.id === id)
    if (!post || session?.user?.id !== post.user_id) return
    if (!confirm('게시글을 삭제할까요?')) return
    const { error } = await supabase.from('v4_board_posts').delete().eq('id', id)
    if (error) { alert('삭제 실패: ' + error.message); return }
    setDbPosts(prev => prev.filter(p => p.id !== id))
    if (selectedPost?.id === id) setSelectedPost(null)
  }

  function closeWrite() {
    setShowWrite(false)
    setForm(EMPTY_FORM); setStudyForm(EMPTY_STUDY_FORM)
    setImgPreview(''); setFormErr('')
    if (fileRef.current)  fileRef.current.value = ''
    if (fileRef2.current) fileRef2.current.value = ''
  }

  // ── Study Board 핸들러
  function handleStudyForm(field, val) { setStudyForm(prev => ({ ...prev, [field]: val })) }
  function handleStudyTypeChange(type) {
    setStudyForm(prev => ({ ...prev, type, imageData:'', videoUrl:'' }))
    setImgPreview('')
    if (fileRef2.current) fileRef2.current.value = ''
  }
  function handleStudyImgFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3*1024*1024) { setFormErr('이미지는 3MB 이하만 가능합니다.'); return }
    setFormErr('')
    const reader = new FileReader()
    reader.onload = ev => { setImgPreview(ev.target.result); setStudyForm(prev => ({ ...prev, imageData: ev.target.result })) }
    reader.readAsDataURL(file)
  }
  async function handleStudySubmit() {
    if (!session) { closeWrite(); openAuth('login'); return }
    if (session.user.email !== OWNER_EMAIL) { setFormErr('Study Board는 관리자만 작성할 수 있습니다.'); return }
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

  const isOwner = (post) => session?.user?.id && session.user.id === post.user_id

  // ── 렌더 ─────────────────────────────────────────────────────────
  return (
    <div className="portfolio v4">

      {/* Nav */}
      <nav className="nav">
        <div className="nav-left">
          <span className="nav-name">심하윤</span>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#awards">Awards</a>
          <a href="#board">Board</a>
          <a href="#contact">Contact</a>
          {session ? (
            <div className="auth-nav">
              <span className="auth-email">{shortEmail(session.user.email)}</span>
              <button className="auth-logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>
          ) : (
            <button className="auth-login-btn" onClick={() => openAuth('login')}>로그인</button>
          )}
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
          {contributions && (
            <div className="contrib-wrap">
              <div className="contrib-header">
                <span className="contrib-title">GitHub Contributions</span>
                <span className="contrib-total">{contributions.totalContributions.toLocaleString()} contributions in the last year</span>
              </div>
              <div className="contrib-graph">
                {contributions.weeks.map((week, wi) => (
                  <div key={wi} className="contrib-col">
                    {week.contributionDays.map(day => (
                      <div
                        key={day.date}
                        className="contrib-cell"
                        style={{ background: day.color }}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="contrib-legend">
                <span>Less</span>
                {['#161b22','#0e4429','#006d32','#26a641','#39d353'].map(c => (
                  <span key={c} className="contrib-cell" style={{ background: c }} />
                ))}
                <span>More</span>
              </div>
            </div>
          )}

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
        {(solvedData || solvedTags.length > 0) && (
          <div className="solved-section">
            {solvedData && (
              <div className="solved-widget">
                <div className="solved-left">
                  <img
                    src={`https://static.solved.ac/tier_small/${solvedData.tier}.svg`}
                    alt={`tier ${solvedData.tier}`}
                    className="solved-tier-img"
                  />
                  <div>
                    <div className="solved-handle">{solvedData.handle}</div>
                    <div className="solved-sub">Baekjoon / solved.ac</div>
                  </div>
                </div>
                <div className="solved-stats">
                  <div className="solved-stat"><span className="solved-num">{solvedData.solvedCount?.toLocaleString()}</span><span className="solved-label">해결한 문제</span></div>
                  <div className="solved-stat"><span className="solved-num">{solvedData.rating?.toLocaleString()}</span><span className="solved-label">레이팅</span></div>
                  <div className="solved-stat"><span className="solved-num">{solvedData.rank?.toLocaleString()}</span><span className="solved-label">전체 랭킹</span></div>
                </div>
              </div>
            )}
            {solvedTags.length > 0 && (() => {
              const max = solvedTags[0].solved
              return (
                <div className="tag-chart">
                  <div className="tag-chart-title">유형별 해결 문제</div>
                  {solvedTags.map(t => (
                    <div key={t.name} className="tag-bar-row">
                      <span className="tag-bar-label">{t.name}</span>
                      <div className="tag-bar-track">
                        <div className="tag-bar-fill" style={{ width: `${(t.solved / max) * 100}%` }} />
                      </div>
                      <span className="tag-bar-count">{t.solved}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        )}
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

        {githubRepos.length > 0 && (
          <>
            <h4 className="gh-section-title">
              <svg className="gh-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              GitHub Repositories
            </h4>
            <div className="gh-grid">
              {githubRepos.map(repo => (
                <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer" className="gh-card">
                  <div className="gh-card-top">
                    <span className="gh-repo-name">{repo.name}</span>
                  </div>
                  <p className="gh-desc">{repo.description || '설명 없음'}</p>
                  <div className="gh-footer">
                    {repo.primaryLanguage && (
                      <span className="gh-lang">
                        <span className="gh-lang-dot" style={{ background: repo.primaryLanguage.color || '#888' }} />
                        {repo.primaryLanguage.name}
                      </span>
                    )}
                    {repo.stargazerCount > 0 && <span className="gh-stat">⭐ {repo.stargazerCount}</span>}
                    {repo.forkCount > 0 && <span className="gh-stat">🍴 {repo.forkCount}</span>}
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
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

      {/* ── Board ─────────────────────────────────────────────────── */}
      <section id="board" className="section">
        <div className="board-header-row">
          <h3 className="section-title" style={{ marginBottom:0, borderBottom:'none' }}>Board</h3>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            {!session && (
              <span className="board-login-notice">
                <button onClick={() => openAuth('login')}>로그인</button>하면 글을 작성할 수 있어요.
              </span>
            )}
            {(boardMode !== 'study' || session?.user?.email === OWNER_EMAIL) && (
              <button className="write-btn" onClick={() => session ? setShowWrite(true) : openAuth('login')}>
                + 글 쓰기
              </button>
            )}
          </div>
        </div>

        {/* 모드 전환 탭 */}
        <div className="board-mode-tabs">
          <button className={`board-mode-tab${boardMode === 'community' ? ' active' : ''}`}
            onClick={() => setBoardMode('community')}>💬 게시판</button>
          <button className={`board-mode-tab${boardMode === 'study' ? ' active' : ''}`}
            onClick={() => setBoardMode('study')}>📚 Study Board</button>
        </div>

        {/* ── 커뮤니티 게시판 ── */}
        {boardMode === 'community' && (() => {
          return (
            <>
              <p className="board-subtitle">로그인 후 자유롭게 글을 작성하고 소통하는 공간입니다.</p>
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
                      {isOwner(post) && (
                        <span className="blist-actions">
                          <button className="blist-edit-btn" onClick={e => handleEditRequest(post, e)} title="수정">✏</button>
                          <button className="blist-del-btn"  onClick={e => handleDeleteRequest(post.id, e)} title="삭제">✕</button>
                        </span>
                      )}
                    </span>
                    <span className="blist-col-stat blist-likes">
                      {(post.likes||0) > 0 && <span className="blist-likes-hot">{post.likes}</span>}
                    </span>
                    <span className="blist-col-stat blist-views">{(post.views||0) > 0 ? post.views : ''}</span>
                    <span className="blist-col-date blist-date">{formatShortDate(post.date)}</span>
                  </div>
                ))}
              </div>
            </>
          )
        })()}

        {/* ── Study Board ── */}
        {boardMode === 'study' && (() => {
          const filteredStudy = studyCat === "전체" ? studyDbPosts : studyDbPosts.filter(p => p.category === studyCat)
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
                        {post.userCreated && session?.user?.email === OWNER_EMAIL && (
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

      <footer className="footer">© 2026 심하윤. All rights reserved. — v4</footer>

      {/* ── 게시글 상세 모달 ── */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal post-modal" onClick={e => e.stopPropagation()}>
            <div className="post-modal-header">
              <span className="blist-cat-badge">{selectedPost.category}</span>
              <div className="post-modal-header-actions">
                {isOwner(selectedPost) && (<>
                  <button className="post-modal-edit-btn" onClick={e => handleEditRequest(selectedPost, e)}>✏ 수정</button>
                  <button className="post-modal-del-btn"  onClick={e => handleDeleteRequest(selectedPost.id, e)}>🗑 삭제</button>
                </>)}
                <button className="modal-close" onClick={() => setSelectedPost(null)}>✕</button>
              </div>
            </div>
            <h2 className="post-modal-title">{selectedPost.title}</h2>
            <div className="post-modal-meta">
              {(selectedPost.views||0) > 0 && <span>조회 {selectedPost.views}</span>}
              <span>{selectedPost.date}</span>
            </div>
            <div className="post-modal-divider" />

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
                👍 추천 {(selectedPost.likes||0) > 0 && <span className="vote-count">{selectedPost.likes}</span>}
              </button>
              <button
                className={`vote-btn vote-dislike${votes[selectedPost.id] === 'dislike' ? ' voted' : ''}`}
                onClick={() => handleVote(selectedPost.id, 'dislike')}
              >
                👎 비추천 {(selectedPost.dislikes||0) > 0 && <span className="vote-count">{selectedPost.dislikes}</span>}
              </button>
            </div>

            {/* 댓글 */}
            <div className="post-comments">
              <h4 className="comments-title">
                💬 댓글{comments.length > 0 ? ` (${comments.length})` : ''}
              </h4>
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
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                          <span className="comment-author">{shortEmail(c.email || '')}</span>
                          <span className="comment-date">{c.date}</span>
                        </div>
                        {session?.user?.id === c.user_id && (
                          <button className="comment-del-btn" onClick={() => handleDeleteComment(c)}>삭제</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {session ? (
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
                    <button className="comment-submit-btn" onClick={handleAddComment}>등록</button>
                  </div>
                </div>
              ) : (
                <p className="comment-login-notice">
                  <button onClick={() => openAuth('login')}>로그인</button>하면 댓글을 작성할 수 있습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Study Board 상세 모달 ── */}
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

      {/* ── 글 쓰기 모달 ── */}
      {showWrite && (
        <div className="modal-overlay" onClick={closeWrite}>
          <div className="modal write-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="write-modal-title">
                {boardMode === 'study' ? '📚 학습 노트 작성' : '💬 새 글 작성'}
              </h2>
              <button className="modal-close" onClick={closeWrite}>✕</button>
            </div>

            {/* 게시판 폼 */}
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
            </>)}

            {/* Study Board 폼 */}
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

      {/* ── 게시글 수정 모달 ── */}
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

      {/* ── 로그인 / 회원가입 모달 ── */}
      {authModal && (
        <div className="modal-overlay auth-overlay" onClick={closeAuth}>
          <div className="modal auth-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" style={{ position:'absolute', top:'20px', right:'24px' }} onClick={closeAuth}>✕</button>
            <div className="auth-modal-logo">🔐</div>
            <h2 className="auth-modal-title">심하윤 포트폴리오</h2>
            <p className="auth-modal-subtitle">로그인하면 게시글과 댓글을 작성할 수 있습니다.</p>

            <div className="auth-tabs">
              <button className={`auth-tab${authTab === 'login' ? ' active' : ''}`}
                onClick={() => { setAuthTab('login'); setAuthErr(''); setAuthSuccess('') }}>로그인</button>
              <button className={`auth-tab${authTab === 'signup' ? ' active' : ''}`}
                onClick={() => { setAuthTab('signup'); setAuthErr(''); setAuthSuccess('') }}>회원가입</button>
            </div>

            {authSuccess && <p className="auth-success">{authSuccess}</p>}

            <div className="form-group">
              <label className="form-label">이메일</label>
              <input className="form-input" type="email" placeholder="example@email.com"
                value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (authTab === 'login' ? handleLogin() : handleSignup())}
                autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">비밀번호</label>
              <input className="form-input" type="password" placeholder="6자 이상"
                value={authPwd} onChange={e => setAuthPwd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (authTab === 'login' ? handleLogin() : handleSignup())} />
            </div>
            {authTab === 'signup' && (
              <div className="form-group">
                <label className="form-label">비밀번호 확인</label>
                <input className="form-input" type="password" placeholder="비밀번호를 다시 입력하세요"
                  value={authPwdConfirm} onChange={e => setAuthPwdConfirm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()} />
              </div>
            )}

            {authErr && <p className="form-error">{authErr}</p>}

            <div className="form-actions" style={{ marginTop:'8px', paddingTop:'16px' }}>
              <button className="form-cancel" onClick={closeAuth} disabled={authLoading}>취소</button>
              <button className="form-submit"
                onClick={authTab === 'login' ? handleLogin : handleSignup}
                disabled={authLoading}>
                {authLoading ? '처리 중...' : authTab === 'login' ? '로그인' : '회원가입'}
              </button>
            </div>

            <div className="auth-footer">
              {authTab === 'login'
                ? <>계정이 없으신가요? <button onClick={() => { setAuthTab('signup'); setAuthErr(''); setAuthSuccess('') }}>회원가입</button></>
                : <>이미 계정이 있으신가요? <button onClick={() => { setAuthTab('login'); setAuthErr(''); setAuthSuccess('') }}>로그인</button></>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
