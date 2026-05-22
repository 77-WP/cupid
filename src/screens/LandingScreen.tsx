import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl, HeartLogo } from '../components/Illustrations'
import { C } from '../components/SharedUI'
import { supabase } from '../lib/supabase'

const TILE_TOASTS: Record<string, string> = {
  happy: 'ขอบคุณมากเลยครับ ❤️',
  okay:  'ขอบคุณที่บอกเรานะครับ 🙏',
  bad:   'เดี๋ยวเราดูแลให้นะครับ 🙏',
}

const CARD_SHADOW = '0 1px 4px rgba(44,26,14,0.07), 0 3px 12px rgba(44,26,14,0.05)'
const CARD_BORDER = '1.5px solid rgba(44,26,14,0.06)'

const tiles = [
  { key: 'happy', label: 'ชอบมาก',  sub: 'บอกต่อ',        path: '/happy'   },
  { key: 'okay',  label: 'โอเค',    sub: 'แสดงความคิด',   path: '/neutral' },
  { key: 'bad',   label: 'มีปัญหา', sub: 'แจ้งด่วน',      path: '/problem' },
]

const socialItems = [
  { key: 'W', href: 'https://bestpartbowls.com' },
  { key: 'L', href: '#' },
  { key: 'F', href: '#' },
  { key: 'T', href: '#' },
  { key: 'M', href: '#' },
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
        .cta-pill:hover, .cta-pill:active {
          background: #E8622A !important;
          color: #fff !important;
        }
        .social-icon:hover, .social-icon:active {
          opacity: 1 !important;
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

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HeartLogo size={18} />
            <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 13, letterSpacing: 2.4, color: C.brown }}>BEST PART</span>
          </div>
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 0.6, textTransform: 'uppercase' }}>cupid</div>
        </div>

        {/* ── CHARACTER + HEADING ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
          <div className="mascot-float"><MascotBowl size={148} mood="happy" wave /></div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: C.brown, marginTop: 6, textAlign: 'center', lineHeight: 1.25, padding: '0 28px' }}>
            วันนี้เป็นยังไงบ้างครับ?
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, opacity: 0.7, marginTop: 4 }}>
            ใช้เวลา 30 วินาที
          </div>
        </div>

        {/* ── MOOD CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '0 16px', marginTop: 20 }}>
          {tiles.map((t) => (
            <button
              key={t.key}
              onMouseEnter={() => setHover(t.key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleTileTap(t.key, t.path)}
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: '12px 4px 10px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                transform: hover === t.key ? 'scale(0.95)' : 'scale(1)',
                opacity: hover === t.key ? 0.8 : 1,
                fontFamily: 'inherit',
              }}
            >
              {/* Illustration placeholder */}
              <div style={{
                width: 72, height: 72, borderRadius: 14,
                background: 'rgba(44,26,14,0.06)',
                border: '1.5px dashed rgba(44,26,14,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: '"DM Sans", system-ui', fontSize: 18, color: 'rgba(44,26,14,0.2)', lineHeight: 1 }}>+</span>
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, marginTop: 8, textAlign: 'center' }}>
                {t.label}
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, opacity: 0.65, marginTop: 3, textAlign: 'center' }}>
                {t.sub}
              </div>
            </button>
          ))}
        </div>

        {/* ── FEATURE CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px', marginTop: 16 }}>

          {/* Card — เหมือนฝัน */}
          <button
            onClick={() => navigate('/meunfun')}
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 14px 14px',
              display: 'flex', flexDirection: 'column',
              boxShadow: CARD_SHADOW,
              border: CARD_BORDER,
              cursor: 'pointer',
              minHeight: 130,
              textAlign: 'left',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(44,26,14,0.05)',
              border: '1.5px dashed rgba(44,26,14,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 14, color: 'rgba(44,26,14,0.2)', fontFamily: '"DM Sans", system-ui', lineHeight: 1 }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, marginTop: 10 }}>
              เหมือนฝัน
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, lineHeight: 1.5, marginTop: 4 }}>
              ดูพัฒนาการของ Best Part
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: C.orange, marginTop: 'auto', paddingTop: 8 }}>
              ดูเลย →
            </div>
          </button>

          {/* Card — Founder Vision */}
          <button
            onClick={() => navigate('/founder')}
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 14px 14px',
              display: 'flex', flexDirection: 'column',
              boxShadow: CARD_SHADOW,
              border: CARD_BORDER,
              cursor: 'pointer',
              minHeight: 130,
              textAlign: 'left',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(44,26,14,0.05)',
              border: '1.5px dashed rgba(44,26,14,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 14, color: 'rgba(44,26,14,0.2)', fontFamily: '"DM Sans", system-ui', lineHeight: 1 }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, marginTop: 10, lineHeight: 1.35 }}>
              จดหมายจาก{'\n'}ผู้ก่อตั้ง
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, lineHeight: 1.5, marginTop: 4 }}>
              Wiphu เขียนถึงคุณ
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: C.orange, marginTop: 'auto', paddingTop: 8 }}>
              อ่านเลย →
            </div>
          </button>
        </div>

        {/* ── SOCIAL ROW ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, padding: '4px 0', marginTop: 14 }}>
          {socialItems.map((item) => (
            <button
              key={item.key}
              className="social-icon"
              onClick={() => window.open(item.href, '_blank')}
              style={{
                width: 36, height: 36,
                background: 'transparent',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                opacity: 0.5,
                transition: 'opacity 0.15s',
                padding: 0,
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(44,26,14,0.1)' }} />
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* ── ORDER CTA ── */}
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <a
            href="https://bestpartbowls.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-pill"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 28px',
              background: 'transparent',
              border: '1.5px solid #E8622A',
              borderRadius: 50,
              color: '#E8622A',
              fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 14,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            ดูเมนูและสั่งอาหาร →
          </a>
        </div>

        {/* ── SOCIAL PROOF ── */}
        <div style={{ padding: '16px 16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
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
