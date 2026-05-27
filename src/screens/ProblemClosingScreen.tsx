import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl } from '../components/Illustrations'

export default function ProblemClosingScreen() {
  const navigate = useNavigate()
  const [showButton, setShowButton] = useState(false)
  const [isNightTime] = useState(() => {
    const h = new Date().getHours()
    return h >= 22 || h < 8
  })

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <MobileFrame>
      <style>{`
        @keyframes floatChar {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes badgePop {
          0% { transform:scale(0.75); opacity:0; }
          65% { transform:scale(1.07); }
          100% { transform:scale(1); opacity:1; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <div style={{ flex: 1.2 }} />

        {/* Character with check overlay */}
        <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
          <div style={{ animation: 'floatChar 3s ease-in-out infinite' }}>
            <MascotBowl size={80} mood="happy" />
          </div>
          <div style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M3 8L6.5 11.5L13 5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray="40"
                strokeDashoffset="40"
                style={{ animation: 'checkDraw 0.4s ease-out 0.3s both' }}
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: '#2C1A0E', marginTop: 20, animation: 'fadeUp 0.4s ease-out 0.2s both' }}>
          รับเรื่องแล้วครับ 🙏
        </div>

        {/* Promise */}
        <div style={{ marginTop: 8, padding: '0 32px', fontFamily: '"Sarabun", system-ui', fontSize: 15, color: 'rgba(44,26,14,0.6)', lineHeight: 1.7, animation: 'fadeUp 0.4s ease-out 0.3s both' }}>
          {!isNightTime
            ? 'ทีมงานจะโทรหาคุณภายใน 15-20 นาทีครับ'
            : 'ทีมงานจะโทรหาคุณวันพรุ่งนี้ ภายใน 11:30 น. แน่นอนครับ'}
        </div>

        {/* Confirmation badge */}
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', borderRadius: 50, padding: '8px 18px', border: '1px solid rgba(34,197,94,0.2)', animation: 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s both', margin: '14px auto 0' }}>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#15803D' }}>✓ ส่งให้ทีมงานแล้วครับ</span>
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 1.5, background: 'rgba(44,26,14,0.1)', margin: '24px auto 0' }} />

        {/* Closing note */}
        <div style={{ marginTop: 16, padding: '0 32px', animation: 'fadeUp 0.4s ease-out 0.6s both' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E' }}>ขอบคุณที่บอกเรานะครับ 🙏</div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.45)', marginTop: 6 }}>ทำให้เราได้แก้ไขและทำให้ดีขึ้นครับ</div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Button */}
        <div style={{ padding: '0 20px 36px' }}>
          {!showButton ? (
            <div style={{ height: 52, opacity: 0 }} />
          ) : (
            <button
              onClick={() => navigate('/landing')}
              style={{ animation: 'fadeUp 0.3s ease-out', width: '100%', padding: 14, borderRadius: 50, background: 'transparent', border: '1.5px solid rgba(44,26,14,0.15)', color: 'rgba(44,26,14,0.5)', fontFamily: '"Sarabun", system-ui', fontSize: 14, cursor: 'pointer' }}
            >
              กลับหน้าแรกครับ
            </button>
          )}
        </div>
      </div>
    </MobileFrame>
  )
}
