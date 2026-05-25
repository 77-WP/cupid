import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotJump } from '../components/Illustrations'
import { BackBtn, C } from '../components/SharedUI'
import { supabase } from '../lib/supabase'

const DELIGHT_CHIPS = [
  { id: 'tasty',     label: 'อร่อยมาก',      emoji: '😋', category: 'food' },
  { id: 'pretty',    label: 'หน้าตาสวย',     emoji: '🎨', category: 'food' },
  { id: 'fast',      label: 'ส่งเร็ว',        emoji: '⚡', category: 'service' },
  { id: 'complete',  label: 'แพ็คมาครบ',     emoji: '📦', category: 'packaging' },
  { id: 'value',     label: 'คุ้มค่า',        emoji: '💚', category: 'food' },
  { id: 'portion',   label: 'ปริมาณพอดี',    emoji: '🍱', category: 'food' },
  { id: 'service',   label: 'บริการดี',       emoji: '🤝', category: 'service' },
  { id: 'repeat',    label: 'อยากสั่งซ้ำ',   emoji: '🔁', category: 'food' },
  { id: 'recommend', label: 'แนะนำได้เลย',   emoji: '📣', category: 'service' },
]

export default function HappyPath() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'delight' | 'loop'>('delight')
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [freeText, setFreeText] = useState('')
  const [proofCard, setProofCard] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProofCard = async (chips: string[]) => {
    const categories = chips
      .map(id => DELIGHT_CHIPS.find(c => c.id === id)?.category)
      .filter(Boolean)

    const categoryCount: Record<string, number> = {}
    categories.forEach(cat => {
      if (cat) categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    const dominantCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0]

    const { data, error } = await supabase
      .from('cupid_joe_mode')
      .select('*')
      .eq('status', 'done')

    if (error || !data || data.length === 0) return

    const categoryKeywords: Record<string, string[]> = {
      food: ['อาหาร', 'เมนู', 'รสชาติ', 'หมู', 'ไก่', 'ข้าว', 'กรอบ', 'ทองคำ'],
      service: ['บริการ', 'เสิร์ฟ', 'ส่ง', 'รถ', 'ทีมงาน'],
      packaging: ['กล่อง', 'บรรจุ', 'eco', 'แพ็ค'],
    }

    const keywords = dominantCategory ? categoryKeywords[dominantCategory] || [] : []

    const matched = data.filter(item =>
      keywords.some(kw =>
        item.title?.toLowerCase().includes(kw.toLowerCase()) ||
        item.summary?.toLowerCase().includes(kw.toLowerCase())
      )
    )

    const pool = matched.length > 0 ? matched : data
    const random = pool[Math.floor(Math.random() * pool.length)]
    setProofCard(random)
  }

  const toggleChip = (id: string) => {
    setSelectedChips(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (selectedChips.length === 0 || isSubmitting) return
    setIsSubmitting(true)

    const insertPayload = {
      mood: 'love',
      source: sessionStorage.getItem('cupid_source') || 'unknown',
      text: JSON.stringify({ chips: selectedChips, message: freeText }),
      category: 'open',
    }

    const { data: insertData, error: insertError } = await supabase
      .from('cupid_feedback')
      .insert(insertPayload)
      .select('id')
      .single()

    if (insertError) console.error('INSERT FAILED:', insertError.message)
    if (insertData?.id) {
      sessionStorage.setItem('last_feedback_id', insertData.id)
    }

    await fetchProofCard(selectedChips)

    setIsSubmitting(false)
    setStep('loop')
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes chipBounce {
          0% { transform: scale(1); }
          40% { transform: scale(0.92); }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes floatChar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseBtn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,98,42,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(232,98,42,0); }
        }
      `}</style>

      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={() => step === 'delight' ? navigate('/landing') : setStep('delight')} />
        </div>

        {step === 'delight' && (
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* A) Character */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <div style={{ animation: 'floatChar 3s ease-in-out infinite' }}>
                <MascotJump size={100} />
              </div>
            </div>

            {/* B) Heading */}
            <div style={{ textAlign: 'center', marginTop: 20, padding: '0 20px' }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: C.brown }}>
                อะไรที่ชอบมากวันนี้ครับ?
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#6B4C2A', opacity: 0.65, marginTop: 4 }}>
                tap ได้มากกว่า 1 อย่างเลยครับ
              </div>
            </div>

            {/* C) Chips */}
            <div style={{ marginTop: 20, padding: '0 20px', display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {DELIGHT_CHIPS.map(chip => {
                const selected = selectedChips.includes(chip.id)
                return (
                  <div
                    key={chip.id}
                    onClick={() => toggleChip(chip.id)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 50,
                      background: selected ? '#E8622A' : 'transparent',
                      border: selected ? '1.5px solid #E8622A' : '1.5px dashed rgba(44,26,14,0.2)',
                      color: selected ? 'white' : '#2C1A0E',
                      fontFamily: '"Sarabun", system-ui',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.2s ease',
                      animation: selected ? 'chipBounce 0.3s ease-out' : undefined,
                    }}
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </div>
                )
              })}
            </div>

            {/* D) Optional text */}
            <div style={{ marginTop: 20, padding: '0 20px' }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#6B4C2A' }}>
                อยากบอกอะไรเพิ่มไหมครับ?
              </div>
              <textarea
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                placeholder="เช่น เมนูที่ชอบ หรืออยากให้มีอะไรเพิ่ม..."
                onFocus={e => { e.currentTarget.style.borderColor = '#E8622A' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(44,26,14,0.1)' }}
                style={{
                  width: '100%',
                  marginTop: 8,
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1.5px solid rgba(44,26,14,0.1)',
                  background: 'white',
                  fontFamily: '"Sarabun", system-ui',
                  fontSize: 14,
                  color: '#2C1A0E',
                  minHeight: 80,
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* E) CTA Button */}
            <div style={{ marginTop: 20, padding: '0 20px 32px' }}>
              {selectedChips.length === 0 ? (
                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: 16,
                    borderRadius: 50,
                    background: 'rgba(44,26,14,0.08)',
                    color: 'rgba(44,26,14,0.3)',
                    fontFamily: '"Sarabun", system-ui',
                    fontWeight: 700,
                    fontSize: 16,
                    border: 'none',
                    cursor: 'not-allowed',
                  }}
                >
                  เลือกสิ่งที่ชอบก่อนนะครับ
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: 16,
                    borderRadius: 50,
                    background: '#E8622A',
                    color: 'white',
                    fontFamily: '"Sarabun", system-ui',
                    fontWeight: 700,
                    fontSize: 16,
                    border: 'none',
                    cursor: isSubmitting ? 'default' : 'pointer',
                    animation: isSubmitting ? undefined : 'pulseBtn 1.5s ease-in-out infinite',
                  }}
                >
                  {isSubmitting ? 'กำลังส่งครับ...' : 'ส่งให้ทีมงาน →'}
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'loop' && (
          <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', animation: 'fadeSlideUp 0.4s ease-out' }}>
            {/* A) Character with sparkles */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ animation: 'floatChar 3s ease-in-out infinite' }}>
                  <MascotJump size={100} />
                </div>
                <span style={{ position: 'absolute', top: -8, left: 20, fontSize: 16, animation: 'fadeSlideUp 0.4s ease-out 0.1s both' }}>✨</span>
                <span style={{ position: 'absolute', top: -8, right: 20, fontSize: 14, animation: 'fadeSlideUp 0.4s ease-out 0.2s both' }}>✨</span>
                <span style={{ position: 'absolute', bottom: 0, right: 10, fontSize: 12, animation: 'fadeSlideUp 0.4s ease-out 0.3s both' }}>✨</span>
              </div>
            </div>

            {/* B) Heading */}
            <div style={{ textAlign: 'center', marginTop: 16, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: '#2C1A0E' }}>
              ได้ยินแล้วครับ 🙏
            </div>

            {/* C) Body */}
            <div style={{ textAlign: 'center', marginTop: 8, padding: '0 24px', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: '#6B4C2A', lineHeight: 1.7 }}>
              feedback ของคุณส่งถึงทีมงาน Best Part โดยตรงเลยครับ
            </div>

            {/* D) Proof Card */}
            {proofCard !== null && (
              <div
                style={{
                  marginTop: 20,
                  padding: '0 20px',
                  animation: 'fadeSlideUp 0.5s ease-out 0.3s both',
                }}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    padding: 16,
                    border: '1.5px solid rgba(232,98,42,0.15)',
                    boxShadow: '0 4px 20px rgba(232,98,42,0.1)',
                  }}
                >
                  {/* Top label */}
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#E8622A', letterSpacing: '0.05em', marginBottom: 12 }}>
                    ✨ เพราะเสียงจากลูกค้าอย่างคุณ
                  </div>

                  {/* Content row */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#FFF3EC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 24, flexShrink: 0,
                      }}
                    >
                      {proofCard.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E' }}>
                        {proofCard.title}
                      </div>
                      <div
                        style={{
                          fontFamily: '"Sarabun", system-ui', fontSize: 12, color: '#6B4C2A',
                          lineHeight: 1.55, marginTop: 4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {proofCard.summary}
                      </div>
                    </div>
                  </div>

                  {/* Mini timeline */}
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8DDD4', flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 2, background: 'linear-gradient(to right, #E8DDD4, #E8622A)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8622A', flexShrink: 0 }} />
                    <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#15803D', marginLeft: 4 }}>
                      ✅ ทำแล้วครับ
                    </span>
                  </div>

                  {/* Card link */}
                  <div
                    onClick={() => navigate('/meunfun')}
                    style={{ marginTop: 12, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#E8622A', cursor: 'pointer' }}
                  >
                    ดูเรื่องราวอื่นๆ →
                  </div>
                </div>
              </div>
            )}

            {/* E) CTA Button */}
            <div style={{ marginTop: 20, padding: '0 20px 40px' }}>
              <button
                onClick={() => navigate('/platform-select')}
                style={{
                  width: '100%',
                  padding: 16,
                  borderRadius: 50,
                  background: '#E8622A',
                  color: 'white',
                  fontFamily: '"Sarabun", system-ui',
                  fontWeight: 700,
                  fontSize: 16,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                รับทราบครับ →
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  )
}
