import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl } from '../components/Illustrations'
import { StatusBar, StepDots, BackBtn, C, useCycle } from '../components/SharedUI'
import { openFrameQuestions } from '../lib/openFrameQuestions'
import { supabase } from '../lib/supabase'

const HINT_TAGS = ['รู้สึกว่า...', 'อยากให้...', 'สังเกตว่า...', 'ขอให้...']

export default function NeutralPath() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const hint = useCycle(openFrameQuestions.neutral, 3000)

  const handleSubmit = async () => {
    console.log('Submit button clicked')
    setSubmitting(true)
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
    navigate('/thanks')
  }

  const handleSkip = () => navigate('/thanks')

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={() => navigate('/landing')} />
          <div style={{ flex: 1 }}><StepDots step={2} /></div>
          <div style={{ width: 36 }} />
        </div>

        {/* Header */}
        <div style={{ padding: '18px 22px 0', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: C.brown, lineHeight: 1.25 }}>
              มีอะไรอยากบอกทีมงานไหมครับ?
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 6, lineHeight: 1.5 }}>
              พูดได้เลยครับ ไม่ว่าจะเป็นอะไรก็ตาม
            </div>
          </div>
          <div style={{ flexShrink: 0, marginTop: 4 }}>
            <MascotBowl size={64} mood="happy" />
          </div>
        </div>

        {/* Textarea */}
        <div style={{ padding: '16px 16px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={hint}
            style={{
              width: '100%', minHeight: 140, padding: '16px 18px',
              borderRadius: 20, border: 'none',
              background: 'rgba(255,255,255,0.75)',
              boxShadow: '0 2px 16px rgba(44,26,14,0.06)',
              resize: 'none', boxSizing: 'border-box',
              fontFamily: '"Sarabun", system-ui', fontSize: 15, color: C.brown,
              outline: 'none', lineHeight: 1.65,
              caretColor: C.orange,
            }}
          />

          {/* Hint tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            {HINT_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setText((s) => s ? s : tag)}
                style={{
                  padding: '7px 14px', borderRadius: 999,
                  background: 'transparent',
                  border: `1.5px solid ${C.orange}`,
                  color: C.orange,
                  fontFamily: '"Sarabun", system-ui', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Footer note */}
          <div style={{ textAlign: 'center', padding: '14px 0 8px' }}>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.4)' }}>
              ทุกข้อความ ทีมงานอ่านเองครับ 🙏
            </div>
          </div>

          {/* Submit */}
          <div style={{ padding: '0 0 8px' }}>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
              style={{
                width: '100%', height: 56, borderRadius: 28, border: 'none',
                background: text.trim() ? C.orange : 'rgba(232,98,42,0.3)',
                color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700,
                fontSize: 17, cursor: text.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: text.trim() ? '0 8px 20px rgba(232,98,42,0.32)' : 'none',
                transition: 'all .2s ease',
              }}
            >
              ส่งให้ทีมงาน
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h12M10 4l5 5-5 5"/>
              </svg>
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, paddingBottom: 16 }}>
              <button
                onClick={handleSkip}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.35)' }}
              >
                ข้ามได้ครับ
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
