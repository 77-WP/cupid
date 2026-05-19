import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import GreetingScreen from './screens/GreetingScreen'
import LandingScreen from './screens/LandingScreen'
import HappyPath from './screens/HappyPath'
import NeutralPath from './screens/NeutralPath'
import ProblemPath from './screens/ProblemPath'
import ThanksScreen from './screens/ThanksScreen'
import QASession from './screens/QASession'
import JoeMode from './screens/JoeMode'
import FounderVision from './screens/FounderVision'
import type { Source } from './types'

const VALID_SOURCES: Source[] = ['grab', 'lineman', 'shopee', 'kiosk', 'unknown']

function SourceCapture() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const src = searchParams.get('src')
    const source: Source = (src && VALID_SOURCES.includes(src as Source))
      ? (src as Source)
      : 'unknown'
    sessionStorage.setItem('cupid_source', source)
  }, [searchParams])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <SourceCapture />
      <Routes>
        <Route path="/" element={<GreetingScreen />} />
        <Route path="/landing" element={<LandingScreen />} />
        <Route path="/happy" element={<HappyPath />} />
        <Route path="/neutral" element={<NeutralPath />} />
        <Route path="/problem" element={<ProblemPath />} />
        <Route path="/thanks" element={<ThanksScreen />} />
        <Route path="/qa" element={<QASession />} />
        <Route path="/joe-mode" element={<JoeMode />} />
        <Route path="/founder" element={<FounderVision />} />
      </Routes>
    </BrowserRouter>
  )
}
