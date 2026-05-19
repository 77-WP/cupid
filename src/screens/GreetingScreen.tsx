import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'

const FULL_TEXT = 'สวัสดีครับ 🙏'

export default function GreetingScreen() {
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [displayText, setDisplayText] = useState('')
  const [showSub, setShowSub] = useState(false)

  const goToLanding = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    navigate('/landing')
  }

  useEffect(() => {
    const chars = [...FULL_TEXT]
    let i = 0
    let typeInterval: ReturnType<typeof setInterval> | null = null
    let subTimer: ReturnType<typeof setTimeout> | null = null

    const typeDelay = setTimeout(() => {
      typeInterval = setInterval(() => {
        i++
        setDisplayText(chars.slice(0, i).join(''))
        if (i >= chars.length) {
          clearInterval(typeInterval!)
          typeInterval = null
          subTimer = setTimeout(() => setShowSub(true), 200)
        }
      }, 80)
    }, 300)

    timerRef.current = setTimeout(() => navigate('/landing'), 2500)

    return () => {
      clearTimeout(typeDelay)
      if (typeInterval) clearInterval(typeInterval)
      if (subTimer) clearTimeout(subTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [navigate])

  return (
    <MobileFrame>
      <style>{`
        @keyframes greetFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes steamPulse {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-3px); }
        }
        @keyframes fadeInSub {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .greet-mascot { animation: greetFloat 2s ease-in-out infinite; }
        .steam-1 { animation: steamPulse 1.8s ease-in-out infinite; }
        .steam-2 { animation: steamPulse 1.8s ease-in-out 0.3s infinite; }
        .steam-3 { animation: steamPulse 1.8s ease-in-out 0.6s infinite; }
        .sub-appear { animation: fadeInSub 0.5s ease-out forwards; }
      `}</style>

      <div
        onClick={goToLanding}
        style={{
          width: '100%',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 1L39 20L20 39L1 20Z' fill='none' stroke='rgba(232%2C98%2C42%2C0.07)' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='1.5' fill='rgba(232%2C98%2C42%2C0.09)'/%3E%3Ccircle cx='0' cy='0' r='1' fill='rgba(232%2C98%2C42%2C0.07)'/%3E%3Ccircle cx='40' cy='0' r='1' fill='rgba(232%2C98%2C42%2C0.07)'/%3E%3Ccircle cx='0' cy='40' r='1' fill='rgba(232%2C98%2C42%2C0.07)'/%3E%3Ccircle cx='40' cy='40' r='1' fill='rgba(232%2C98%2C42%2C0.07)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Bowl mascot */}
        <div className="greet-mascot" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          {/* Steam lines */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 20, marginBottom: 6 }}>
            <div className="steam-1" style={{ width: 3, height: 10, background: 'rgba(232,98,42,0.35)', borderRadius: 99 }} />
            <div className="steam-2" style={{ width: 3, height: 15, background: 'rgba(232,98,42,0.35)', borderRadius: 99 }} />
            <div className="steam-3" style={{ width: 3, height: 10, background: 'rgba(232,98,42,0.35)', borderRadius: 99 }} />
          </div>

          {/* Bowl circle */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid #E8622A',
            background: '#FAF3E8',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(232,98,42,0.18)',
          }}>
            {/* Rice mound */}
            <div style={{
              position: 'absolute',
              top: 8,
              left: 6,
              right: 6,
              height: 34,
              background: '#2C1A0E',
              borderRadius: '50% 50% 35% 35%',
              opacity: 0.88,
            }} />
            {/* Rice grain highlights */}
            <div style={{ position: 'absolute', top: 13, left: 18, width: 6, height: 4, borderRadius: 99, background: 'rgba(250,243,232,0.6)' }} />
            <div style={{ position: 'absolute', top: 20, left: 30, width: 5, height: 3, borderRadius: 99, background: 'rgba(250,243,232,0.5)' }} />
            <div style={{ position: 'absolute', top: 12, left: 44, width: 6, height: 4, borderRadius: 99, background: 'rgba(250,243,232,0.6)' }} />
          </div>
        </div>

        {/* Typewriter text */}
        <div style={{
          fontFamily: 'Sarabun, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#2C1A0E',
          marginBottom: 14,
          minHeight: 40,
          textAlign: 'center',
        }}>
          {displayText}
        </div>

        {/* Sub text fades in after typewriter */}
        {showSub && (
          <div className="sub-appear" style={{
            fontFamily: 'Sarabun, sans-serif',
            fontSize: 14,
            color: '#E8622A',
            letterSpacing: '2px',
          }}>
            Best Part · Cupid
          </div>
        )}

        {/* Bottom label */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          fontFamily: 'Sarabun, sans-serif',
          fontSize: 11,
          color: 'rgba(44,26,14,0.3)',
          letterSpacing: '1.5px',
        }}>
          BEST PART · CUPID
        </div>
      </div>
    </MobileFrame>
  )
}
