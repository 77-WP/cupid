import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl, HeartLogo } from '../components/Illustrations'
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

const cardBase: React.CSSProperties = {
  background: '#F0EBE3',
  borderRadius: 16,
  padding: '14px 12px',
  aspectRatio: '1',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
  boxShadow: 'none',
  textAlign: 'left',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const cardPlaceholder: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: 'rgba(44,26,14,0.08)',
  border: '1.5px dashed rgba(44,26,14,0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

export default function LandingScreen() {
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)
  const [settings, setSettings] = useState<CupidSettings | null>(null)
  const [qaAnswered, setQaAnswered] = useState(false)

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

  const qaOptions = settings?.weekly_question_options?.filter(Boolean).slice(0, 3) ?? []
  const qaTitle = settings?.weekly_question
    ? settings.weekly_question.slice(0, 20) + (settings.weekly_question.length > 20 ? '...' : '')
    : 'คำถามสัปดาห์นี้'
  const qaSubLabel = qaOptions[0] ?? 'ตอบได้เลยครับ'

  return (
    <MobileFrame>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translate(-50%, 8px) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, 0)   scale(1); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes floatChar {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-7px); }
        }
        @keyframes badgePulse {
          0%,100% { transform:scale(1); }
          50% { transform:scale(1.04); }
        }
        .tile-btn:active { transform: scale(0.95) !important; }
        .feat-card:active { transform: scale(0.97) !important; }
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

      <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

        {/* ── ZONE 1: HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HeartLogo size={18} />
            <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 13, letterSpacing: 2.4, color: C.brown }}>BEST PART</span>
          </div>
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 0.6, textTransform: 'uppercase' }}>cupid</div>
        </div>

        {/* ── ZONE 2: CHARACTER + SOCIAL PROOF ── */}
        <div style={{ textAlign: 'center', padding: '8px 20px 0' }}>
          <div style={{ display: 'inline-block', animation: 'floatChar 3s ease-in-out infinite' }}>
            <MascotBowl size={72} mood="happy" wave />
          </div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(232,98,42,0.08)', borderRadius: 50, padding: '5px 12px', animation: 'badgePulse 3s ease-in-out infinite' }}>
              <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: '#E8622A' }}>
                {feedbackCount ?? 0} คนให้กำลังใจทีมงานเดือนนี้ 🧡
              </span>
            </div>
          </div>
        </div>

        {/* ── ZONE 3: MOOD HEADING ── */}
        <div style={{ marginTop: 14, textAlign: 'center', padding: '0 20px' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E' }}>
            วันนี้เป็นยังไงบ้างครับ?
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>
            ใช้เวลา 30 วินาทีครับ
          </div>
        </div>

        {/* ── ZONE 4: MOOD TILES ── */}
        <div style={{ marginTop: 14, padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {tiles.map((t) => (
            <button
              key={t.key}
              className="tile-btn"
              onMouseEnter={() => setHover(t.key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleTileTap(t.key, t.path)}
              style={{
                borderRadius: 16,
                padding: '14px 8px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                transition: 'transform 0.15s ease',
                transform: hover === t.key ? 'scale(0.95)' : 'scale(1)',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(44,26,14,0.06)', border: '1.5px dashed rgba(44,26,14,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 20, color: 'rgba(44,26,14,0.2)' }}>+</span>
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E' }}>{t.label}</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', marginTop: 2 }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* ── ZONE 5: FEATURES GRID — equal 2×2 ── */}
        <div style={{ marginTop: 14, padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>

          {/* Card 1 — เหมือนฝัน */}
          <button className="feat-card" onClick={() => navigate('/meunfun')} style={cardBase}>
            <div style={cardPlaceholder}>
              <span style={{ fontSize: 14, color: 'rgba(44,26,14,0.2)' }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', marginTop: 8, lineHeight: 1.3 }}>เหมือนฝัน</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>ดูพัฒนาการของเรา</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#E8622A', marginTop: 'auto', paddingTop: 8 }}>ดูเลย →</div>
          </button>

          {/* Card 2 — Founder */}
          <button className="feat-card" onClick={() => navigate('/founder')} style={cardBase}>
            <div style={cardPlaceholder}>
              <span style={{ fontSize: 14, color: 'rgba(44,26,14,0.2)' }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', marginTop: 8, lineHeight: 1.3 }}>
              จดหมายจาก{'\n'}ผู้ก่อตั้ง
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>Wiphu เขียนถึงคุณ</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#E8622A', marginTop: 'auto', paddingTop: 8 }}>อ่านเลย →</div>
          </button>

          {/* Card 3 — Weekly Q&A */}
          <button
            className="feat-card"
            onClick={() => {
              if (!qaAnswered) setQaAnswered(true)
            }}
            style={cardBase}
          >
            <div style={cardPlaceholder}>
              <span style={{ fontSize: 14, color: 'rgba(44,26,14,0.2)' }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', marginTop: 8, lineHeight: 1.3 }}>
              {qaTitle}
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>
              {qaSubLabel}
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: qaAnswered ? '#15803D' : '#E8622A', marginTop: 'auto', paddingTop: 8 }}>
              {qaAnswered ? '✓ ขอบคุณครับ' : 'ตอบเลย →'}
            </div>
          </button>

          {/* Card 4 — Website CTA */}
          <button
            className="feat-card"
            onClick={() => window.open('https://bestpartbowls.com', '_blank')}
            style={cardBase}
          >
            <div style={cardPlaceholder}>
              <span style={{ fontSize: 14, color: 'rgba(44,26,14,0.2)' }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', marginTop: 8, lineHeight: 1.3 }}>สั่งอาหาร</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>ดูเมนูล่วงหน้า</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#E8622A', marginTop: 'auto', paddingTop: 8 }}>ดูเลย →</div>
          </button>

        </div>

        {/* ── ZONE 6: ADS BANNER (always visible) ── */}
        <div style={{ marginTop: 12, padding: '0 16px' }}>
          <div
            onClick={() => window.open('https://bestpartbowls.com', '_blank')}
            style={{ height: 72, borderRadius: 16, background: '#2C1A0E', position: 'relative', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxSizing: 'border-box' }}
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

        {/* ── ZONE 7: ANNOUNCEMENT BANNER ── */}
        <div style={{ marginTop: 8, padding: '0 16px', paddingBottom: 24 }}>
          {settings?.announcement_is_active && settings.announcement_text ? (
            <div style={{ background: 'rgba(232,98,42,0.08)', borderRadius: 14, padding: '10px 14px', border: '1px solid rgba(232,98,42,0.2)' }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#2C1A0E', lineHeight: 1.5 }}>
                📣 {settings.announcement_text}
              </div>
            </div>
          ) : (
            <div style={{ height: 64, borderRadius: 16, background: 'rgba(232,98,42,0.06)', border: '1.5px dashed rgba(232,98,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.3)' }}>ยังไม่มีประกาศครับ</span>
            </div>
          )}
        </div>

      </div>
    </MobileFrame>
  )
}
