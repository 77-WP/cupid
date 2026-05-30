import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import NumCharacter from '../components/NumCharacter'

export default function ProblemClosingScreen() {
  const navigate = useNavigate()
  const [showButton, setShowButton] = useState(false)
  const [ticketNum] = useState(() => Math.floor(1000 + Math.random() * 9000))
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
          50%      { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes checkPop {
          0%   { transform: translateX(-50%) scale(0.4); opacity:0; }
          65%  { transform: translateX(-50%) scale(1.12); }
          100% { transform: translateX(-50%) scale(1);   opacity:1; }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0;  }
        }
      `}</style>

      <div style={{
        background: '#FAF3E8', minHeight: '100dvh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <div style={{ flex: 1 }} />

        {/* ── CHARACTER + BADGE ── */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ animation: 'floatChar 3s ease-in-out infinite' }}>
            <NumCharacter pose="promising" size={160} />
          </div>

          {/* Big green checkmark badge overlapping bottom-center */}
          <div style={{
            position: 'absolute', bottom: 10, left: '50%',
            transform: 'translateX(-50%)',
            width: 48, height: 48, borderRadius: '50%',
            background: '#22C55E',
            border: '3px solid #FAF3E8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12L9.5 16.5L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset="60"
                style={{ animation: 'checkDraw 0.4s ease-out 0.65s both' }}
              />
            </svg>
          </div>
        </div>

        {/* ── TITLE ── */}
        <div style={{
          fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 28, color: '#2C1A0E',
          marginTop: 28,
          animation: 'fadeUp 0.4s ease-out 0.2s both',
        }}>
          รับเรื่องแล้วครับ 🙏
        </div>

        {/* ── SUBTITLE (time-aware) ── */}
        <div style={{
          marginTop: 8, padding: '0 36px',
          fontFamily: '"Sarabun", system-ui', fontSize: 15, color: 'rgba(44,26,14,0.6)', lineHeight: 1.7,
          animation: 'fadeUp 0.4s ease-out 0.3s both',
        }}>
          {isNightTime
            ? 'ทีมงานจะติดต่อกลับพรุ่งนี้เช้าครับ'
            : 'ทีมงานจะติดต่อกลับใน 2 ชั่วโมงครับ'}
        </div>

        {/* ── TICKET NUMBER ── */}
        <div style={{
          marginTop: 10,
          fontFamily: '"DM Sans", system-ui', fontSize: 12,
          color: 'rgba(44,26,14,0.28)', letterSpacing: '0.12em',
          animation: 'fadeUp 0.4s ease-out 0.45s both',
        }}>
          #BP-{ticketNum}
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 1.5, background: 'rgba(44,26,14,0.1)', margin: '22px auto 0' }} />

        {/* ── CLOSING NOTE ── */}
        <div style={{ marginTop: 16, padding: '0 32px', animation: 'fadeUp 0.4s ease-out 0.6s both' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E' }}>
            ขอบคุณที่บอกเรานะครับ 🙏
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.45)', marginTop: 6 }}>
            ทำให้เราได้แก้ไขและทำให้ดีขึ้นครับ
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* ── BUTTON (fades in after 2s) ── */}
        <div style={{ padding: '0 20px 36px', width: '100%', boxSizing: 'border-box' }}>
          {!showButton ? (
            <div style={{ height: 52 }} />
          ) : (
            <button
              onClick={() => navigate('/landing')}
              style={{
                animation: 'fadeUp 0.3s ease-out',
                width: '100%', padding: 14, borderRadius: 50,
                background: 'transparent',
                border: '1.5px solid rgba(44,26,14,0.15)',
                color: 'rgba(44,26,14,0.5)',
                fontFamily: '"Sarabun", system-ui', fontSize: 14,
                cursor: 'pointer',
              }}
            >
              กลับหน้าแรกครับ
            </button>
          )}
        </div>
      </div>
    </MobileFrame>
  )
}
