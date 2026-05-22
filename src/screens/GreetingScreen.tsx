import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotWai, HeartLogo } from '../components/Illustrations'
import { C } from '../components/SharedUI'

function getTimeGreeting(): { main: string; sub: string } {
  const h = new Date().getHours()
  if (h >= 5 && h < 11)  return { main: 'สวัสดีตอนเช้าครับ ☀️',  sub: 'หิวยังครับ?' }
  if (h >= 11 && h < 14) return { main: 'สวัสดีมื้อเที่ยงครับ 🍜', sub: 'หิวยังครับ?' }
  if (h >= 14 && h < 18) return { main: 'สวัสดีตอนบ่ายครับ 🌤️',  sub: 'หิวยังครับ?' }
  if (h >= 18 && h < 22) return { main: 'สวัสดีตอนเย็นครับ 🌅',  sub: 'หิวยังครับ?' }
  return { main: 'สวัสดีตอนดึกครับ 🌙', sub: 'หิวยังครับ?' }
}

export default function GreetingScreen() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)

  const { main, sub } = getTimeGreeting()
  const skip = () => navigate('/landing')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 2600)
    const t3 = setTimeout(() => setPhase(3), 5000)
    const t4 = setTimeout(() => navigate('/landing'), 5500)
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
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.18); opacity: 0.9; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
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
        {/* Center content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', position: 'relative', zIndex: 1,
          padding: '0 32px',
        }}>

          {/* Character with glow + float */}
          <div style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
            transition: 'all .7s cubic-bezier(.2,.7,.3,1)',
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 8,
          }}>
            {/* Glow orb */}
            <div style={{
              position: 'absolute',
              width: 220, height: 220, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(248,166,60,0.22) 0%, transparent 70%)',
              animation: 'glowPulse 3s ease-in-out infinite',
            }} />
            {/* Floating character */}
            <div style={{ animation: 'gentleFloat 3s ease-in-out infinite', position: 'relative' }}>
              <MascotWai size={200} glow />
            </div>
          </div>

          {/* Section A — Greeting */}
          <div style={{
            textAlign: 'center', marginBottom: 20,
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity .5s ease',
          }}>
            <div style={{
              fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22,
              color: '#2C1A0E', lineHeight: 1.3,
            }}>
              {main}
            </div>
            <div style={{
              fontFamily: '"Sarabun", system-ui', fontSize: 16,
              color: '#6B4C2A', marginTop: 4,
            }}>
              {sub}
            </div>
          </div>

          {/* Section B — Cupid intro */}
          <div style={{
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-out 0.6s both',
          }}>
            <div style={{
              fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 15,
              color: '#2C1A0E', lineHeight: 1.7,
            }}>
              Best Part เติบโตได้เพราะคุณครับ
            </div>
            <div style={{
              fontFamily: '"Sarabun", system-ui', fontSize: 14,
              color: '#6B4C2A', lineHeight: 1.7,
            }}>
              Cupid คือช่องทางที่เชื่อมเราเข้าหากัน
            </div>
            <div style={{
              fontFamily: '"Sarabun", system-ui', fontSize: 14,
              color: '#6B4C2A', lineHeight: 1.7,
            }}>
              บอกเราได้เลยว่าวันนี้เป็นยังไง 🙏
            </div>
          </div>

          {/* Tap to skip */}
          <div style={{
            marginTop: 24,
            fontFamily: '"DM Sans", system-ui', fontSize: 11,
            color: '#6B4C2A', letterSpacing: 1, textTransform: 'uppercase',
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
