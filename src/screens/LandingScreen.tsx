import { useState, useEffect, useRef } from 'react'
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
  { key: 'happy', emoji: '😄', label: 'ชอบมาก',  sub: 'บอกต่อ',       path: '/happy'   },
  { key: 'okay',  emoji: '😐', label: 'โอเค',    sub: 'แสดงความคิด',  path: '/neutral' },
  { key: 'bad',   emoji: '😟', label: 'มีปัญหา', sub: 'แจ้งด่วน',     path: '/problem' },
]

const CARD_SHADOW = '0 1px 4px rgba(44,26,14,0.07), 0 4px 16px rgba(44,26,14,0.05)'
const CARD_BORDER = '1.5px solid rgba(44,26,14,0.06)'

const BANNER_SLIDES = [
  {
    bg: '#2C1A0E',
    label: 'BEST PART',
    labelColor: 'rgba(255,255,255,0.4)',
    text: 'สั่งข้าวกล่องสดใหม่ทุกวัน',
    textColor: 'white',
    arrowBg: '#E8622A',
    arrowColor: 'white',
    onClick: () => window.open('https://bestpartbowls.com', '_blank'),
  },
  {
    bg: '#FAF3E8',
    label: 'BEST PART',
    labelColor: 'rgba(44,26,14,0.3)',
    text: 'อ่านจดหมายจากผู้ก่อตั้ง 📝',
    textColor: '#2C1A0E',
    arrowBg: '#2C1A0E',
    arrowColor: 'white',
    path: '/founder',
  },
  {
    bg: '#E8622A',
    label: 'BEST PART',
    labelColor: 'rgba(255,255,255,0.5)',
    text: 'ประกาศ: เปิดสาขาใหม่เร็วๆนี้ 🎉',
    textColor: 'white',
    arrowBg: 'rgba(255,255,255,0.25)',
    arrowColor: 'white',
  },
]

export default function LandingScreen() {
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)
  const [settings, setSettings] = useState<CupidSettings | null>(null)
  const [bannerIndex, setBannerIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    supabase.from('cupid_feedback').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count != null) setFeedbackCount(count)
    })
    supabase.from('cupid_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setSettings(data as CupidSettings)
    })
  }, [])

  // Auto-scroll banner
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % BANNER_SLIDES.length)
    }, 4000)
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current) }
  }, [])

  const resetAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    autoScrollRef.current = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % BANNER_SLIDES.length)
    }, 4000)
  }

  const goToBanner = (i: number) => { setBannerIndex(i); resetAutoScroll() }

  const handleTileTap = (key: string, path: string) => {
    setToast(TILE_TOASTS[key])
    setTimeout(() => { setToast(null); navigate(path) }, 900)
  }

  const slide = BANNER_SLIDES[bannerIndex]

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
        @keyframes bannerFade {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .mascot-float { animation: mascot-float 3s ease-in-out infinite; }
        .tile-btn:active { transform: scale(0.95) !important; }
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
              <div style={{
                width: 72, height: 72, borderRadius: 18,
                background: hover === t.key ? 'rgba(232,98,42,0.08)' : 'rgba(44,26,14,0.05)',
                border: hover === t.key ? '1.5px solid rgba(232,98,42,0.2)' : '1.5px solid rgba(44,26,14,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s, border 0.15s',
              }}>
                <span style={{ fontSize: 36, lineHeight: 1 }}>{t.emoji}</span>
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
              background: 'white', borderRadius: 20, padding: '16px 14px',
              display: 'flex', flexDirection: 'column',
              boxShadow: CARD_SHADOW, border: CARD_BORDER,
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              boxSizing: 'border-box',
              animation: 'slideInLeft 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both, cardFloat 4s ease-in-out 0.6s infinite',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>✨</span>
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
              background: 'white', borderRadius: 20, padding: '16px 14px',
              display: 'flex', flexDirection: 'column',
              boxShadow: CARD_SHADOW, border: CARD_BORDER,
              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              boxSizing: 'border-box',
              animation: 'slideInRight 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both, cardFloat 4s ease-in-out 1s infinite',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(44,26,14,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>📝</span>
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

        {/* ── BANNER SLIDER ── */}
        <div style={{ marginTop: 12, padding: '0 16px', animation: 'fadeUp 0.4s ease-out 0.4s both' }}>
          {/* Slide */}
          <div
            key={bannerIndex}
            onClick={() => {
              if (slide.path) navigate(slide.path)
              else if (slide.onClick) slide.onClick()
            }}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return
              const diff = touchStartX.current - e.changedTouches[0].clientX
              if (diff > 40) goToBanner((bannerIndex + 1) % BANNER_SLIDES.length)
              else if (diff < -40) goToBanner((bannerIndex - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)
              touchStartX.current = null
            }}
            style={{
              height: 72, borderRadius: 16,
              background: slide.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', cursor: 'pointer',
              overflow: 'hidden', boxSizing: 'border-box',
              animation: 'bannerFade 0.3s ease-out',
              transition: 'background 0.3s ease',
            }}
          >
            <div>
              <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 9, color: slide.labelColor, letterSpacing: '0.15em', display: 'block' }}>
                {slide.label}
              </span>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: slide.textColor, marginTop: 2 }}>
                {slide.text}
              </div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: slide.arrowBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 16, color: slide.arrowColor }}>→</span>
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            {BANNER_SLIDES.map((_, i) => (
              <div
                key={i}
                onClick={() => goToBanner(i)}
                style={{
                  height: 6, borderRadius: 3,
                  width: i === bannerIndex ? 18 : 6,
                  background: i === bannerIndex ? C.orange : 'rgba(44,26,14,0.18)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
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

        {/* ── SOCIAL PROOF ── */}
        <div style={{ padding: '16px 16px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft }}>
            {feedbackCount != null ? (
              <>❤️ <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, color: C.brown }}>{feedbackCount.toLocaleString()}</span> คนให้กำลังใจทีมงานเราเดือนนี้</>
            ) : (
              <span style={{ color: 'rgba(44,26,14,0.35)' }}>❤️ คนให้กำลังใจทีมงานเราเดือนนี้</span>
            )}
          </div>
        </div>

      </div>
    </MobileFrame>
  )
}
