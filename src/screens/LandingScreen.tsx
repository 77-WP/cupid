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

// Shared card shadow used across sections
const CARD_SHADOW = '0 1px 4px rgba(44,26,14,0.08), 0 4px 16px rgba(44,26,14,0.05)'
const CARD_BORDER = '1.5px solid rgba(44,26,14,0.06)'

const SECTION_LABEL: React.CSSProperties = {
  fontFamily: '"Sarabun", system-ui',
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: C.orange,
  marginBottom: 12,
}

const socialItems = [
  { letter: 'W', label: 'เว็บไซต์', href: 'https://bestpartbowls.com' },
  { letter: 'L', label: 'LINE',     href: '#' },
  { letter: 'F', label: 'Facebook', href: '#' },
  { letter: 'T', label: 'TikTok',   href: '#' },
  { letter: 'M', label: 'แผนที่',  href: '#' },
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

  const tiles = [
    {
      key: 'happy', face: <FaceHappy size={28} />, label: 'ชอบมาก', sub: 'บอกต่อ',
      path: '/happy', accentColor: '#E8622A', faceBg: 'rgba(232,98,42,0.1)',
    },
    {
      key: 'okay', face: <FaceNeutral size={28} />, label: 'โอเค', sub: 'แสดงความคิด',
      path: '/neutral', accentColor: '#F5A623', faceBg: 'rgba(245,166,35,0.1)',
    },
    {
      key: 'bad', face: <FaceAlert size={28} />, label: 'มีปัญหา', sub: 'แจ้งด่วน',
      path: '/problem', accentColor: '#8B2000', faceBg: 'rgba(139,32,0,0.1)',
    },
  ]

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
                background: '#FFFFFF',
                borderRadius: 16,
                border: CARD_BORDER,
                boxShadow: CARD_SHADOW,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                transition: 'transform 0.15s ease',
                transform: hover === t.key ? 'scale(0.97)' : 'scale(1)',
                fontFamily: 'inherit',
              }}
            >
              {/* Accent bar */}
              <div style={{ width: '100%', height: 3, background: t.accentColor, flexShrink: 0 }} />
              {/* Card body */}
              <div style={{ padding: '16px 10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: t.faceBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {t.face}
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, marginTop: 10, textAlign: 'center' }}>
                  {t.label}
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, opacity: 0.7, marginTop: 3, textAlign: 'center' }}>
                  {t.sub}
                </div>
              </div>
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

        {/* ── FEATURE CARDS ── */}
        <div style={{ padding: '0 16px', marginTop: 28 }}>
          <div style={SECTION_LABEL}>เกี่ยวกับ Cupid</div>

          {/* Card — เหมือนฝัน */}
          <button
            onClick={() => navigate('/joe-mode')}
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
              boxShadow: CARD_SHADOW,
              border: CARD_BORDER,
              marginBottom: 10,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 72, height: 72, flexShrink: 0,
              borderRadius: 12,
              background: '#F0EBE3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 9, color: '#B8A898' }}>72×72</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown }}>เหมือนฝัน</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, lineHeight: 1.5, marginTop: 3 }}>
                ดูว่า Best Part พัฒนาอะไรไปแล้วบ้าง
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.orange, marginTop: 8 }}>ดูเลย →</div>
            </div>
          </button>

          {/* Card — Founder Vision */}
          <button
            onClick={() => navigate('/founder')}
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
              boxShadow: CARD_SHADOW,
              border: CARD_BORDER,
              marginBottom: 0,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 72, height: 72, flexShrink: 0,
              borderRadius: 12,
              background: '#F0EBE3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 9, color: '#B8A898' }}>72×72</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown }}>จดหมายจากผู้ก่อตั้ง</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, lineHeight: 1.5, marginTop: 3 }}>
                Wiphu เขียนถึงคุณโดยตรง
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.orange, marginTop: 8 }}>อ่านเลย →</div>
            </div>
          </button>
        </div>

        {/* ── SOCIAL / CONTACT ROW ── */}
        <div style={{ padding: '0 16px', marginTop: 8 }}>
          <div style={SECTION_LABEL}>ติดต่อเรา</div>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '14px 16px',
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 1px 4px rgba(44,26,14,0.08)',
            border: CARD_BORDER,
          }}>
            {socialItems.map((item) => (
              <button
                key={item.label}
                onClick={() => window.open(item.href, '_blank')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#F5F0EA',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>
                    {item.letter}
                  </span>
                </div>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: C.brownSoft }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: '0 20px 8px' }}><StepDots step={1} /></div>

        {/* ── ORDER CTA ── */}
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

        {/* ── SOCIAL PROOF ── */}
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
