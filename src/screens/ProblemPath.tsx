import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl } from '../components/Illustrations'
import { supabase } from '../lib/supabase'

const PROBLEM_CATEGORIES = [
  { id: 'wrong_order', label: 'Order ผิด / สลับ', sub: 'ได้รับอาหารที่ไม่ตรงกับที่สั่ง', isCritical: false },
  { id: 'missing_item', label: 'ของขาด / ไม่ครบ', sub: 'มีรายการที่สั่งแต่ไม่ได้รับ', isCritical: false },
  { id: 'taste_issue', label: 'รสชาติผิดปกติ', sub: 'รสชาติไม่เหมือนปกติ หรือผิดสังเกต', isCritical: false },
  { id: 'foreign_object', label: 'พบสิ่งแปลกปลอม', sub: 'พบสิ่งที่ไม่ควรอยู่ในอาหาร', isCritical: true },
  { id: 'undercooked', label: 'อาหารไม่สุก', sub: 'เนื้อสัตว์หรืออาหารสุกไม่พอ', isCritical: true },
  { id: 'other', label: 'อื่นๆ', sub: 'ปัญหาที่ไม่อยู่ในรายการข้างต้น', isCritical: false },
]

const PLATFORMS = ['Grab', 'LINE MAN', 'Shopee Food', 'หน้าร้าน']

const getHeading = (cat: string) => {
  if (cat === 'foreign_object' || cat === 'undercooked')
    return 'เข้าใจเลยครับ ขอรายละเอียดหน่อยนะครับ'
  return 'บอกเราหน่อยนะครับ ว่าเกิดอะไรขึ้น'
}

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

  useEffect(() => {
    const hour = new Date().getHours()
    setIsNightTime(hour >= 22 || hour < 8)
  }, [])

  const canSubmit = platform !== '' && phone.trim().length >= 9 && orderNumber.trim().length > 0

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)

    try {
      let uploadedImageUrl = ''

      if (imageFile) {
        const fileName = `problem-${Date.now()}-${imageFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('problem-reports')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false })

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('problem-reports')
            .getPublicUrl(uploadData.path)
          uploadedImageUrl = urlData?.publicUrl || ''
        }
      }

      const isCritical = ['foreign_object', 'undercooked'].includes(category)

      const { data: feedbackData, error } = await supabase
        .from('cupid_feedback')
        .insert({
          mood: 'problem',
          source: platform.toLowerCase().replace(' ', '_'),
          category: category,
          text: problemText || '',
          phone: phone.trim(),
          order_number: orderNumber.trim(),
          image_url: uploadedImageUrl,
          is_critical: isCritical,
          wow_followup_needed: isCritical,
        })
        .select()
        .single()

      if (error) throw error

      if (feedbackData?.id) {
        sessionStorage.setItem('last_feedback_id', feedbackData.id)
      }

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

      const telegramMsg = `🚨 PROBLEM REPORT — Best Part Cupid\n\nCategory: ${catLabels[category] || category}\nPlatform: ${platform}\nOrder: ${orderNumber.trim()}\nเบอร์: ${phone.trim()}\nข้อความ: ${problemText || '(ไม่มี)'}\n${uploadedImageUrl ? `📸 รูป: ${uploadedImageUrl}\n` : ''}${isCritical ? '\n⚠️ CRITICAL — ต้องโทรกลับภายใน 15 นาที' : '\n⚡ ต้องโทรกลับภายใน 15-20 นาที'}\n\nเวลา: ${timeStr} น.`

      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '7382574942',
            text: telegramMsg,
            parse_mode: 'HTML',
          }),
        }).catch(() => {})
      }

      navigate('/problem-closing')
    } catch {
      navigate('/problem-closing')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCat = PROBLEM_CATEGORIES.find((c) => c.id === category)

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
        @keyframes pulseRed {
          0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(16px); }
          to { opacity:1; transform:translateX(0); }
        }
        .problem-textarea:focus {
          border-color: rgba(220,38,38,0.3) !important;
          outline: none;
        }
      `}</style>

      {/* ── SCREEN 1: INTERCEPT ── */}
      {screen === 'intercept' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }} />

          {/* Character */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', animation: 'floatChar 3s ease-in-out infinite' }}>
              <MascotBowl size={80} mood="bow" />
            </div>
          </div>

          {/* Intercept banner */}
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

          {/* Time-aware promise */}
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

          {/* CTA */}
          <div style={{ padding: '0 20px 36px' }}>
            <button
              onClick={() => setScreen('category')}
              style={{ width: '100%', padding: 16, borderRadius: 50, background: '#DC2626', color: 'white', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', animation: 'pulseRed 2s ease-in-out infinite' }}
            >
              แจ้งปัญหาได้เลยครับ →
            </button>
          </div>
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

          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROBLEM_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => { setCategory(cat.id); setScreen('detail') }}
                style={{ background: 'white', borderRadius: 16, padding: '14px 16px', border: cat.isCritical ? '1.5px solid rgba(220,38,38,0.3)' : '1.5px solid rgba(44,26,14,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
              >
                <div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: cat.isCritical ? '#DC2626' : '#2C1A0E' }}>{cat.label}</div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.45)', marginTop: 3 }}>{cat.sub}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {cat.isCritical && (
                    <div style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 10, padding: '2px 8px', borderRadius: 20 }}>🚨 เร่งด่วน</div>
                  )}
                  <span style={{ fontFamily: '"DM Sans", system-ui', fontSize: 20, color: 'rgba(44,26,14,0.2)' }}>›</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />
        </div>
      )}

      {/* ── SCREEN 3: DETAIL ── */}
      {screen === 'detail' && (
        <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.3s ease-out', overflowY: 'auto' }}>
          {/* Sticky header */}
          <div style={{ padding: '16px 20px 0', position: 'sticky', top: 0, background: 'rgba(250,243,232,0.92)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
            <button
              onClick={() => setScreen('category')}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", system-ui', fontSize: 20, color: '#2C1A0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ‹
            </button>
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', borderRadius: 50, padding: '6px 12px', border: '1.5px solid rgba(44,26,14,0.08)' }}>
              <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E' }}>{selectedCat?.label}</span>
            </div>
            <div style={{ height: 12 }} />
          </div>

          {/* Content */}
          <div style={{ padding: '16px 20px 32px' }}>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E', marginBottom: 4 }}>
              {getHeading(category)}
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.5)', marginBottom: 20 }}>
              เพื่อให้เราแก้ให้ได้ตรงจุดที่สุดครับ
            </div>

            {/* Platform */}
            <div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E', marginBottom: 8 }}>
                สั่งผ่านช่องทางไหนครับ? <span style={{ color: '#DC2626' }}>*</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    style={{ padding: 12, borderRadius: 14, cursor: 'pointer', textAlign: 'center', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, border: 'none', background: platform === p ? '#2C1A0E' : 'white', color: platform === p ? 'white' : '#2C1A0E', boxShadow: platform !== p ? '0 0 0 1.5px rgba(44,26,14,0.08)' : 'none' }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E' }}>เบอร์ติดต่อกลับครับ <span style={{ color: '#DC2626' }}>*</span></span>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: '#DC2626', background: 'rgba(220,38,38,0.07)', padding: '2px 8px', borderRadius: 20 }}>บังคับกรอกครับ</span>
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.45)', marginTop: 3, marginBottom: 8 }}>
                เพื่อให้ทีมงานโทรหาคุณได้เลยครับ ไม่ต้องรอนาน
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08X-XXX-XXXX"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: 'white', border: phone.length > 0 ? '1.5px solid rgba(232,98,42,0.4)' : '1.5px solid rgba(44,26,14,0.1)', fontFamily: '"Sarabun", system-ui', fontSize: 15, color: '#2C1A0E', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Order number */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E' }}>
                หมายเลข Order ครับ <span style={{ color: '#DC2626' }}>*</span>
              </div>
              <div style={{ marginTop: 6, marginBottom: 8, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.55)', lineHeight: 1.6 }}>
                  หมายเลข Order ช่วยให้เราเช็คข้อมูลได้ก่อนโทรหาคุณ ทำให้แก้ปัญหาได้เร็วขึ้นมากครับ
                </span>
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.35)', marginBottom: 8 }}>
                หาได้ใน app ที่สั่งครับ เช่น #GF-XXXXXXX
              </div>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="เช่น #GF-12345 หรือ LM-98765"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: 'white', border: orderNumber.length > 0 ? '1.5px solid rgba(232,98,42,0.4)' : '1.5px solid rgba(44,26,14,0.1)', fontFamily: '"Sarabun", system-ui', fontSize: 15, color: '#2C1A0E', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Problem text */}
            <div style={{ marginTop: 16 }}>
              <div>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E' }}>เกิดอะไรขึ้นครับ?</span>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)', marginLeft: 4 }}>(ไม่บังคับ แต่ช่วยได้มากครับ)</span>
              </div>
              <textarea
                className="problem-textarea"
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder="บอกเราได้เลยครับ ไม่ต้องกลัว"
                style={{ width: '100%', minHeight: 80, marginTop: 8, padding: '12px 14px', borderRadius: 14, background: 'white', border: '1.5px solid rgba(44,26,14,0.08)', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: '#2C1A0E', lineHeight: 1.7, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Photo upload */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E' }}>แนบรูปภาพได้เลยครับ</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)', marginTop: 2, marginBottom: 8 }}>
                (ช่วยให้เราเห็นและแก้ได้ตรงจุดมากขึ้นครับ)
              </div>

              {!imagePreview ? (
                <>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ background: 'white', borderRadius: 14, border: '1.5px dashed rgba(44,26,14,0.15)', padding: 24, textAlign: 'center', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📸</div>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.4)' }}>แตะเพื่อเลือกรูปภาพครับ</div>
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
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 14, border: '1.5px solid rgba(44,26,14,0.08)', display: 'block' }}
                  />
                  <div
                    onClick={() => { setImageFile(null); setImagePreview('') }}
                    style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(220,38,38,0.7)', cursor: 'pointer', marginTop: 8, textAlign: 'center' }}
                  >
                    ✕ เอารูปออกครับ
                  </div>
                </div>
              )}
            </div>

            {/* Promise bar */}
            <div style={{ marginTop: 20, background: 'rgba(232,98,42,0.06)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              {!isNightTime ? (
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#E8622A' }}>ทีมงานรับเรื่องภายใน 15-20 นาทีครับ</span>
              ) : (
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#6B4C2A' }}>ทีมงานจะติดต่อกลับวันพรุ่งนี้ ภายใน 11:30 น. แน่นอนครับ</span>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              style={{ marginTop: 20, width: '100%', padding: 16, borderRadius: 50, border: 'none', background: canSubmit ? '#DC2626' : 'rgba(44,26,14,0.07)', color: canSubmit ? 'white' : 'rgba(44,26,14,0.3)', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
            >
              {canSubmit ? 'ส่งให้ทีมงานด่วนครับ 🚨' : 'กรุณากรอกข้อมูลที่จำเป็นก่อนครับ'}
            </button>
          </div>
        </div>
      )}
    </MobileFrame>
  )
}
