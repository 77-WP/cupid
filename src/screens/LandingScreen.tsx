import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl, FaceHappy, FaceNeutral, FaceAlert, HeartLogo } from '../components/Illustrations'
import { StepDots, C } from '../components/SharedUI'
import { supabase } from '../lib/supabase'

const TILE_TOASTS: Record<string, string> = {
  happy: 'ขอบคุณมากเลยครับ ❤️',
  okay:  'ขอบคุณที่บอกเรานะครับ 🙏',
  bad:   'เดี๋ยวเราดูแลให้นะครับ 🙏',
}

const tiles = [
  {
    key: 'happy', face: <FaceHappy size={36} />, label: 'ชอบมาก', sub: 'บอกต่อ',
    path: '/happy',
    gradient: 'linear-gradient(145deg, #E8622A, #F5A623)',
    shadow: '0 4px 20px rgba(232,98,42,0.35)',
    labelColor: '#fff', subColor: 'rgba(255,255,255,0.8)',
  },
  {
    key: 'okay', face: <FaceNeutral size={36} />, label: 'โอเค', sub: 'แสดงความคิด',
    path: '/neutral',
    gradient: 'linear-gradient(145deg, #F5A623, #FAD060)',
    shadow: '0 4px 20px rgba(245,166,35,0.35)',
    labelColor: '#2C1A0E', subColor: 'rgba(44,26,14,0.7)',
  },
  {
    key: 'bad', face: <FaceAlert size={36} />, label: 'มีปัญหา', sub: 'แจ้งด่วน',
    path: '/problem',
    gradient: 'linear-gradient(145deg, #8B2000, #C0392B)',
    shadow: '0 4px 20px rgba(139,32,0,0.4)',
    labelColor: '#fff', subColor: 'rgba(255,255,255,0.8)',
  },
]

const socialItems = [
  { icon: '🌐', label: 'เว็บไซต์', bg: '#FAF3E8', href: 'https://bestpartbowls.com' },
  { icon: '💬', label: 'LINE',     bg: '#F0FFF0', href: '#' },
  { icon: '📘', label: 'Facebook', bg: '#EEF2FF', href: '#' },
  { icon: '🎵', label: 'TikTok',   bg: '#F5F5F5', href: '#' },
  { icon: '📍', label: 'แผนที่',  bg: '#FFF8EE', href: '#' },
]

export default function LandingScreen() {
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)

  useEffect(() => {
    supabase.from('cupid_feedback').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count != null) setFeedbackCount(count)
    })
  }, [])

  const handleTileTap = (key: string, path: string) => {
    setToast(TILE_TOASTS[key])
    setTimeout(() => {
      setToast(null)
      navigate(path)
    }, 900)
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, 8px) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, 0)   scale(1); }
        }
      `}</style>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%',
          transform: 'translateX(-50%)',
          background: C.orange, color: '#fff',
          padding: '12px 22px', borderRadius: 999,
          fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15,
          boxShadow: '0 8px 24px rgba(232,98,42,0.4)',
          zIndex: 100, whiteSpace: 'nowrap',
          animation: 'toast-in 0.25s ease forwards',
        }}>
          {toast}
        </div>
      )}

      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HeartLogo size={18} />
            <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 13, letterSpacing: 2.4, color: C.brown }}>BEST PART</span>
          </div>
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 0.6, textTransform: 'uppercase' }}>cupid</div>
        </div>

        {/* Character + Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
          <div className="mascot-float"><MascotBowl size={148} mood="happy" wave /></div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 22, color: C.brown, marginTop: 6, textAlign: 'center', lineHeight: 1.25, padding: '0 28px' }}>
            วันนี้เป็นยังไงบ้างครับ?
          </div>
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 4, letterSpacing: 0.3 }}>ใช้เวลา 30 วินาที</div>
        </div>

        {/* Mood tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '18px 16px 0' }}>
          {tiles.map((t) => (
            <button
              key={t.key}
              onMouseEnter={() => setHover(t.key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleTileTap(t.key, t.path)}
              style={{
                borderRadius: 20,
                padding: '18px 8px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer',
                border: 'none',
                background: t.gradient,
                boxShadow: t.shadow,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                transform: hover === t.key ? 'scale(0.97)' : 'scale(1)',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                {t.face}
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: t.labelColor }}>{t.label}</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: t.subColor, marginTop: 2 }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* Vision link */}
        <div style={{ textAlign: 'center', paddingTop: 14 }}>
          <button
            onClick={() => navigate('/founder')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            วิสัยทัศน์ของเรา <span style={{ color: C.orange }}>→</span>
          </button>
        </div>

        {/* Features section */}
        <div style={{ marginTop: 20, padding: '0 16px' }}>

          {/* Feature cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

            {/* Card A1 — เหมือนฝัน Mode */}
            <button
              onClick={() => navigate('/joe-mode')}
              style={{
                background: '#2C1A0E',
                borderRadius: 20,
                padding: '18px 14px',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 16px rgba(44,26,14,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 28 }}>✨</span>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#fff', marginTop: 8 }}>เหมือนฝัน</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginTop: 4 }}>
                ดูว่า Best Part<br />พัฒนาอะไรไปแล้ว
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: '#F5A623', marginTop: 10 }}>ดูเลย →</div>
            </button>

            {/* Card A2 — Founder Vision */}
            <button
              onClick={() => navigate('/founder')}
              style={{
                background: 'linear-gradient(145deg, #E8622A, #C94E1A)',
                borderRadius: 20,
                padding: '18px 14px',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 16px rgba(232,98,42,0.3)',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 28 }}>💌</span>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#fff', marginTop: 8, lineHeight: 1.4 }}>จดหมายจากผู้ก่อตั้ง</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Wiphu เขียนถึงคุณ</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 10 }}>อ่านเลย →</div>
            </button>
          </div>

          {/* Social contact row */}
          <div style={{
            marginTop: 14,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 8px',
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(44,26,14,0.08)',
          }}>
            {socialItems.map((item) => (
              <button
                key={item.label}
                onClick={() => window.open(item.href, '_blank')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 4px' }}
              >
                <div style={{ width: 40, height: 40, background: item.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {item.icon}
                </div>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: '#6B4C2A' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: '0 20px 8px' }}><StepDots step={1} /></div>

        {/* Order CTA */}
        <div style={{ padding: '0 16px 8px' }}>
          <a
            href="https://bestpartbowls.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', width: '100%', padding: '11px 0',
              borderRadius: 10, textAlign: 'center',
              border: `1.5px solid ${C.orange}`, color: C.orange,
              fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
              textDecoration: 'none', boxSizing: 'border-box',
            }}
          >
            🍚 ดูเมนูและสั่งอาหาร →
          </a>
        </div>

        {/* Social proof */}
        <div style={{ padding: '6px 16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {[C.orange, C.amber, '#D9482A', C.brownSoft].map((c, i) => (
              <div key={i} style={{
                width: 22, height: 22, borderRadius: 11,
                background: c, border: '2px solid rgba(245,237,216,1)',
                marginLeft: i === 0 ? 0 : -7, zIndex: 4 - i,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontFamily: '"DM Sans", system-ui',
                fontWeight: 700, fontSize: 8,
              }}>
                {['ป', 'น', 'ต', '+'][i]}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>
            {feedbackCount != null
              ? <><span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, color: C.brown }}>{feedbackCount.toLocaleString()}</span> คนให้กำลังใจทีมงานเราเดือนนี้ ❤︎</>
              : <span style={{ color: 'rgba(44,26,14,0.35)' }}>คนให้กำลังใจทีมงานเราเดือนนี้ ❤︎</span>
            }
          </div>
        </div>

      </div>
    </MobileFrame>
  )
}
