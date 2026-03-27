import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppV2 from './AppV2.jsx'

function Root() {
  const [version, setVersion] = useState(
    window.location.hash.startsWith('#v2') ? 'v2' : 'v1'
  )

  useEffect(() => {
    const onHashChange = () => {
      setVersion(window.location.hash.startsWith('#v2') ? 'v2' : 'v1')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return version === 'v2' ? <AppV2 /> : <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
