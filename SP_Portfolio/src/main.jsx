import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppV2 from './AppV2.jsx'
import AppV3 from './AppV3.jsx'
import AppV4 from './AppV4.jsx'

function getVersion() {
  const h = window.location.hash
  if (h.startsWith('#v4')) return 'v4'
  if (h.startsWith('#v3')) return 'v3'
  if (h.startsWith('#v2')) return 'v2'
  return 'v1'
}

function Root() {
  const [version, setVersion] = useState(getVersion)

  useEffect(() => {
    const onHashChange = () => setVersion(getVersion())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (version === 'v4') return <AppV4 />
  if (version === 'v3') return <AppV3 />
  if (version === 'v2') return <AppV2 />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
