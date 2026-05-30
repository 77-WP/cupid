import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl } from '../components/Illustrations'
import NumCharacter from '../components/NumCharacter'
import { supabase } from '../lib/supabase'

const PROBLEM_CATEGORIES = [
  { id: 'wrong_order',    emoji: '🔄', label: 'Order ผิด / สลับ',  sub: 'ได้รับอาหารที่ไม่ตรงกับที่สั่ง',     isCritical: false, bg: '#FFF3EC', stroke: '#F5A623'             },
  { id: 'missing_item',  emoji: '📦', label: 'ของขาด / ไม่ครบ',   sub: 'มีรายการที่สั่งแต่ไม่ได้รับ',         isCritical: false, bg: '#FEF9EC', stroke: '#F5A623'             },
  { id: 'taste_issue',   emoji: '🍜', label: 'รสชาติผิดปกติ',      sub: 'รสชาติไม่เหมือนปกติ หรือผิดสังเกต',   isCritical: false, bg: '#FFF0F0', stroke: '#E8622A'             },
  { id: 'foreign_object',emoji: '⚠️', label: 'พบสิ่งแปลกปลอม',     sub: 'พบสิ่งที่ไม่ควรอยู่ในอาหาร',          isCritical: true,  bg: '#FFF0F0', stroke: '#DC2626'             },
  { id: 'undercooked',   emoji: '🔥', label: 'อาหารไม่สุก',        sub: 'เนื้อสัตว์หรืออาหารสุกไม่พอ',         isCritical: true,  bg: '#FFF0F0', stroke: '#DC2626'             },
  { id: 'other',         emoji: '💬', label: 'อื่นๆ',              sub: 'ปัญหาที่ไม่อยู่ในรายการข้างต้น',       isCritical: false, bg: '#F5F0EA', stroke: 'rgba(44,26,14,0.15)' },
]

const PLATFORMS = [
  { label: 'Grab',               value: 'grab'    },
  { label: 'LINE MAN',           value: 'lineman' },
  { label: 'Shopee Food',        value: 'shopee'  },
  { label: 'Walk-in / หน้าร้าน', value: 'walkin'  },
]

const PLATFORM_BRAND: Record<string, string> = {
  grab:    '#00B14F',
  lineman: '#06C755',
  shopee:  '#EE4D2D',
  walkin:  '#5C3B22',
}

const PLATFORM_LABEL: Record<string, string> = {
  grab:    'Grab',
  lineman: 'LINE MAN',
  shopee:  'Shopee Food',
  walkin:  'Walk-in / หน้าร้าน',
}

// Delivery = 3 steps, Walk-in = 2 steps
const DELIVERY_TRACK: Record<number, string> = { 1: '16.67%', 2: '50%', 3: '83.33%' }
const WALKIN_TRACK:   Record<number, string> = { 1: '25%',    2: '75%' }

export default function ProblemPath() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [screen, setScreen] = useState<'intercept' | 'category' | 'platform' | 'detail'>('intercept')
  const [interceptFading, setInterceptFading] = useState(false)
  const [category, setCategory] = useState<string>('')
  const [platform, setPlatform] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [problemText, setProblemText] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNightTime, setIsNightTime] = useState(false)
  const [cardStep, setCardStep] = useState<1 | 2 | 3>(1)
  const [cardExiting, setCardExiting] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    setIsNightTime(hour >= 22 || hour < 8)
  }, [])

  useEffect(() => {
    if (screen !== 'intercept') return
    const t1 = setTimeout(() => setInterceptFading(true), 2000)
    const t2 = setTimeout(() => { setInterceptFading(false); setScreen('category') }, 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [screen])

  // When entering detail, read platform from sessionStorage
  useEffect(() => {
    if (screen === 'detail') {
      const stored = sessionStorage.getItem('cupid_platform') || ''
      if (stored) setPlatform(stored)
      setCardStep(1)
    }
  }, [screen])

  const isWalkIn = platform === 'walkin'
  const totalSteps = isWalkIn ? 2 : 3
  const trackPositions = isWalkIn ? WALKIN_TRACK : DELIVERY_TRACK
  const canSubmit = platform !== '' && phone.trim().length >= 9 && (isWalkIn || orderNumber.trim().length > 0)

  const selectPlatform = (value: string) => {
    sessionStorage.setItem('cupid_platform', value)
    setPlatform(value)
    setTimeout(() => setScreen('detail'), 280)
  }

  const advanceCard = (next: 1 | 2 | 3) => {
    setCardExiting(true)
    setTimeout(() => { setCardExiting(false); setCardStep(next) }, 200)
  }

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)
    try {
      const isCritical = ['foreign_object', 'undercooked'].includes(category)
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
      if (botToken) {
        const catLabels: Record<string, string> = {
          wrong_order: '📋 Order ผิด/สลับ', missing_item: '📦 ของขาด/ไม่ครบ',
          taste_issue: '😕 รสชาติผิดปกติ',  foreign_object: '⚠️ พบสิ่งแปลกปลอม',
          undercooked: '🔥 อาหารไม่สุก',     other: '❓ อื่นๆ',
        }
        const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })
        const platformDisplay = PLATFORM_LABEL[platform] || platform
        const orderDisplay = isWalkIn ? '(Walk-in)' : orderNumber.trim()
        const msg = `🚨 PROBLEM REPORT — Best Part Cupid\n\nCategory: ${catLabels[category] || category}\nPlatform: ${platformDisplay}\nOrder: ${orderDisplay}\nเบอร์: ${phone.trim()}\nข้อความ: ${problemText || '(ไม่มี)'}\n${isCritical ? '\n⚠️ CRITICAL — ต้องโทรกลับภายใน 15 นาที' : '\n⚡ ต้องโทรกลับภายใน 15-20 นาที'}\n\nเวลา: ${timeStr} น.`
        try {
          if (imageFile) {
            const fd = new FormData()
            fd.append('chat_id', '7382574942'); fd.append('photo', imageFile, imageFile.name); fd.append('caption', msg)
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: fd })
          } else {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: '7382574942', text: msg }),
            })
          }
        } catch (e) { console.error('Telegram error:', e) }
      }

      const { data: feedbackData, error } = await supabase
        .from('cupid_feedback')
        .insert({
          mood: 'problem', source: platform, category,
          text: problemText || '', phone: phone.trim(),
          order_number: isWalkIn ? '' : orderNumber.trim(),
          is_critical: ['foreign_object', 'undercooked'].includes(category),
          wow_followup_needed: ['foreign_object', 'undercooked'].includes(category),
        })
        .select().single()
      if (error) throw error
      if (feedbackData?.id) sessionStorage.setItem('last_feedback_id', feedbackData.id)
      navigate('/problem-closing')
    } catch {
      navigate('/problem-closing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCat = PROBLEM_CATEGORIES.find((c) => c.id === category)

  const cardStyle: React.CSSProperties = {
    background: 'white', borderRadius: 24, margin: '0 12px', padding: '22px 20px',
    boxShadow: '0 6px 24px rgba(44,26,14,0.08)',
    animation: cardExiting
      ? 'cardScaleOut 0.2s ease-in forwards'
      : 'cardScaleIn 0.35s cubic-bezier(0.22,1,0.36,1)',
  }

  const warmInputStyle: React.CSSProperties = {
    width: '100%', padding: '16px 18px', borderRadius: 16, border: 'none',
    fontFamily: '"Sarabun", system-ui', fontSize: 24, fontWeight: 600,
    color: '#2C1A0E', outline: 'none', boxSizing: 'border-box',
    background: '#F5F0EA', letterSpacing: '0.5px',
  }

  const nextBtnActive: React.CSSProperties = {
    width: '100%', padding: 15, borderRadius: 50, border: 'none',
    background: '#DC2626', color: 'white',
    fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16,
    cursor: 'pointer', marginTop: 14,
  }

  const nextBtnInactive: React.CSSProperties = {
    width: '100%', padding: 15, borderRadius: 50, border: 'none',
    background: 'rgba(44,26,14,0.07)', color: 'rgba(44,26,14,0.3)',
    fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16,
    cursor: 'not-allowed', marginTop: 14,
  }

  // Shared description + photo + submit card
  const DescriptionCard = () => (
    <div key="desc" style={cardStyle}>
      <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginBottom: 14 }}>
        มีอะไรอยากบอกเพิ่มไหมครับ?
      </div>
      <textarea
        className="detail-textarea"
        value={problemText}
        onChange={(e) => setProblemText(e.target.value)}
        placeholder="เกิดอะไรขึ้นครับ?"
        style={{ width: '100%', minHeight: 72, padding: '14px 16px', borderRadius: 16, border: 'none', background: '#F5F0EA', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: '#2C1A0E', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
      />
      <div style={{ marginTop: 12 }}>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', marginBottom: 6 }}>
          หรือแนบรูปภาพได้เลยครับ
        </div>
        {!imagePreview ? (
          <>
            <button onClick={() => fileInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: '#F5F0EA', cursor: 'pointer', border: 'none' }}>
              <span>📷</span>
              <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: '#2C1A0E' }}>เลือกรูปภาพครับ</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; setImageFile(f); setImagePreview(URL.createObjectURL(f)) }} />
          </>
        ) : (
          <>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; setImageFile(f); setImagePreview(URL.createObjectURL(f)) }} />
            <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12, marginTop: 8, display: 'block' }} />
            <div onClick={() => { setImageFile(null); setImagePreview(''); setTimeout(() => fileInputRef.current?.click(), 50) }}
              style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.5)', cursor: 'pointer', marginTop: 6 }}>
              เลือกรูปใหม่
            </div>
          </>
        )}
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>⚡</span>
        <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#E8622A' }}>
          {isNightTime ? 'ทีมงานจะติดต่อกลับวันพรุ่งนี้ ภายใน 11:30 น. ครับ' : 'ทีมงานรับเรื่องภายใน 15-20 นาทีครับ'}
        </span>
      </div>
      <button onClick={handleSubmit} disabled={isSubmitting}
        style={{ marginTop: 14, width: '100%', padding: 15, borderRadius: 50, border: 'none', background: '#DC2626', color: 'white', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
        {isSubmitting ? 'กำลังส่งครับ...' : 'ส่งให้ทีมงานด่วนครับ 🚨'}
      </button>
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <span onClick={handleSubmit} style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.3)', cursor: 'pointer' }}>
          ข้ามส่วนนี้และส่งได้เลยครับ →
        </span>
      </div>
    </div>
  )

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
        @keyframes slideIn {
          from { opacity:0; transform:translateX(16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes platformPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.92); }
          70%  { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes fadeInScreen  { from { opacity:0; } to { opacity:1; } }
        @keyframes fadeOutScreen { from { opacity:1; } to { opacity:0; } }
        @keyframes charWalk {
          0%,100% { transform: translateY(0); }
          25%,75% { transform: translateY(-3px); }
        }
        @keyframes cardScaleIn {
          from { opacity:0; transform:scale(0.94) translateY(8px); }
          to   { opacity:1; transform:scale(1)    translateY(0); }
        }
        @keyframes cardScaleOut {
          from { opacity:1; transform:scale(1)    translateY(0); }
          to   { opacity:0; transform:scale(0.96) translateY(-6px); }
        }
        @keyframes progressGlow {
          0%,100% { box-shadow:0 0 4px rgba(220,38,38,0.3); }
          50%     { box-shadow:0 0 10px rgba(220,38,38,0.6); }
        }
        .warm-input:focus    { background:white!important; box-shadow:0 0 0 2px rgba(220,38,38,0.25); }
        .detail-textarea:focus { background:white!important; box-shadow:0 0 0 2px rgba(220,38,38,0.2); }
        .cat-card:active { transform:scale(0.97); }
      `}</style>

      {/* ── INTERCEPT ── */}
      {screen === 'intercept' && (
        <div style={{
          background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column',
          animation: interceptFading ? 'fadeOutScreen 0.5s ease-out forwards' : 'fadeInScreen 0.4s ease-out',
        }}>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', animation: 'floatChar 3s ease-in-out infinite' }}>
              <NumCharacter pose="concerned" size={110} />
            </div>
          </div>
          <div style={{ margin: '20px 16px 0', background: 'rgba(254,242,242,0.8)', border: '1.5px solid rgba(220,38,38,0.2)', borderRadius: 18, padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, background: 'rgba(220,38,38,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 18, color: '#DC2626' }}>!</span>
              </div>
              <div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: '#2C1A0E' }}>ต้องขอโทษมากเลยครับ 😔</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.6)', marginTop: 4 }}>เราจะรีบดูแลให้ทันทีครับ</div>
              </div>
            </div>
          </div>
          <div style={{ margin: '12px 16px 0', textAlign: 'center' }}>
            {!isNightTime ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span>⚡</span>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#E8622A' }}>ทีมงานรับเรื่องภายใน 15-20 นาทีครับ</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span>🌙</span>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#6B4C2A' }}>ทีมงานจะติดต่อกลับวันพรุ่งนี้ ภายใน 11:30 น. แน่นอนครับ 🙏</span>
              </div>
            )}
          </div>
          <div style={{ flex: 1.5 }} />
        </div>
      )}

      {/* ── CATEGORY ── */}
      {screen === 'category' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out' }}>
          <div style={{ padding: '16px 20px' }}>
            <button onClick={() => { setInterceptFading(false); setScreen('intercept') }}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", system-ui', fontSize: 20, color: '#2C1A0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ‹
            </button>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginTop: 16 }}>เกิดเรื่องอะไรขึ้นครับ?</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginTop: 4 }}>เลือกที่ใกล้เคียงที่สุดครับ</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px' }}>
            {PROBLEM_CATEGORIES.map((cat, index) => (
              <div key={cat.id} className="cat-card"
                onClick={() => { setCategory(cat.id); setScreen('platform') }}
                style={{
                  borderRadius: 18, padding: '14px 12px 16px', cursor: 'pointer',
                  border: `1.5px solid ${cat.stroke}`, background: cat.bg,
                  display: 'flex', flexDirection: 'column', minHeight: 130,
                  position: 'relative', overflow: 'hidden',
                  animation: 'cardScaleIn 0.3s ease-out both',
                  animationDelay: `${index * 60}ms`,
                  transition: 'transform 0.12s ease',
                }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(44,26,14,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 32, lineHeight: 1 }}>{cat.emoji}</span>
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E', lineHeight: 1.3, marginBottom: 4 }}>{cat.label}</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.45)', lineHeight: 1.5 }}>{cat.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
        </div>
      )}

      {/* ── PLATFORM SELECT (separate screen) ── */}
      {screen === 'platform' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out' }}>
          <div style={{ padding: '16px 20px 20px' }}>
            <button onClick={() => setScreen('category')}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", system-ui', fontSize: 20, color: '#2C1A0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ‹
            </button>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginTop: 16 }}>สั่งผ่านช่องทางไหนครับ?</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginTop: 4 }}>เลือกช่องทางที่ใช้สั่งครับ</div>
          </div>
          <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {PLATFORMS.map(({ label, value }) => {
              const brand = PLATFORM_BRAND[value] ?? '#2C1A0E'
              return (
                <button key={value} onClick={() => selectPlatform(value)}
                  style={{
                    height: 120, padding: '0', borderRadius: 18, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                    fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15,
                    border: 'none', borderLeft: `4px solid ${brand}`, background: 'white', color: '#2C1A0E',
                    transition: 'all 0.15s ease', boxSizing: 'border-box',
                    boxShadow: '0 2px 8px rgba(44,26,14,0.06)',
                  }}
                  onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
                  onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${brand}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: brand }} />
                  </div>
                  <span style={{ textAlign: 'center', lineHeight: 1.3, padding: '0 8px' }}>{label}</span>
                </button>
              )
            })}
          </div>
          <div style={{ flex: 1 }} />
        </div>
      )}

      {/* ── DETAIL (form cards) ── */}
      {screen === 'detail' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

          {/* Sticky header */}
          <div style={{ padding: '16px 20px 0', position: 'sticky', top: 0, background: 'rgba(250,243,232,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <button
                onClick={() => {
                  if (cardStep === 1) setScreen('platform')
                  else advanceCard((cardStep - 1) as 1 | 2 | 3)
                }}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", system-ui', fontSize: 20, color: '#2C1A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                ‹
              </button>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', borderRadius: 50, padding: '6px 12px', border: '1.5px solid rgba(44,26,14,0.08)' }}>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E' }}>{selectedCat?.label}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 8, marginBottom: 14, padding: '0 16px' }}>
              <div style={{ position: 'relative', height: 32 }}>
                <div style={{ position: 'absolute', top: 24, left: 4, right: 4, height: 4, borderRadius: 2, background: 'rgba(44,26,14,0.1)' }} />
                <div style={{
                  position: 'absolute', top: 24, left: 4, height: 4, borderRadius: 2,
                  background: '#DC2626', width: trackPositions[cardStep],
                  transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                  animation: 'progressGlow 2s ease-in-out infinite',
                }} />
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
                  <div key={n} style={{
                    position: 'absolute', top: 20, left: trackPositions[n], transform: 'translateX(-50%)',
                    width: 8, height: 8, borderRadius: '50%',
                    background: n <= cardStep ? '#DC2626' : 'rgba(44,26,14,0.15)',
                    transition: 'background 0.3s ease',
                  }} />
                ))}
                <div style={{
                  position: 'absolute', top: 0, left: trackPositions[cardStep],
                  transform: 'translateX(-50%)',
                  transition: 'left 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                  <div style={{ width: 24, height: 24, animation: 'charWalk 0.6s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MascotBowl size={24} mood="happy" />
                  </div>
                  <div style={{ width: 16, height: 3, borderRadius: '50%', background: 'rgba(44,26,14,0.1)', margin: '0 auto', marginTop: -1 }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingBottom: 32 }}>

            {/* ── DELIVERY CARD 1 / WALK-IN CARD 1 ── */}
            {cardStep === 1 && (
              <div key={1} style={cardStyle}>
                {isWalkIn ? (
                  /* Walk-in Card 1: Phone */
                  <>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginBottom: 4 }}>
                      เบอร์โทรติดต่อกลับครับ
                    </div>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginBottom: 16 }}>
                      ทีมงานจะโทรกลับเพื่อแก้ไขให้ครับ
                    </div>
                    <input className="warm-input" type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812345678" style={warmInputStyle} autoFocus />
                    <button onClick={() => { if (phone.trim().length >= 9) advanceCard(2) }}
                      disabled={phone.trim().length < 9}
                      style={phone.trim().length >= 9 ? nextBtnActive : nextBtnInactive}>
                      {phone.trim().length >= 9 ? 'ต่อไปครับ →' : 'กรุณากรอกเบอร์ครับ'}
                    </button>
                  </>
                ) : (
                  /* Delivery Card 1: Order number */
                  <>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginBottom: 4 }}>
                      เลขออเดอร์ครับ
                    </div>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginBottom: 16 }}>
                      ดูได้จาก app ที่สั่งครับ
                    </div>
                    <input className="warm-input" type="text" value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="เช่น GF-12345678 หรือ LM-XXXXXX"
                      style={{ ...warmInputStyle, fontSize: 18 }} autoFocus />
                    <button onClick={() => { if (orderNumber.trim().length > 0) advanceCard(2) }}
                      disabled={orderNumber.trim().length === 0}
                      style={orderNumber.trim().length > 0 ? nextBtnActive : nextBtnInactive}>
                      {orderNumber.trim().length > 0 ? 'ต่อไปครับ →' : 'กรุณากรอก Order Number ครับ'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* ── DELIVERY CARD 2: Phone / WALK-IN CARD 2: Description+submit ── */}
            {cardStep === 2 && (
              isWalkIn ? (
                <DescriptionCard />
              ) : (
                <div key={2} style={cardStyle}>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginBottom: 4 }}>
                    เบอร์โทรติดต่อกลับครับ
                  </div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginBottom: 16 }}>
                    ทีมงานจะโทรกลับเพื่อแก้ไขให้ครับ
                  </div>
                  <input className="warm-input" type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812345678" style={warmInputStyle} autoFocus />
                  <button onClick={() => { if (phone.trim().length >= 9) advanceCard(3) }}
                    disabled={phone.trim().length < 9}
                    style={phone.trim().length >= 9 ? nextBtnActive : nextBtnInactive}>
                    {phone.trim().length >= 9 ? 'ต่อไปครับ →' : 'กรุณากรอกเบอร์ครับ'}
                  </button>
                </div>
              )
            )}

            {/* ── DELIVERY CARD 3: Description+submit ── */}
            {cardStep === 3 && !isWalkIn && <DescriptionCard />}

          </div>
        </div>
      )}
    </MobileFrame>
  )
}
