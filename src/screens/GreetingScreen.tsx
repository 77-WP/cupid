import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotWai, HeartLogo } from '../components/Illustrations'
import { C } from '../components/SharedUI'

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
  useEffect(() => { setN(0) }, [text])
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

  const { main, sub } = getTimeGreeting()
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
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1);    opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onClick={skip}
        style={{
          width: '100%', minHeight: '100dvh',
          background: '#FAF3E8',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', cursor: 'pointer', overflow: 'hidden',
          opacity: phase === 3 ? 0 : 1, transition: 'opacity .5s ease',
        }}
      >
        {/* Warm radial glow behind character area */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 45% at 50% 42%, #FDEBD0 0%, transparent 70%)',
        }} />

        {/* Center content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', position: 'relative', zIndex: 1,
        }}>

          {/* Character + speech bubble wrapper */}
          <div style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
            transition: 'all .7s cubic-bezier(.2,.7,.3,1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>

            {/* Speech bubble */}
            <div style={{
              position: 'relative',
              background: '#fff',
              borderRadius: 16,
              border: `2px solid ${C.orange}`,
              padding: '10px 16px',
              boxShadow: '0 2px 12px rgba(232,98,42,0.15)',
              marginBottom: 18,
              alignSelf: 'flex-end',
              marginRight: 16,
              animation: 'fadeInDown 0.4s ease-out 0.3s both',
            }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown, whiteSpace: 'nowrap' }}>
                สวัสดีครับ! ผมนุ่ม 🍚
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 2, whiteSpace: 'nowrap' }}>
                ขอบคุณที่เลือก Best Part นะครับ
              </div>
              {/* Bubble tail — triangle pointing down-left */}
              <div style={{
                position: 'absolute', bottom: -10, left: 20,
                width: 0, height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `10px solid ${C.orange}`,
              }} />
              <div style={{
                position: 'absolute', bottom: -7, left: 22,
                width: 0, height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid #fff',
              }} />
            </div>

            {/* Glow orb + floating character */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Glow behind character */}
              <div style={{
                position: 'absolute',
                width: 200, height: 200, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(248,166,60,0.25) 0%, transparent 70%)',
                animation: 'glowPulse 3s ease-in-out infinite',
              }} />
              {/* Floating character */}
              <div style={{ animation: 'gentleFloat 3s ease-in-out infinite', position: 'relative' }}>
                <MascotWai size={200} glow />
              </div>
            </div>
          </div>

          {/* Greeting text */}
          <div style={{
            marginTop: 16,
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 30,
            color: C.brown, lineHeight: 1.1, textAlign: 'center', minHeight: 44,
          }}>
            {phase >= 1 && <Typewriter text={main} speed={80} />}
          </div>

          {/* Sub text */}
          <div style={{
            marginTop: 8,
            fontFamily: '"Sarabun", system-ui', fontSize: 15,
            color: C.brownSoft, textAlign: 'center',
            opacity: phase >= 2 ? 1 : 0, transition: 'opacity .5s ease',
          }}>
            {sub}
          </div>

          {/* Tap to skip */}
          <div style={{
            marginTop: 12,
            fontFamily: '"DM Sans", system-ui', fontSize: 11,
            color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase',
            opacity: phase >= 2 ? 0.6 : 0, transition: 'opacity .4s ease',
          }}>
            tap to skip
          </div>
        </div>

        {/* Brand mark */}
        <div style={{
          paddingBottom: 56,
          display: 'flex', alignItems: 'center', gap: 8,
          opacity: 0.45, position: 'relative', zIndex: 1,
        }}>
          <HeartLogo size={16} />
          <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 11, letterSpacing: 2.4, color: C.brown }}>
            BEST PART · CUPID
          </span>
        </div>
      </div>
    </MobileFrame>
  )
}
