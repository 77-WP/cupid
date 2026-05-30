import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { HeartLogo } from '../components/Illustrations'
import NumCharacter from '../components/NumCharacter'
import { C } from '../components/SharedUI'
import { supabase } from '../lib/supabase'

interface CupidSettings {
  announcement_is_active: boolean
  announcement_text: string | null
  qa_is_active: boolean
  weekly_question: string | null
  weekly_question_options: string[] | null
}

const TILE_TOASTS: Record<string, string> = {
  happy: 'ขอบคุณมากเลยครับ ❤️',
  okay:  'ขอบคุณที่บอกเรานะครับ 🙏',
  bad:   'เดี๋ยวเราดูแลให้นะครับ 🙏',
}

const tiles = [
  { key: 'happy', label: 'ชอบมาก',  sub: 'บอกต่อ',       path: '/happy'   },
  { key: 'okay',  label: 'โอเค',    sub: 'แสดงความคิด',  path: '/neutral' },
  { key: 'bad',   label: 'มีปัญหา', sub: 'แจ้งด่วน',     path: '/problem' },
]

const CARD_SHADOW = '0 1px 4px rgba(44,26,14,0.07), 0 4px 16px rgba(44,26,14,0.05)'
const CARD_BORDER = '1.5px solid rgba(44,26,14,0.06)'

export default function LandingScreen() {
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)
  const [settings, setSettings] = useState<CupidSettings | null>(null)

  useEffect(() => {
    supabase.from('cupid_feedback').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count != null) setFeedbackCount(count)
    })
    supabase.from('cupid_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setSettings(data as CupidSettings)
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
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-24px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(24px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes cardFloat {
          0%,100% { transform:translateY(0px); }
          50% { transform:translateY(-4px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes mascot-float {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-8px); }
        }
        .mascot-float { animation: mascot-float 3s ease-in-out infinite; }
        .tile-btn:active { transform: scale(0.95) !important; }
        .cta-pill:hover, .cta-pill:active {
          background: #E8622A !important;
          color: #fff !important;
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
          <div className="mascot-float"><NumCharacter pose="greeting" size={120} /></div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: C.brown, marginTop: 6, textAlign: 'center', lineHeight: 1.25, padding: '0 28px' }}>
            วันนี้เป็นยังไงบ้างครับ?
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, opacity: 0.7, marginTop: 4 }}>
            ใช้เวลา 30 วินาที
          </div>
        </div>

        {/* ── MOOD TILES ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '0 16px', marginTop: 20 }}>
          {tiles.map((t) => (
            <button
              key={t.key}
              className="tile-btn"
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
              <div style={{ width: 72, height: 72, borderRadius: 14, background: 'rgba(44,26,14,0.06)', border: '1.5px dashed rgba(44,26,14,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        {/* ── FEATURE CARDS (2 only) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px', marginTop: 20 }}>

          {/* Card 1 — เหมือนฝัน */}
          <button
            onClick={() => navigate('/meunfun')}
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '16px 14px',
              display: 'flex', flexDirection: 'column',
              boxShadow: CARD_SHADOW,
              border: CARD_BORDER,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              animation: 'slideInLeft 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both, cardFloat 4s ease-in-out 0.6s infinite',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(44,26,14,0.05)', border: '1.5px dashed rgba(44,26,14,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 18, color: 'rgba(44,26,14,0.18)', fontFamily: '"DM Sans", system-ui', lineHeight: 1 }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E', marginTop: 10 }}>
              เหมือนฝัน
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', lineHeight: 1.5, marginTop: 4 }}>
              ดูพัฒนาการของ Best Part
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#E8622A', marginTop: 10 }}>
              ดูเลย →
            </div>
          </button>

          {/* Card 2 — Founder */}
          <button
            onClick={() => navigate('/founder')}
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '16px 14px',
              display: 'flex', flexDirection: 'column',
              boxShadow: CARD_SHADOW,
              border: CARD_BORDER,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              animation: 'slideInRight 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both, cardFloat 4s ease-in-out 1s infinite',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(44,26,14,0.05)', border: '1.5px dashed rgba(44,26,14,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 18, color: 'rgba(44,26,14,0.18)', fontFamily: '"DM Sans", system-ui', lineHeight: 1 }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E', marginTop: 10, lineHeight: 1.35 }}>
              จดหมายจาก{'\n'}ผู้ก่อตั้ง
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', marginTop: 4 }}>
              Wiphu เขียนถึงคุณ
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#E8622A', marginTop: 10 }}>
              อ่านเลย →
            </div>
          </button>

        </div>

        {/* ── ADS BANNER (always visible) ── */}
        <div style={{ marginTop: 12, padding: '0 16px', animation: 'fadeUp 0.4s ease-out 0.4s both' }}>
          <div
            onClick={() => window.open('https://bestpartbowls.com', '_blank')}
            style={{ height: 72, borderRadius: 16, background: '#2C1A0E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', cursor: 'pointer', overflow: 'hidden', boxSizing: 'border-box' }}
          >
            <div>
              <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', display: 'block' }}>BEST PART</span>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: 'white', marginTop: 2 }}>สั่งข้าวกล่องสดใหม่ทุกวัน</div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8622A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 16, color: 'white' }}>→</span>
            </div>
          </div>
        </div>

        {/* ── ANNOUNCEMENT BANNER (conditional) ── */}
        {settings?.announcement_is_active && settings.announcement_text && (
          <div style={{ marginTop: 8, padding: '0 16px', animation: 'fadeUp 0.4s ease-out 0.5s both' }}>
            <div style={{ background: 'rgba(232,98,42,0.08)', borderRadius: 14, padding: '10px 14px', border: '1px solid rgba(232,98,42,0.2)' }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#2C1A0E', lineHeight: 1.5 }}>
                📣 {settings.announcement_text}
              </div>
            </div>
          </div>
        )}

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
