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

const HAPPY_TEXT_HINTS = [
  'พูดได้เลยครับ ไม่ว่าจะเป็นอะไรก็ตาม',
  'เมนูที่ชอบวันนี้คืออะไรครับ?',
  'มีอะไรอยากให้ทีมงานรู้ไหมครับ?',
  'วันนี้รู้สึกยังไงบ้างครับ?',
  'บอกได้เลยครับ ทีมงานอ่านเองทุกคำ',
]

export default function HappyPath() {
  const navigate = useNavigate()
  const [selectedChips, setSelectedChips] = useState<string[]>([])
  const [freeText, setFreeText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [chipAnimation, setChipAnimation] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % HAPPY_TEXT_HINTS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

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

    setIsSubmitting(false)
    setIsTransitioning(false)
    navigate('/thanks')
  }

  const charAnim =
    selectedChips.length >= 3
      ? 'characterCelebrate 0.6s ease-in-out 1, floatChar 2s ease-in-out infinite 0.6s'
      : selectedChips.length >= 1
      ? 'floatChar 2s ease-in-out infinite'
      : 'floatChar 3s ease-in-out infinite'

  return (
    <MobileFrame>
      <style>{`
        @keyframes jellyPop {
          0%   { transform: scale(1); }
          20%  { transform: scaleX(0.82) scaleY(1.18); }
          40%  { transform: scaleX(1.14) scaleY(0.88); }
          60%  { transform: scaleX(0.94) scaleY(1.06); }
          80%  { transform: scaleX(1.04) scaleY(0.97); }
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
          <BackBtn onClick={() => navigate('/landing')} />
        </div>

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
                      ? 'jellyPop 0.35s ease-out'
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
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.55)' }}>
              หรือจะฝากอะไรไว้ก็ได้เลยครับ
            </div>
            <textarea
              key={hintIndex}
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              placeholder={HAPPY_TEXT_HINTS[hintIndex]}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(232,98,42,0.3)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(44,26,14,0.08)' }}
              style={{
                width: '100%',
                marginTop: 8,
                padding: '14px 16px',
                borderRadius: 16,
                border: '1.5px solid rgba(44,26,14,0.08)',
                background: 'white',
                fontFamily: '"Sarabun", system-ui',
                fontSize: 14,
                color: '#2C1A0E',
                lineHeight: 1.7,
                minHeight: 90,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 2px 8px rgba(44,26,14,0.04)',
                transition: 'border-color 0.2s ease',
              }}
            />
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.35)', textAlign: 'center', marginTop: 8 }}>
              ทีมงานอ่านเองทุกคำครับ 🙏
            </div>
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
      </div>
    </MobileFrame>
  )
}
