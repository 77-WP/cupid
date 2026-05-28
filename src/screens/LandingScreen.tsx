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
  const [settings, setSettings] = useState<CupidSettings | null>(null)
  const [qaAnswered, setQaAnswered] = useState(false)
  const [qaSelected, setQaSelected] = useState('')

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

  const qaActive = settings?.qa_is_active && !!settings?.weekly_question
  const qaOptions = settings?.weekly_question_options?.filter(Boolean).slice(0, 3) ?? []

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
        @keyframes bannerShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .tile-btn:active { transform: scale(0.95) !important; }
        .cat-card-btn:active { transform: scale(0.97) !important; }
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

        {/* ── ZONE 1: HEADER ROW ── */}
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

        {/* ── ZONE 5: FEATURES GRID ── */}
        <div style={{ marginTop: 14, padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, animation: 'fadeUp 0.4s ease-out 0.3s both' }}>

          {/* Card 1 — เหมือนฝัน */}
          <button
            className="cat-card-btn"
            onClick={() => navigate('/meunfun')}
            style={{ background: '#2C1A0E', borderRadius: 16, padding: '13px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: 100, border: 'none', textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.12s ease', boxSizing: 'border-box' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1.5px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: 'white', marginTop: 8 }}>เหมือนฝัน</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>ดูพัฒนาการของเรา</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#F5A623', marginTop: 'auto', paddingTop: 8 }}>ดูเลย →</div>
          </button>

          {/* Card 2 — Founder */}
          <button
            className="cat-card-btn"
            onClick={() => navigate('/founder')}
            style={{ background: 'linear-gradient(135deg, #E8622A, #C94E1A)', borderRadius: 16, padding: '13px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: 100, border: 'none', textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.12s ease', boxSizing: 'border-box' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '1.5px dashed rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>+</span>
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: 'white', marginTop: 8, lineHeight: 1.35 }}>จดหมายจากผู้ก่อตั้ง</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>Wiphu เขียนถึงคุณ</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: 'white', marginTop: 'auto', paddingTop: 8 }}>อ่านเลย →</div>
          </button>

          {/* Card 3 — Weekly Q&A (full width) or Website CTA fallback */}
          {qaActive ? (
            <div style={{ gridColumn: 'span 2', background: 'white', border: '1.5px solid rgba(245,166,35,0.3)', borderRadius: 16, padding: '13px 12px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {/* Left */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'inline-block', background: '#FEF3C7', borderRadius: 20, padding: '4px 10px', marginBottom: 6 }}>
                  <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 10, color: '#B45309' }}>📋 คำถามสัปดาห์นี้</span>
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', lineHeight: 1.4 }}>
                  {settings?.weekly_question}
                </div>
                {qaAnswered && (
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: '#15803D', marginTop: 4 }}>✓ ขอบคุณครับ</div>
                )}
              </div>
              {/* Right */}
              {!qaAnswered ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                  {qaOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setQaSelected(opt); setQaAnswered(true) }}
                      style={{ padding: '7px 10px', borderRadius: 50, border: '1.5px solid rgba(232,98,42,0.25)', background: 'transparent', color: '#E8622A', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#E8622A', color: 'white', padding: '6px 12px', borderRadius: 50, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                  {qaSelected}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => window.open('https://bestpartbowls.com', '_blank')}
              style={{ gridColumn: 'span 2', background: 'white', border: '1.5px solid rgba(44,26,14,0.07)', borderRadius: 16, padding: '13px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}
            >
              <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E' }}>🌐 ดูเมนูและสั่งอาหาร</span>
              <span style={{ fontFamily: '"DM Sans", system-ui', fontSize: 18, color: '#E8622A' }}>→</span>
            </button>
          )}

          {/* Card 4 — Website CTA (only when Q&A is active) */}
          {qaActive && (
            <button
              className="cat-card-btn"
              onClick={() => window.open('https://bestpartbowls.com', '_blank')}
              style={{ background: 'white', border: '1.5px solid rgba(44,26,14,0.06)', borderRadius: 16, padding: '13px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: 100, textAlign: 'left', fontFamily: 'inherit', transition: 'transform 0.12s ease', boxSizing: 'border-box' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(44,26,14,0.06)', border: '1.5px dashed rgba(44,26,14,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 14, color: 'rgba(44,26,14,0.2)' }}>+</span>
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', marginTop: 8 }}>สั่งอาหาร</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>ดูเมนูล่วงหน้า</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#E8622A', marginTop: 'auto', paddingTop: 8 }}>ดูเลย →</div>
            </button>
          )}
        </div>

        {/* ── ZONE 6: ADS BANNER ── */}
        <div style={{ marginTop: 12, padding: '0 16px', animation: 'fadeUp 0.4s ease-out 0.4s both' }}>
          <div
            onClick={() => window.open('https://bestpartbowls.com', '_blank')}
            style={{ height: 72, borderRadius: 16, overflow: 'hidden', position: 'relative', cursor: 'pointer', background: 'linear-gradient(135deg, #2C1A0E 0%, #4A2E1A 50%, #2C1A0E 100%)', backgroundSize: '300% 100%', animation: 'bannerShimmer 4s linear infinite' }}
          >
            <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}>
              <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}>BEST PART</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: 'white', marginTop: 2 }}>สั่งข้าวกล่องสดใหม่ทุกวัน</div>
            </div>
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(232,98,42,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 14, color: 'white' }}>→</span>
            </div>
          </div>
        </div>

        {/* ── ZONE 7: ANNOUNCEMENT BANNER ── */}
        {settings?.announcement_is_active && settings.announcement_text && (
          <div style={{ marginTop: 8, padding: '0 16px', animation: 'fadeUp 0.4s ease-out 0.5s both' }}>
            <div style={{ background: 'rgba(232,98,42,0.08)', borderRadius: 14, padding: '10px 14px', border: '1px solid rgba(232,98,42,0.2)' }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#2C1A0E', lineHeight: 1.5 }}>
                📣 {settings.announcement_text}
              </div>
            </div>
          </div>
        )}

        {/* ── ZONE 8: SOCIAL ICONS ── */}
        <div style={{ marginTop: 8, marginBottom: 16, display: 'flex', justifyContent: 'center', gap: 24 }}>
          {socialItems.map((item) => (
            <button
              key={item.key}
              onClick={() => window.open(item.href, '_blank')}
              style={{ width: 32, height: 32, background: 'rgba(44,26,14,0.07)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.5, border: 'none', padding: 0 }}
            />
          ))}
        </div>

      </div>
    </MobileFrame>
  )
}
