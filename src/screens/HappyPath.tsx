import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotJump, ConfettiBurst } from '../components/Illustrations'
import { StatusBar, StepDots, BackBtn, C, useCycle } from '../components/SharedUI'
import { openFrameQuestions } from '../lib/openFrameQuestions'
import { supabase } from '../lib/supabase'

const HINT_TAGS = ['รู้สึกว่า...', 'ชอบมากที่...', 'อยากให้มี...', 'ขอให้...']

function Step1({ onSubmit, onSkip }: { onSubmit: (text: string) => void; onSkip: () => void }) {
  const [text, setText] = useState('')
  const hint = useCycle(openFrameQuestions.happy, 3000)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ConfettiBurst />

      {/* Mascot + heading */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 28px 0', position: 'relative', zIndex: 1 }}>
        <div className="jump-anim"><MascotJump size={130} /></div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 23, color: C.brown, marginTop: 8, textAlign: 'center', lineHeight: 1.3 }}>
          ดีใจมากเลยครับ! <span style={{ color: C.orange }}>❤️</span>
        </div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>
          มีอะไรอยากบอกหรือฝากถึงทีมงานบ้างครับ?
        </div>
      </div>

      {/* Textarea */}
      <div style={{ padding: '14px 16px 0', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={hint}
          style={{
            width: '100%', minHeight: 120, padding: '14px 16px',
            borderRadius: 20, border: 'none',
            background: 'rgba(255,255,255,0.8)',
            boxShadow: '0 2px 16px rgba(44,26,14,0.07)',
            resize: 'none', boxSizing: 'border-box',
            fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown,
            outline: 'none', lineHeight: 1.65, caretColor: C.orange,
          }}
        />

        {/* Hint tags */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {HINT_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setText((s) => s ? s : tag)}
              style={{
                padding: '6px 13px', borderRadius: 999,
                background: 'transparent', border: `1.5px solid ${C.orange}`,
                color: C.orange, fontFamily: '"Sarabun", system-ui',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: '8px 0 8px' }}>
          <button
            onClick={() => onSubmit(text)}
            style={{
              width: '100%', height: 56, borderRadius: 28, border: 'none',
              background: C.orange, color: '#fff',
              fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 8px 20px rgba(232,98,42,0.32)',
            }}
          >
            ส่งให้ทีมงาน
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9h12M10 4l5 5-5 5"/>
            </svg>
          </button>
          <div style={{ textAlign: 'right', marginTop: 8, paddingBottom: 12 }}>
            <button
              onClick={onSkip}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}
            >
              ข้ามครับ →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step2({ done }: { done: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = window.location.origin
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🙏</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown, lineHeight: 1.45 }}>
          ช่วยบอกต่อให้คนที่คุณรักด้วยได้ไหมครับ?
        </div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 10, lineHeight: 1.6 }}>
          ไม่บังคับนะครับ<br/>แค่อยากให้คนดีๆ ได้รู้จัก Best Part
        </div>
        <button
          onClick={handleShare}
          style={{
            marginTop: 24, padding: '12px 24px', borderRadius: 999,
            background: copied ? 'rgba(63,142,92,0.12)' : 'transparent',
            border: `1.5px solid ${copied ? '#3F8E5C' : C.orange}`,
            color: copied ? '#3F8E5C' : C.orange,
            fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 14,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            transition: 'all .2s ease',
          }}
        >
          {copied ? (
            <>✓ คัดลอกแล้วครับ</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="4" cy="8" r="2"/><circle cx="12" cy="3" r="2"/><circle cx="12" cy="13" r="2"/>
                <path d="M6 7l4 -3M6 9l4 3"/>
              </svg>
              คัดลอก link ให้เพื่อน
            </>
          )}
        </button>
      </div>
      <div style={{ padding: '0 16px 22px' }}>
        <button
          onClick={done}
          style={{ width: '100%', height: 52, borderRadius: 26, border: 'none', background: C.brown, color: C.cream, fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
        >
          ข้ามครับ
        </button>
      </div>
    </div>
  )
}

export default function HappyPath() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const back = () => step === 0 ? navigate('/landing') : setStep(0)

  const handleSubmit = async (text: string) => {
    console.log('Submit button clicked')
    const insertPayload = {
      mood: 'love',
      source: sessionStorage.getItem('cupid_source') || 'unknown',
      text: text.trim() || null,
      category: 'open',
    }
    console.log('=== HAPPY PATH SUBMIT ===', insertPayload)
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
    setStep(1)
  }

  const handleSkip = async () => {
    console.log('=== HAPPY PATH SKIP ===')
    const { error } = await supabase.from('cupid_feedback').insert({
      mood: 'love',
      source: sessionStorage.getItem('cupid_source') || 'unknown',
    })
    if (error) console.error('SKIP INSERT FAILED:', error.message)
    setStep(1)
  }

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={back} />
          <div style={{ flex: 1 }}><StepDots step={2} /></div>
          <div style={{ width: 36 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, padding: '8px 0 0' }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ width: 16, height: 3, borderRadius: 2, background: i <= step ? C.orange : 'rgba(44,26,14,0.12)' }} />
          ))}
        </div>
        {step === 0 && <Step1 onSubmit={handleSubmit} onSkip={handleSkip} />}
        {step === 1 && <Step2 done={() => navigate('/thanks')} />}
      </div>
    </MobileFrame>
  )
}
