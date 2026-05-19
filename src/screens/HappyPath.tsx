import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl, MascotJump, DishPhoto, ConfettiBurst } from '../components/Illustrations'
import { StatusBar, StepDots, BackBtn, C, useCycle } from '../components/SharedUI'

const DISHES = [
  { id: 'krapao', name: 'กะเพราหมูสับ', cat: 'จานเดียว', kind: 0 },
  { id: 'krua',   name: 'คั่วพริกเกลือ', cat: 'จานเดียว', kind: 1 },
  { id: 'gai',    name: 'ไก่กรอบ',       cat: 'ของทอด',  kind: 2 },
  { id: 'khana',  name: 'คะน้าหมูกรอบ', cat: 'ผัด',      kind: 3 },
  { id: 'tom',    name: 'ต้มยำกุ้ง',     cat: 'ต้ม/แกง', kind: 4 },
  { id: 'pad',    name: 'ผัดซีอิ๊ว',     cat: 'จานเดียว', kind: 5 },
]
const CATS = ['ทั้งหมด', 'จานเดียว', 'ผัด', 'ของทอด', 'ต้ม/แกง']

function OrangeCTA({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ width: '100%', height: 56, borderRadius: 28, border: 'none', background: C.orange, color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 20px rgba(232,98,42,0.32), inset 0 -2px 0 rgba(0,0,0,0.12)' }}>
      {label}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h12M10 4l5 5-5 5"/></svg>
    </button>
  )
}
function SkipBtn({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 6, paddingBottom: 12 }}>
      <button onClick={onClick} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>ข้ามครับ →</button>
    </div>
  )
}

function HappyDelight({ next }: { next: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ConfettiBurst />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        <div className="jump-anim"><MascotJump size={170} /></div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: C.brown, marginTop: 12, textAlign: 'center', lineHeight: 1.3 }}>
          เยี่ยมเลยครับ!<br/>ดีใจมากที่ได้ยิน <span style={{ color: C.orange }}>❤︎</span>
        </div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 15, color: C.brownSoft, marginTop: 10, textAlign: 'center' }}>เมนูไหนที่ทำให้คุณกลับมาครับ?</div>
      </div>
      <div style={{ padding: '0 16px 22px' }}><OrangeCTA label="เลือกเมนูที่ชอบ" onClick={next} /></div>
    </div>
  )
}

function HappyMenu({ picks, setPicks, next, skip }: { picks: string[]; setPicks: (v: string[]) => void; next: () => void; skip: () => void }) {
  const [cat, setCat] = useState('ทั้งหมด')
  const filtered = DISHES.filter((d) => cat === 'ทั้งหมด' || d.cat === cat)
  const toggle = (id: string) => setPicks(picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id])
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown }}>เมนูที่คุณชอบ</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 2 }}>เลือกได้มากกว่าหนึ่ง</div>
      </div>
      <div className="hscroll" style={{ display: 'flex', gap: 8, padding: '10px 22px 6px', overflowX: 'auto' }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 999, background: cat === c ? C.brown : 'transparent', color: cat === c ? C.cream : C.brown, border: `1.5px solid ${cat === c ? C.brown : 'rgba(44,26,14,0.15)'}`, fontFamily: '"Sarabun", system-ui', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{c}</button>
        ))}
      </div>
      <div style={{ padding: '6px 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {filtered.map((d) => {
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
      <div style={{ padding: '0 16px 8px' }}>
        <OrangeCTA label="ถัดไป" onClick={next} />
        <SkipBtn onClick={skip} />
      </div>
    </div>
  )
}

function HappyVoice({ next, skip }: { next: () => void; skip: () => void }) {
  const [text, setText] = useState('')
  const hints = ['อร่อยมากครับ...', 'ปริมาณเยอะดี...', 'ส่งเร็วครับ...', 'รสชาติดี...']
  const hint = useCycle(hints, 2400)
  const tags = ['อร่อยมาก', 'คุ้มราคา', 'ส่งเร็ว', 'อยากเมนูใหม่']
  const [active, setActive] = useState<string | null>(null)
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown }}>อยากบอกอะไรเพิ่มไหมครับ?</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 2 }}>เลือกหรือพิมพ์ตามใจเลยครับ</div>
      </div>
      <div style={{ padding: '14px 16px 0' }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={hint}
          style={{ width: '100%', minHeight: 110, padding: '14px 16px', borderRadius: 18, border: '1.5px solid rgba(44,26,14,0.1)', background: '#fff', resize: 'none', boxSizing: 'border-box', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown, outline: 'none', lineHeight: 1.4 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {tags.map((t) => {
            const on = active === t
            return (
              <button key={t} onClick={() => { setActive(t); setText((s) => s ? s : `${t} `) }} style={{ padding: '6px 12px', borderRadius: 999, background: on ? C.orange : 'transparent', border: `1.5px solid ${C.orange}`, color: on ? '#fff' : C.orange, fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t}</button>
            )
          })}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 16px 8px' }}>
        <OrangeCTA label="ถัดไป" onClick={next} />
        <SkipBtn onClick={skip} />
      </div>
    </div>
  )
}

function HappyShare({ done }: { done: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
        <MascotBowl size={120} mood="happy" />
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 19, color: C.brown, marginTop: 16, lineHeight: 1.5 }}>ถ้าชอบ ฝากบอกคนที่คุณรักด้วยได้นะครับ 🙏</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 10, lineHeight: 1.5 }}>(ไม่จำเป็นก็ไม่เป็นไรครับ — แค่ขอบคุณที่บอกเราก็มากพอแล้ว)</div>
        <button style={{ marginTop: 24, padding: '10px 20px', borderRadius: 999, background: 'transparent', border: `1.5px solid ${C.orange}`, color: C.orange, fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="4" cy="8" r="2"/><circle cx="12" cy="3" r="2"/><circle cx="12" cy="13" r="2"/><path d="M6 7l4 -3M6 9l4 3"/></svg>
          แชร์ให้เพื่อน
        </button>
      </div>
      <div style={{ padding: '0 16px 22px' }}>
        <button onClick={done} style={{ width: '100%', height: 52, borderRadius: 26, border: 'none', background: C.brown, color: C.cream, fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>เสร็จแล้ว</button>
      </div>
    </div>
  )
}

export default function HappyPath() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState<string[]>([])
  const back = () => step === 0 ? navigate('/landing') : setStep((s) => s - 1)
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
          {[0,1,2,3].map((i) => <div key={i} style={{ width: 16, height: 3, borderRadius: 2, background: i <= step ? C.orange : 'rgba(44,26,14,0.12)' }} />)}
        </div>
        {step === 0 && <HappyDelight next={() => setStep(1)} />}
        {step === 1 && <HappyMenu picks={picks} setPicks={setPicks} next={() => setStep(2)} skip={() => setStep(2)} />}
        {step === 2 && <HappyVoice next={() => setStep(3)} skip={() => setStep(3)} />}
        {step === 3 && <HappyShare done={() => navigate('/thanks')} />}
      </div>
    </MobileFrame>
  )
}
