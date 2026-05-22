import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { BossAvatar } from '../components/Illustrations'
import { BackBtn, C, useCycle } from '../components/SharedUI'

const answers = [
  { key: 'same',   label: 'เหมือนเดิม', icon: '✅' },
  { key: 'better', label: 'ดีขึ้น',     icon: '📈' },
  { key: 'diff',   label: 'เปลี่ยนไป',  icon: '😕' },
]

export default function QASession() {
  const navigate = useNavigate()
  const [answer, setAnswer] = useState<string | null>(null)
  const [text, setText] = useState('')
  const hint = useCycle(['ยกตัวอย่างได้ไหมครับ...', 'ที่สาขาไหนครับ...', 'เริ่มสังเกตตอนไหน...'], 2400)

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={() => navigate('/thanks')} />
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, flex: 1, textAlign: 'center' }}>WEEKLY · OPTIONAL</div>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ padding: '14px 22px 4px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: C.creamDeep }}>
            <span>📋</span>
            <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, fontWeight: 700, color: C.brown }}>คำถามของสัปดาห์จากทีมงาน</span>
          </div>
        </div>

        <div style={{ margin: '12px 16px 0', padding: 20, borderRadius: 24, background: '#fff', boxShadow: '0 8px 28px rgba(44,26,14,0.08), 0 2px 4px rgba(44,26,14,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <BossAvatar size={44} />
            <div>
              <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 10, color: C.brownSoft, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>ทีมงาน BEST PART</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brown }}>อยากถามตรงๆ ครับ:</div>
            </div>
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown, lineHeight: 1.35 }}>รสชาติยังเหมือนเดิมอยู่ไหมครับ?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {answers.map((a) => {
              const on = answer === a.key
              return (
                <button key={a.key} onClick={() => setAnswer(a.key)}
                  style={{ padding: '11px 16px', borderRadius: 999, background: on ? C.brown : C.cream, border: `1.5px solid ${on ? C.brown : 'rgba(44,26,14,0.1)'}`, color: on ? C.cream : C.brown, fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', transition: 'all .15s ease' }}>
                  <span style={{ fontSize: 16 }}>{a.icon}</span>
                  <span>{a.label}</span>
                  {on && <span style={{ marginLeft: 'auto' }}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.cream} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5L7 12.5L13.5 5"/></svg></span>}
                </button>
              )
            })}
          </div>
          {answer && (
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={hint}
              style={{ width: '100%', minHeight: 56, padding: '12px 14px', marginTop: 12, borderRadius: 14, border: '1.5px solid rgba(44,26,14,0.1)', background: C.cream, resize: 'none', boxSizing: 'border-box', fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, outline: 'none', lineHeight: 1.4 }} />
          )}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ margin: '0 16px 12px', padding: '12px 16px', borderRadius: 16, background: C.creamDeep, fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🔄</span>
          <span>เปลี่ยนคำถามทุก 2 สัปดาห์</span>
        </div>
        <div style={{ padding: '0 16px 8px' }}>
          <button onClick={() => navigate('/joe-mode')} disabled={!answer}
            style={{ width: '100%', height: 56, borderRadius: 28, border: 'none', background: answer ? C.orange : 'rgba(232,98,42,0.3)', color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, cursor: answer ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: answer ? '0 8px 20px rgba(232,98,42,0.32)' : 'none' }}>
            ส่งคำตอบ
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h12M10 4l5 5-5 5"/></svg>
          </button>
          <div style={{ textAlign: 'center', marginTop: 12, paddingBottom: 14 }}>
            <button onClick={() => navigate('/joe-mode')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 14, fontWeight: 600, color: C.brownSoft, padding: '8px 16px' }}>ข้ามได้ครับ →</button>
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
