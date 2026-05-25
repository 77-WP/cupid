import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotJump } from '../components/Illustrations'
import { BackBtn, C } from '../components/SharedUI'
import { supabase } from '../lib/supabase'

const DELIGHT_CHIPS = [
  { id: 'tasty',     label: 'อร่อยมาก',      category: 'food' },
  { id: 'pretty',    label: 'หน้าตาสวย',     category: 'food' },
  { id: 'fast',      label: 'ส่งเร็ว',        category: 'service' },
  { id: 'complete',  label: 'แพ็คมาครบ',     category: 'packaging' },
  { id: 'value',     label: 'คุ้มค่า',        category: 'food' },
  { id: 'portion',   label: 'ปริมาณพอดี',    category: 'food' },
  { id: 'service',   label: 'บริการดี',       category: 'service' },
  { id: 'repeat',    label: 'อยากสั่งซ้ำ',   category: 'food' },
  { id: 'recommend', label: 'แนะนำได้เลย',   category: 'service' },
]

const ROTATING_HINTS = [
  'เมนูที่อร่อยที่สุดวันนี้คืออะไรครับ?',
  'มีอะไรที่อยากให้ Best Part ทำเพิ่มไหมครับ?',
  'วันนี้ได้เมนูที่ชอบไหมครับ?',
  'อาหารมาถึงตอนยังร้อนอยู่ไหมครับ?',
  'ถ้าจะแนะนำเพื่อน จะบอกว่าอะไรดีครับ?',
  'มีอะไรที่ทำให้วันนี้ดีขึ้นได้ไหมครับ?',
]

export default function HappyPath() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'delight' | 'loop'>('delight')
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [freeText, setFreeText] = useState('')
  const [proofCard, setProofCard] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [chipAnimation, setChipAnimation] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % ROTATING_HINTS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

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
    const isAdding = !selectedChips.includes(id)
    setSelectedChips(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
    if (isAdding) {
      setChipAnimation(id)
      setTimeout(() => setChipAnimation(null), 350)
    }
  }

  const handleSubmit = async () => {
    if (selectedChips.length === 0 || isSubmitting) return
    setIsSubmitting(true)
    setIsTransitioning(true)

    await new Promise(resolve => setTimeout(resolve, 400))

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
    setIsTransitioning(false)
    setStep('loop')
  }

  const charAnim =
    selectedChips.length >= 3
      ? 'characterCelebrate 0.6s ease-in-out 1, floatChar 2s ease-in-out infinite 0.6s'
      : selectedChips.length >= 1
      ? 'floatChar 2s ease-in-out infinite'
      : 'floatChar 3s ease-in-out infinite'

  let timelineItems: any[] = []
  try {
    if (proofCard && Array.isArray(proofCard.timeline) && proofCard.timeline.length > 0) {
      timelineItems = proofCard.timeline.slice(-2)
    }
  } catch {
    timelineItems = []
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes chipBounce {
          0% { transform: scale(1); }
          30% { transform: scale(0.88); }
          60% { transform: scale(1.1); }
          80% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
        @keyframes chipFlyUp {
          0% { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(0.3) translateY(-60px); opacity: 0; }
        }
        @keyframes characterCelebrate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(-3deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes hintFade {
          0% { opacity: 0; transform: translateY(4px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes sparkleFloat {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.8; }
          50% { transform: scale(1.2) translateY(-4px); opacity: 1; }
        }
        @keyframes proofReveal {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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
              <div style={{ animation: charAnim }}>
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
              {selectedChips.length > 0 && (
                <div style={{
                  marginTop: 6,
                  fontSize: 12,
                  fontFamily: '"Sarabun", system-ui',
                  color: '#E8622A',
                  fontWeight: 600,
                  animation: 'fadeSlideUp 0.2s ease-out',
                }}>
                  เลือกไปแล้ว {selectedChips.length} อย่างครับ{selectedChips.length >= 3 ? ' ✨' : ''}
                </div>
              )}
            </div>

            {/* C) Chips */}
            <div style={{ marginTop: 20, padding: '0 20px', display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {DELIGHT_CHIPS.map(chip => {
                const selected = selectedChips.includes(chip.id)
                const flying = isTransitioning && selected
                const bouncing = chipAnimation === chip.id
                const flyDelay = isTransitioning ? selectedChips.indexOf(chip.id) * 40 + 'ms' : '0ms'
                return (
                  <div
                    key={chip.id}
                    onClick={() => toggleChip(chip.id)}
                    style={{
                      padding: '10px 18px',
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
                      transition: 'all 0.2s ease',
                      animation: flying
                        ? `chipFlyUp 0.4s ease-in both`
                        : bouncing
                        ? 'chipBounce 0.35s ease-out'
                        : 'none',
                      animationDelay: flying ? flyDelay : '0ms',
                    }}
                  >
                    {chip.label}
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
                key={hintIndex}
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                placeholder={ROTATING_HINTS[hintIndex]}
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
                  transition: 'all 0.3s ease',
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
                <div style={{ animation: 'characterCelebrate 0.8s ease-out, floatChar 3s ease-in-out 0.8s infinite' }}>
                  <MascotJump size={100} />
                </div>
                <span style={{ position: 'absolute', top: -8, left: 20, fontSize: 16, animation: 'sparkleFloat 2s ease-in-out infinite' }}>✨</span>
                <span style={{ position: 'absolute', top: -8, right: 20, fontSize: 14, animation: 'sparkleFloat 2.4s ease-in-out 0.3s infinite' }}>✨</span>
                <span style={{ position: 'absolute', bottom: 0, right: 10, fontSize: 12, animation: 'sparkleFloat 1.8s ease-in-out 0.6s infinite' }}>✨</span>
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
              <div style={{ marginTop: 20, animation: 'proofReveal 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}>
                <div style={{
                  background: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(232,98,42,0.12)',
                  boxShadow: '0 8px 32px rgba(232,98,42,0.12)',
                  margin: '0 20px',
                }}>
                  {/* Hero area */}
                  <div style={{
                    height: 110,
                    background: 'linear-gradient(135deg, #FFF3EC, #FDEBD0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 16,
                      background: 'rgba(232,98,42,0.1)',
                      border: '2px dashed rgba(232,98,42,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, color: 'rgba(232,98,42,0.4)', fontFamily: '"DM Sans", system-ui',
                    }}>
                      img
                    </div>
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: '#DCFCE7', color: '#15803D',
                      fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11,
                      padding: '4px 10px', borderRadius: 20,
                    }}>
                      ✅ ทำแล้วครับ
                    </div>
                  </div>

                  {/* Content area */}
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#E8622A', letterSpacing: '0.06em', marginBottom: 8 }}>
                      ✨ เพราะเสียงจากลูกค้าอย่างคุณ
                    </div>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 18, color: '#2C1A0E', lineHeight: 1.25, marginBottom: 6 }}>
                      {proofCard.title}
                    </div>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#6B4C2A', lineHeight: 1.65, marginBottom: 14 }}>
                      {proofCard.story_text
                        ? proofCard.story_text.slice(0, 80) + (proofCard.story_text.length > 80 ? '...' : '')
                        : proofCard.summary}
                    </div>

                    {/* Timeline items */}
                    {timelineItems.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        {timelineItems.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                            <div style={{
                              width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                              background: idx === timelineItems.length - 1 ? '#E8622A' : '#D4C4B0',
                            }} />
                            <div>
                              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: '#6B4C2A', opacity: 0.6 }}>
                                {item.date}
                              </div>
                              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: '#2C1A0E', lineHeight: 1.5 }}>
                                {item.note}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ height: 1, background: 'rgba(44,26,14,0.06)', marginBottom: 12 }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div
                        onClick={() => navigate('/meunfun')}
                        style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#E8622A', cursor: 'pointer' }}
                      >
                        ดูเรื่องราวอื่นๆ →
                      </div>
                      {proofCard.inspired_by_nickname && (
                        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)' }}>
                          โดย {proofCard.inspired_by_nickname}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* E) CTA Button */}
            <div style={{ marginTop: 20, padding: '0 20px 40px' }}>
              <button
                onClick={() => navigate('/thanks')}
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
