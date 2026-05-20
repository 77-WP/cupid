import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl, DishPhoto } from '../components/Illustrations'
import { StatusBar, StepDots, BackBtn, C, useCycle } from '../components/SharedUI'
import { openFrameQuestions } from '../lib/openFrameQuestions'

const NEUTRAL_CATS = [
  { id: 'taste',    icon: '🍜', label: 'รสชาติ',      sub: 'เข้ม/อ่อน/แตกต่าง' },
  { id: 'portion',  icon: '📦', label: 'ปริมาณ',      sub: 'มาก/น้อยกว่าปกติ' },
  { id: 'delivery', icon: '🚚', label: 'การจัดส่ง',   sub: 'เวลา/ผู้ส่ง' },
  { id: 'package',  icon: '📋', label: 'บรรจุภัณฑ์',  sub: 'กล่อง/ถุง/ช้อน' },
  { id: 'other',    icon: '💭', label: 'อื่นๆ',       sub: 'ความคิดอะไรก็ได้' },
]
const DISHES = [
  { id: 'krapao', name: 'กะเพราหมูสับ', kind: 0 },
  { id: 'krua',   name: 'คั่วพริกเกลือ', kind: 1 },
  { id: 'gai',    name: 'ไก่กรอบ',      kind: 2 },
  { id: 'khana',  name: 'คะน้าหมูกรอบ', kind: 3 },
  { id: 'tom',    name: 'ต้มยำกุ้ง',    kind: 4 },
  { id: 'pad',    name: 'ผัดซีอิ๊ว',    kind: 5 },
]

function NeutralCategory({ pickCat }: { pickCat: (id: string) => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 22px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: C.brown, lineHeight: 1.25 }}>มีอะไรอยากบอกทีมงานไหมครับ?</div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 4 }}>เลือกหัวข้อที่ใกล้เคียงที่สุด</div>
        </div>
        <MascotBowl size={64} mood="happy" />
      </div>
      <div style={{ padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {NEUTRAL_CATS.map((c) => (
          <button key={c.id} onClick={() => pickCat(c.id)}
            style={{ padding: '14px 16px', borderRadius: 18, background: '#fff', border: '1.5px solid rgba(44,26,14,0.08)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', boxShadow: '0 2px 8px rgba(44,26,14,0.04)', transition: 'all .15s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.orange }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(44,26,14,0.08)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.orangeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown }}>{c.label}</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 1 }}>{c.sub}</div>
            </div>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={C.brownSoft} strokeWidth="2.4" strokeLinecap="round"><path d="M5 2l5 5-5 5"/></svg>
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ margin: '0 16px 22px', padding: '12px 16px', borderRadius: 16, background: C.creamDeep, fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, textAlign: 'center' }}>
        ทุกข้อความ ทีมงานอ่านเองครับ 🙏
      </div>
    </div>
  )
}

function NeutralText({ catId, text, setText, nickname, setNickname, next, skip }: { catId: string; text: string; setText: (v: string) => void; nickname: string; setNickname: (v: string) => void; next: () => void; skip: () => void }) {
  const cat = NEUTRAL_CATS.find((c) => c.id === catId) || NEUTRAL_CATS[0]
  const hint = useCycle(openFrameQuestions.neutral, 3000)
  const tagList = ['รสชาติ', 'ปริมาณ', 'บรรจุภัณฑ์', 'อื่นๆ']
  const toMenu = catId === 'taste' || catId === 'portion'
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: C.orangeSoft, border: `1px solid ${C.orange}` }}>
          <span>{cat.icon}</span>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 700, color: C.brown }}>{cat.label}</span>
        </div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown, marginTop: 10, lineHeight: 1.25 }}>เล่าให้เราฟังหน่อยครับ</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 2 }}>พิมพ์อะไรก็ได้ — ทีมงานอ่านเองครับ</div>
      </div>
      <div style={{ padding: '14px 16px 0' }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={hint}
          style={{ width: '100%', minHeight: 120, padding: '14px 16px', borderRadius: 18, border: '1.5px solid rgba(44,26,14,0.1)', background: '#fff', resize: 'none', boxSizing: 'border-box', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown, outline: 'none', lineHeight: 1.5 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {tagList.map((t) => (
            <button key={t} onClick={() => setText(text ? `${text}\n#${t} ` : `#${t} `)}
              style={{ padding: '6px 12px', borderRadius: 999, background: 'transparent', border: `1.5px solid ${C.orange}`, color: C.orange, fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t}</button>
          ))}
        </div>
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="ชื่อเล่นของคุณ (ไม่บังคับ)"
          style={{ width: '100%', marginTop: 10, padding: '12px 16px', borderRadius: 14, border: '1.5px solid rgba(44,26,14,0.1)', background: '#fff', boxSizing: 'border-box', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown, outline: 'none' }} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 16px 8px' }}>
        <button onClick={next} disabled={!text}
          style={{ width: '100%', height: 56, borderRadius: 28, border: 'none', background: text ? C.orange : 'rgba(232,98,42,0.3)', color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, cursor: text ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: text ? '0 8px 20px rgba(232,98,42,0.32)' : 'none' }}>
          {toMenu ? 'ถัดไป' : 'ส่งให้ทีมงาน'}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h12M10 4l5 5-5 5"/></svg>
        </button>
        <div style={{ textAlign: 'right', marginTop: 8, paddingBottom: 12 }}>
          <button onClick={skip} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>ข้ามได้ครับ →</button>
        </div>
      </div>
    </div>
  )
}

function NeutralMenu({ catId, done, skip }: { catId: string; done: () => void; skip: () => void }) {
  const cat = NEUTRAL_CATS.find((c) => c.id === catId) || NEUTRAL_CATS[0]
  const [picks, setPicks] = useState<string[]>([])
  const toggle = (id: string) => setPicks(picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id])
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: C.orangeSoft, border: `1px solid ${C.orange}` }}>
          <span>{cat.icon}</span>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 700, color: C.brown }}>{cat.label}</span>
        </div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown, marginTop: 10 }}>เมนูไหนที่หมายถึงครับ?</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 2 }}>เลือกได้มากกว่าหนึ่ง · ข้ามได้ครับ</div>
      </div>
      <div style={{ padding: '14px 18px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {DISHES.map((d) => {
          const on = picks.includes(d.id)
          return (
            <button key={d.id} onClick={() => toggle(d.id)} style={{ padding: 8, borderRadius: 16, background: '#fff', border: `2px solid ${on ? C.orange : 'rgba(44,26,14,0.08)'}`, position: 'relative', cursor: 'pointer', fontFamily: 'inherit', boxShadow: on ? '0 6px 18px rgba(232,98,42,0.2)' : '0 2px 6px rgba(44,26,14,0.04)', transition: 'all .18s ease' }}>
              <DishPhoto kind={d.kind} size={88} />
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 12, color: C.brown, marginTop: 6, lineHeight: 1.2, minHeight: 28 }}>{d.name}</div>
              {on && <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6.5L5 9.5L10.5 3"/></svg></div>}
            </button>
          )
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '8px 16px 8px' }}>
        <button onClick={done} style={{ width: '100%', height: 56, borderRadius: 28, border: 'none', background: C.orange, color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 20px rgba(232,98,42,0.32)' }}>
          ส่งให้ทีมงาน
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h12M10 4l5 5-5 5"/></svg>
        </button>
        <div style={{ textAlign: 'right', marginTop: 8, paddingBottom: 12 }}>
          <button onClick={skip} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>ข้ามได้ครับ →</button>
        </div>
      </div>
    </div>
  )
}

export default function NeutralPath() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [catId, setCatId] = useState('')
  const [text, setText] = useState('')
  const [nickname, setNickname] = useState(() => localStorage.getItem('cupid_nickname') || '')
  const hasMenuStep = catId === 'taste' || catId === 'portion'
  const totalSteps = hasMenuStep ? 3 : 2
  const back = () => step === 0 ? navigate('/landing') : setStep((s) => s - 1)
  const pickCat = (id: string) => { setCatId(id); setStep(1) }
  const afterText = () => {
    if (nickname.trim()) localStorage.setItem('cupid_nickname', nickname.trim())
    if (hasMenuStep) setStep(2); else navigate('/thanks')
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
          {Array.from({ length: totalSteps }).map((_, i) => <div key={i} style={{ width: 16, height: 3, borderRadius: 2, background: i <= step ? C.orange : 'rgba(44,26,14,0.12)' }} />)}
        </div>
        {step === 0 && <NeutralCategory pickCat={pickCat} />}
        {step === 1 && <NeutralText catId={catId} text={text} setText={setText} nickname={nickname} setNickname={setNickname} next={afterText} skip={() => { if (nickname.trim()) localStorage.setItem('cupid_nickname', nickname.trim()); if (hasMenuStep) setStep(2); else navigate('/thanks') }} />}
        {step === 2 && <NeutralMenu catId={catId} done={() => navigate('/thanks')} skip={() => navigate('/thanks')} />}
      </div>
    </MobileFrame>
  )
}
