import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl } from '../components/Illustrations'
import { supabase } from '../lib/supabase'

const NEUTRAL_HINTS = [
  'พูดได้เลยครับ ไม่ว่าจะเป็นอะไรก็ตาม',
  'วันนี้รู้สึกยังไงบ้างครับ?',
  'มีอะไรที่สังเกตเห็นไหมครับ?',
  'อาหารวันนี้เป็นยังไงบ้างครับ?',
  'มีอะไรอยากให้ทีมงานรู้ไหมครับ?',
  'บอกได้เลยครับ ทีมงานอ่านเองทุกคำ',
]

export default function NeutralPath() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [hintIndex, setHintIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % NEUTRAL_HINTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return
    setIsSubmitting(true)
    try {
      const insertPayload = {
        mood: 'ok',
        text: text.trim(),
        category: 'open',
        source: sessionStorage.getItem('cupid_source') || 'unknown',
      }
      console.log('=== NEUTRAL PATH SUBMIT ===', insertPayload)
      const { data: insertData, error: insertError } = await supabase
        .from('cupid_feedback')
        .insert(insertPayload)
        .select('id')
        .single()
      console.log('Insert result:', insertData, 'Error:', insertError)
      if (insertError) console.error('INSERT FAILED:', insertError.message, insertError.details, insertError.hint)
      if (insertData?.id) {
        sessionStorage.setItem('last_feedback_id', insertData.id)
        console.log('Saved feedback ID:', insertData.id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
      navigate('/thanks')
    }
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes floatChar {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hintFade {
          0%   { opacity: 0; transform: translateY(4px); }
          15%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes pulseBtn {
          0%,100% { box-shadow: 0 0 0 0 rgba(232,98,42,0.35); }
          50%     { box-shadow: 0 0 0 8px rgba(232,98,42,0); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        background: '#FAF3E8',
        padding: 0,
      }}>
        {/* Top spacer */}
        <div style={{ flex: 0.8 }} />

        {/* Character block */}
        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          <div style={{ animation: 'floatChar 3s ease-in-out infinite', display: 'inline-block' }}>
            <MascotBowl size={80} />
          </div>
        </div>

        {/* Heading block */}
        <div style={{
          marginTop: 20, padding: '0 24px', textAlign: 'center',
          animation: 'fadeUp 0.4s ease-out 0.15s both',
        }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: '#2C1A0E' }}>
            ขอบคุณที่แวะมาบอกครับ 🙏
          </div>
          <div style={{ marginTop: 6, fontFamily: '"Sarabun", system-ui', fontSize: 14, color: 'rgba(44,26,14,0.55)', lineHeight: 1.6 }}>
            มีอะไรอยากฝากไว้ให้ทีมงานไหมครับ?
          </div>
        </div>

        {/* Comment box */}
        <div style={{
          marginTop: 24, padding: '0 20px',
          animation: 'fadeUp 0.4s ease-out 0.25s both',
        }}>
          <textarea
            key={hintIndex}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={NEUTRAL_HINTS[hintIndex]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              minHeight: 140,
              padding: 16,
              borderRadius: 18,
              background: 'white',
              border: isFocused
                ? '1.5px solid rgba(232,98,42,0.35)'
                : '1.5px solid rgba(44,26,14,0.08)',
              fontFamily: '"Sarabun", system-ui',
              fontSize: 15,
              color: '#2C1A0E',
              lineHeight: 1.75,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: isFocused
                ? '0 4px 16px rgba(232,98,42,0.1)'
                : '0 2px 12px rgba(44,26,14,0.05)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
          />
          {/* Human note */}
          <div style={{
            marginTop: 10, textAlign: 'center',
            fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.3)',
          }}>
            ทีมงานอ่านเองทุกคำครับ 🙏
          </div>
        </div>

        {/* Middle spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom actions */}
        <div style={{ padding: '0 20px 36px' }}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: 15,
              borderRadius: 50,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : text.trim().length > 0 ? 'pointer' : 'default',
              fontFamily: '"Sarabun", system-ui',
              fontWeight: 700,
              fontSize: 16,
              transition: 'all 0.2s ease',
              background: isSubmitting
                ? 'rgba(232,98,42,0.6)'
                : text.trim().length > 0
                ? '#E8622A'
                : 'rgba(44,26,14,0.07)',
              color: isSubmitting
                ? 'white'
                : text.trim().length > 0
                ? 'white'
                : 'rgba(44,26,14,0.3)',
              animation: !isSubmitting && text.trim().length > 0
                ? 'pulseBtn 1.8s ease-in-out infinite'
                : 'none',
            }}
          >
            {isSubmitting
              ? 'กำลังส่งครับ...'
              : text.trim().length > 0
              ? 'ส่งให้ทีมงาน →'
              : 'พิมพ์อะไรก็ได้เลยครับ'}
          </button>

          <div
            onClick={() => navigate('/thanks')}
            style={{
              marginTop: 12, textAlign: 'center',
              fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.3)',
              cursor: 'pointer',
            }}
          >
            ข้ามได้ครับ →
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
