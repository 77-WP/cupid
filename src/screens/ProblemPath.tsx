import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl } from '../components/Illustrations'
import { supabase } from '../lib/supabase'

const PROBLEM_CATEGORIES = [
  { id: 'wrong_order',    label: 'Order ผิด / สลับ',    sub: 'ได้รับอาหารที่ไม่ตรงกับที่สั่ง',         isCritical: false },
  { id: 'missing_item',  label: 'ของขาด / ไม่ครบ',     sub: 'มีรายการที่สั่งแต่ไม่ได้รับ',             isCritical: false },
  { id: 'taste_issue',   label: 'รสชาติผิดปกติ',        sub: 'รสชาติไม่เหมือนปกติ หรือผิดสังเกต',       isCritical: false },
  { id: 'foreign_object',label: 'พบสิ่งแปลกปลอม',       sub: 'พบสิ่งที่ไม่ควรอยู่ในอาหาร',              isCritical: true  },
  { id: 'undercooked',   label: 'อาหารไม่สุก',          sub: 'เนื้อสัตว์หรืออาหารสุกไม่พอ',             isCritical: true  },
  { id: 'other',         label: 'อื่นๆ',                sub: 'ปัญหาที่ไม่อยู่ในรายการข้างต้น',           isCritical: false },
]

const PLATFORMS = ['Grab', 'LINE MAN', 'Shopee Food', 'หน้าร้าน']

export default function ProblemPath() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [screen, setScreen] = useState<'intercept' | 'category' | 'detail'>('intercept')
  const [category, setCategory] = useState<string>('')
  const [platform, setPlatform] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [problemText, setProblemText] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNightTime, setIsNightTime] = useState(false)
  const [cardStep, setCardStep] = useState<1 | 2 | 3 | 4>(1)

  useEffect(() => {
    const hour = new Date().getHours()
    setIsNightTime(hour >= 22 || hour < 8)
  }, [])

  // FIX 1: Auto-advance intercept after 2.5s
  useEffect(() => {
    if (screen !== 'intercept') return
    const timer = setTimeout(() => setScreen('category'), 2500)
    return () => clearTimeout(timer)
  }, [screen])

  // Reset cardStep when entering detail screen
  useEffect(() => {
    if (screen === 'detail') setCardStep(1)
  }, [screen])

  const canSubmit = platform !== '' && phone.trim().length >= 9 && orderNumber.trim().length > 0

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)

    try {
      const isCritical = ['foreign_object', 'undercooked'].includes(category)

      // FIX 4: Telegram first (with photo if present), then DB
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
      if (botToken) {
        const catLabels: Record<string, string> = {
          wrong_order: '📋 Order ผิด/สลับ',
          missing_item: '📦 ของขาด/ไม่ครบ',
          taste_issue: '😕 รสชาติผิดปกติ',
          foreign_object: '⚠️ พบสิ่งแปลกปลอม',
          undercooked: '🔥 อาหารไม่สุก',
          other: '❓ อื่นๆ',
        }
        const timeStr = new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok',
        })
        const msg = `🚨 PROBLEM REPORT — Best Part Cupid\n\nCategory: ${catLabels[category] || category}\nPlatform: ${platform}\nOrder: ${orderNumber.trim()}\nเบอร์: ${phone.trim()}\nข้อความ: ${problemText || '(ไม่มี)'}\n${isCritical ? '\n⚠️ CRITICAL — ต้องโทรกลับภายใน 15 นาที' : '\n⚡ ต้องโทรกลับภายใน 15-20 นาที'}\n\nเวลา: ${timeStr} น.`

        try {
          if (imageFile) {
            const formData = new FormData()
            formData.append('chat_id', '7382574942')
            formData.append('photo', imageFile, imageFile.name)
            formData.append('caption', msg)
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: 'POST',
              body: formData,
            })
          } else {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: '7382574942', text: msg }),
            })
          }
        } catch (e) {
          console.error('Telegram error:', e)
        }
      }

      const { data: feedbackData, error } = await supabase
        .from('cupid_feedback')
        .insert({
          mood: 'problem',
          source: platform.toLowerCase().replace(' ', '_'),
          category: category,
          text: problemText || '',
          phone: phone.trim(),
          order_number: orderNumber.trim(),
          is_critical: isCritical,
          wow_followup_needed: isCritical,
        })
        .select()
        .single()

      if (error) throw error

      if (feedbackData?.id) {
        sessionStorage.setItem('last_feedback_id', feedbackData.id)
      }

      navigate('/problem-closing')
    } catch {
      navigate('/problem-closing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCat = PROBLEM_CATEGORIES.find((c) => c.id === category)

  const sharedCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 20,
    padding: 20,
    margin: '0 16px',
    boxShadow: '0 4px 20px rgba(44,26,14,0.06)',
    border: '1.5px solid rgba(44,26,14,0.06)',
    animation: 'cardSlide 0.3s ease-out',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1.5px solid rgba(44,26,14,0.1)',
    fontFamily: '"Sarabun", system-ui',
    fontSize: 22,
    fontWeight: 500,
    color: '#2C1A0E',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white',
  }

  const nextBtnActive: React.CSSProperties = {
    width: '100%',
    padding: 14,
    borderRadius: 50,
    border: 'none',
    background: '#DC2626',
    color: 'white',
    fontFamily: '"Sarabun", system-ui',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 14,
  }

  const nextBtnInactive: React.CSSProperties = {
    width: '100%',
    padding: 14,
    borderRadius: 50,
    border: 'none',
    background: 'rgba(44,26,14,0.07)',
    color: 'rgba(44,26,14,0.3)',
    fontFamily: '"Sarabun", system-ui',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'not-allowed',
    marginTop: 14,
  }

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
        @keyframes slideIn {
          from { opacity:0; transform:translateX(16px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes grow {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes cardSlide {
          from { opacity:0; transform:translateX(20px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes platformPop {
          0% { transform: scale(1); }
          40% { transform: scale(0.92); }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .phone-input:focus {
          border-color: rgba(220,38,38,0.4) !important;
          outline: none;
        }
        .detail-textarea:focus {
          border-color: rgba(220,38,38,0.3) !important;
          outline: none;
        }
      `}</style>

      {/* ── SCREEN 1: INTERCEPT ── */}
      {screen === 'intercept' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', animation: 'floatChar 3s ease-in-out infinite' }}>
              <MascotBowl size={80} mood="bow" />
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

          {/* FIX 1: Progress bar */}
          <div style={{ width: 120, height: 3, background: 'rgba(44,26,14,0.1)', borderRadius: 2, margin: '16px auto 0', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 2, background: '#DC2626', animation: 'grow 2.5s linear forwards' }} />
          </div>

          <div style={{ flex: 1.5 }} />
        </div>
      )}

      {/* ── SCREEN 2: CATEGORY ── */}
      {screen === 'category' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out' }}>
          <div style={{ padding: '16px 20px' }}>
            <button
              onClick={() => setScreen('intercept')}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", system-ui', fontSize: 20, color: '#2C1A0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ‹
            </button>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginTop: 16 }}>เกิดเรื่องอะไรขึ้นครับ?</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginTop: 4 }}>เลือกที่ใกล้เคียงที่สุดครับ</div>
          </div>

          {/* FIX 2: All cards same style, no badges, no red color */}
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROBLEM_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => { setCategory(cat.id); setScreen('detail') }}
                style={{ background: 'white', borderRadius: 16, padding: '14px 16px', border: '1.5px solid rgba(44,26,14,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E' }}>{cat.label}</div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>{cat.sub}</div>
                </div>
                <span style={{ fontFamily: '"DM Sans", system-ui', fontSize: 20, color: 'rgba(44,26,14,0.2)' }}>›</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />
        </div>
      )}

      {/* ── SCREEN 3: DETAIL (conversational cards) ── */}
      {screen === 'detail' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Sticky header */}
          <div style={{ padding: '16px 20px 0', position: 'sticky', top: 0, background: 'rgba(250,243,232,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
            {/* FIX 5: Back button navigates card step */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <button
                onClick={() => {
                  if (cardStep === 1) setScreen('category')
                  else setCardStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)
                }}
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", system-ui', fontSize: 20, color: '#2C1A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                ‹
              </button>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', borderRadius: 50, padding: '6px 12px', border: '1.5px solid rgba(44,26,14,0.08)' }}>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E' }}>{selectedCat?.label}</span>
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ marginTop: 12, marginBottom: 16, padding: '0 0', display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{ width: 20, height: 4, borderRadius: 2, background: n <= cardStep ? '#DC2626' : 'rgba(44,26,14,0.12)', transition: 'background 0.3s ease' }}
                />
              ))}
            </div>
          </div>

          <div style={{ paddingBottom: 32 }}>
            {/* ── CARD 1: Platform ── */}
            {cardStep === 1 && (
              <div key={1} style={sharedCardStyle}>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 18, color: '#2C1A0E', marginBottom: 16 }}>
                  สั่งผ่านช่องทางไหนครับ?
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPlatform(p)
                        setTimeout(() => setCardStep(2), 280)
                      }}
                      style={{
                        padding: 14,
                        borderRadius: 14,
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: '"Sarabun", system-ui',
                        fontWeight: 700,
                        fontSize: 15,
                        border: 'none',
                        background: platform === p ? '#2C1A0E' : '#F5F0EA',
                        color: platform === p ? 'white' : '#2C1A0E',
                        transform: platform === p ? 'scale(0.97)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                        animation: platform === p ? 'platformPop 0.3s ease-out' : undefined,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── CARD 2: Phone ── */}
            {cardStep === 2 && (
              <div key={2} style={sharedCardStyle}>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 18, color: '#2C1A0E' }}>
                  เบอร์ติดต่อครับ
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginTop: 4, marginBottom: 16 }}>
                  ทีมงานจะโทรกลับหาคุณเองเลยครับ ไม่ต้องรอนาน
                </div>
                <input
                  className="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  style={inputStyle}
                />
                <button
                  onClick={() => { if (phone.trim().length >= 9) setCardStep(3) }}
                  disabled={phone.trim().length < 9}
                  style={phone.trim().length >= 9 ? nextBtnActive : nextBtnInactive}
                >
                  {phone.trim().length >= 9 ? 'ต่อไปครับ →' : 'กรุณากรอกเบอร์ครับ'}
                </button>
              </div>
            )}

            {/* ── CARD 3: Order Number ── */}
            {cardStep === 3 && (
              <div key={3} style={sharedCardStyle}>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 18, color: '#2C1A0E', marginBottom: 8 }}>
                  หมายเลข Order ครับ
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.45)', marginBottom: 4 }}>
                  💡 ช่วยให้ทีมงานเช็คได้ก่อนโทร แก้ได้เร็วขึ้นมากครับ
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.3)', marginBottom: 12 }}>
                  หาได้ใน app ที่สั่งครับ เช่น #GF-XXXXXXX
                </div>
                <input
                  className="phone-input"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="#GF-12345 หรือ LM-98765"
                  style={{ ...inputStyle, fontSize: 18 }}
                />
                <button
                  onClick={() => { if (orderNumber.trim().length > 0) setCardStep(4) }}
                  disabled={orderNumber.trim().length === 0}
                  style={orderNumber.trim().length > 0 ? nextBtnActive : nextBtnInactive}
                >
                  {orderNumber.trim().length > 0 ? 'ต่อไปครับ →' : 'กรุณากรอก Order Number ครับ'}
                </button>
              </div>
            )}

            {/* ── CARD 4: Details (optional) ── */}
            {cardStep === 4 && (
              <div key={4} style={sharedCardStyle}>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 18, color: '#2C1A0E' }}>
                  มีอะไรอยากบอกเพิ่มไหมครับ?
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.4)', marginTop: 4, marginBottom: 14 }}>
                  ไม่บังคับครับ แต่ช่วยได้มาก
                </div>

                <textarea
                  className="detail-textarea"
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="บอกได้เลยครับ ไม่ต้องกลัว"
                  style={{ width: '100%', minHeight: 80, padding: '12px 14px', borderRadius: 14, border: '1.5px solid rgba(44,26,14,0.08)', background: '#FAF3E8', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: '#2C1A0E', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                />

                {/* Photo upload */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', marginBottom: 6 }}>
                    หรือแนบรูปภาพได้เลยครับ
                  </div>
                  {!imagePreview ? (
                    <>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: '#F5F0EA', cursor: 'pointer', border: '1px solid rgba(44,26,14,0.1)' }}
                      >
                        <span>📷</span>
                        <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#2C1A0E' }}>เลือกรูปภาพครับ</span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setImageFile(file)
                          setImagePreview(URL.createObjectURL(file))
                        }}
                      />
                    </>
                  ) : (
                    <div>
                      <img
                        src={imagePreview}
                        alt="preview"
                        style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12, marginTop: 8, display: 'block' }}
                      />
                      <div
                        onClick={() => { setImageFile(null); setImagePreview('') }}
                        style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: '#DC2626', cursor: 'pointer', marginTop: 6 }}
                      >
                        ลบรูปนี้ออกครับ
                      </div>
                    </div>
                  )}
                </div>

                {/* Promise */}
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>⚡</span>
                  <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#E8622A' }}>
                    {isNightTime
                      ? 'ทีมงานจะติดต่อกลับวันพรุ่งนี้ ภายใน 11:30 น. ครับ'
                      : 'ทีมงานรับเรื่องภายใน 15-20 นาทีครับ'}
                  </span>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ marginTop: 14, width: '100%', padding: 15, borderRadius: 50, border: 'none', background: '#DC2626', color: 'white', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'กำลังส่งครับ...' : 'ส่งให้ทีมงานด่วนครับ 🚨'}
                </button>

                {/* Skip link */}
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                  <span
                    onClick={handleSubmit}
                    style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.3)', cursor: 'pointer' }}
                  >
                    ข้ามส่วนนี้และส่งได้เลยครับ →
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </MobileFrame>
  )
}
