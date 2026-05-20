import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotWai, HeartLogo } from '../components/Illustrations'
import { StatusBar, C } from '../components/SharedUI'

function getTimeGreeting(): { main: string; sub: string } {
  const h = new Date().getHours()
  if (h >= 5 && h < 11)  return { main: 'สวัสดีตอนเช้าครับ ☀️',  sub: 'ขอให้วันนี้อร่อยนะครับ' }
  if (h >= 11 && h < 14) return { main: 'สวัสดีมื้อเที่ยงครับ 🍜', sub: 'มื้อเที่ยงนี้เป็นยังไงบ้างครับ?' }
  if (h >= 14 && h < 18) return { main: 'สวัสดีตอนบ่ายครับ 🌤️',  sub: 'หิวยังครับ?' }
  if (h >= 18 && h < 22) return { main: 'สวัสดีตอนเย็นครับ 🌅',  sub: 'เหนื่อยมาทั้งวัน ขอบคุณที่แวะนะครับ 🙏' }
  return { main: 'สวัสดีตอนดึกครับ 🌙', sub: 'ดึกแล้วยังกินอยู่เลยครับ 😄' }
}

function Typewriter({ text, speed = 80 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
  }, [text])
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

  const nickname = localStorage.getItem('cupid_nickname')
  const { main, sub } = nickname
    ? { main: `สวัสดีครับ คุณ${nickname} 👋`, sub: 'กลับมาอีกแล้วครับ ดีใจมากเลย ❤️' }
    : getTimeGreeting()

  const skip = () => navigate('/landing')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 2400)
    const t3 = setTimeout(() => setPhase(3), 3200)
    const t4 = setTimeout(() => navigate('/landing'), 3700)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [navigate])

  return (
    <MobileFrame>
      <div
        onClick={skip}
        style={{
          width: '100%', minHeight: '100dvh', background: C.cream,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', cursor: 'pointer', overflow: 'hidden',
          opacity: phase === 3 ? 0 : 1, transition: 'opacity .5s ease',
        }}
      >
        {/* Thai geometric pattern + ripples */}
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)', transition: 'all .7s cubic-bezier(.2,.7,.3,1)' }}>
            <MascotWai size={200} glow />
          </div>

          <div style={{ marginTop: 16, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 30, color: C.brown, lineHeight: 1.1, textAlign: 'center', minHeight: 44 }}>
            {phase >= 1 && <Typewriter text={main} speed={80} />}
          </div>

          <div style={{ marginTop: 8, fontFamily: '"Sarabun", system-ui', fontSize: 15, color: C.brownSoft, textAlign: 'center', opacity: phase >= 2 ? 1 : 0, transition: 'opacity .5s ease' }}>
            {sub}
          </div>

          <div style={{ marginTop: 12, fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase', opacity: phase >= 2 ? 0.6 : 0, transition: 'opacity .4s ease' }}>
            tap to skip
          </div>
        </div>

        {/* Brand mark */}
        <div style={{ paddingBottom: 56, display: 'flex', alignItems: 'center', gap: 8, opacity: 0.45, position: 'relative', zIndex: 1 }}>
          <HeartLogo size={16} />
          <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 11, letterSpacing: 2.4, color: C.brown }}>BEST PART · CUPID</span>
        </div>
      </div>
    </MobileFrame>
  )
}
