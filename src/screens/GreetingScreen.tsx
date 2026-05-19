import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotWai, HeartLogo } from '../components/Illustrations'
import { StatusBar, C } from '../components/SharedUI'

function Typewriter({ text, speed = 80 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) return
    const t = setTimeout(() => setN(n + 1), speed)
    return () => clearTimeout(t)
  }, [n, text, speed])
  return <span>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 1 : 0 }}>|</span></span>
}

export default function GreetingScreen() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)

  const skip = () => navigate('/landing')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => setPhase(3), 3000)
    const t4 = setTimeout(() => navigate('/landing'), 3500)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [navigate])

  return (
    <MobileFrame>
      <style>{`
        @keyframes fade-out-screen { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
      <div
        onClick={skip}
        style={{
          width: '100%',
          minHeight: '100dvh',
          background: C.cream,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          opacity: phase === 3 ? 0 : 1,
          transition: 'opacity .5s ease',
        }}
      >
        {/* Thai geometric pattern */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="ripple-ring" style={{ animationDelay: '0s' }} />
          <div className="ripple-ring" style={{ animationDelay: '0.8s' }} />
          <div className="ripple-ring" style={{ animationDelay: '1.6s' }} />
          <svg viewBox="0 0 390 844" width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
            <defs>
              <pattern id="thaipat" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 4 L36 20 L20 36 L4 20 z" fill="none" stroke={C.brown} strokeWidth="1" />
                <circle cx="20" cy="20" r="2" fill={C.brown} />
              </pattern>
            </defs>
            <rect width="390" height="844" fill="url(#thaipat)" />
          </svg>
        </div>

        <StatusBar />

        {/* Center content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
            transition: 'all .7s cubic-bezier(.2,.7,.3,1)',
          }}>
            <MascotWai size={200} glow />
          </div>

          <div style={{
            marginTop: 16,
            fontFamily: '"Sarabun", system-ui',
            fontWeight: 700,
            fontSize: 32,
            color: C.brown,
            height: 44,
            lineHeight: 1,
            textAlign: 'center',
          }}>
            {phase >= 1 && <Typewriter text="สวัสดีครับ 🙏" speed={90} />}
          </div>

          <div style={{
            marginTop: 8,
            fontFamily: '"DM Sans", system-ui',
            fontSize: 11,
            color: C.brownSoft,
            letterSpacing: 1,
            textTransform: 'uppercase',
            opacity: phase >= 2 ? 1 : 0,
            transition: 'opacity .4s ease',
          }}>
            tap to skip
          </div>
        </div>

        {/* Brand mark */}
        <div style={{
          paddingBottom: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity: 0.45,
          position: 'relative',
          zIndex: 1,
        }}>
          <HeartLogo size={16} />
          <span style={{
            fontFamily: '"DM Sans", system-ui',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: 2.4,
            color: C.brown,
          }}>BEST PART · CUPID</span>
        </div>
      </div>
    </MobileFrame>
  )
}
