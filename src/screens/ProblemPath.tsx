import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotWorried, DishPhoto, BossAvatar } from '../components/Illustrations'
import { StatusBar, StepDots, BackBtn, C } from '../components/SharedUI'

const PROBLEM_CATS = [
  { id: 'wrong',   icon: '📋', label: 'Order ผิด' },
  { id: 'missing', icon: '🕳️', label: 'ขาดตกหล่น' },
  { id: 'taste',   icon: '😕', label: 'รสชาติไม่ปกติ' },
  { id: 'quality', icon: '📉', label: 'คุณภาพอาหาร' },
  { id: 'foreign', icon: '⚠️', label: 'สิ่งแปลกปลอม' },
  { id: 'contact', icon: '📞', label: 'ติดต่อทีมงาน' },
]
const DISHES = [
  { id: 'krapao', name: 'กะเพราหมูสับ', kind: 0 },
  { id: 'krua',   name: 'คั่วพริกเกลือ', kind: 1 },
  { id: 'gai',    name: 'ไก่กรอบ',      kind: 2 },
  { id: 'khana',  name: 'คะน้าหมูกรอบ', kind: 3 },
  { id: 'tom',    name: 'ต้มยำกุ้ง',    kind: 4 },
  { id: 'pad',    name: 'ผัดซีอิ๊ว',    kind: 5 },
]

function ProblemIntercept({ next }: { next: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
        <div className="worry-anim"><MascotWorried size={140} /></div>
        <div style={{ marginTop: 16, padding: '20px 22px', borderRadius: 24, width: '100%', boxSizing: 'border-box', background: 'linear-gradient(135deg, #FFF1E2, #FAE0CB)', border: '1.5px solid rgba(232,98,42,0.25)' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: C.brown, textAlign: 'center', lineHeight: 1.3 }}>โอ้โห เกิดอะไรขึ้นเหรอครับ? 😟</div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown, marginTop: 12, lineHeight: 1.55, textAlign: 'center' }}>ก่อนจะรีวิวในแอพ ให้โอกาสเราแก้ไขก่อนได้เลยนะครับ</div>
          <div style={{ margin: '14px 0', height: 1, background: 'rgba(44,26,14,0.12)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>⚡</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, lineHeight: 1.4 }}>ทีมงานจะรับเรื่องและติดต่อกลับ<br/>ภายใน <b>2 ชั่วโมง</b> ครับ 🙏</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 0 22px' }}>
        <button onClick={next} style={{ width: '100%', height: 56, borderRadius: 28, border: 'none', background: C.orange, color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 20px rgba(232,98,42,0.32)' }}>
          บอกเราได้เลยครับ
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h12M10 4l5 5-5 5"/></svg>
        </button>
      </div>
    </div>
  )
}

function ProblemCategories({ onCat }: { onCat: (id: string) => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown }}>เกิดเรื่องอะไรขึ้นครับ?</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 2 }}>เลือกประเภทใกล้เคียงที่สุด</div>
      </div>
      <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {PROBLEM_CATS.map((c) => (
          <button key={c.id} onClick={() => onCat(c.id)}
            style={{ padding: '18px 14px', borderRadius: 18, background: '#fff', border: '1.5px solid rgba(44,26,14,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', minHeight: 100, boxShadow: '0 2px 8px rgba(44,26,14,0.04)', transition: 'all .15s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.orange; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(44,26,14,0.08)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}>
            <div style={{ fontSize: 26 }}>{c.icon}</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown }}>{c.label}</div>
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ margin: '0 16px 22px', padding: '12px 16px', borderRadius: 16, background: C.creamDeep, fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, textAlign: 'center' }}>ขอบคุณที่ให้โอกาสเราแก้ไขครับ 🙏</div>
    </div>
  )
}

function ProblemDetail({ catId, done }: { catId: string; done: () => void }) {
  const [sel, setSel] = useState<string[]>([])
  const [note, setNote] = useState('')
  const toggle = (id: string) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id])
  const cat = PROBLEM_CATS.find((c) => c.id === catId)
  const ready = sel.length > 0 || note.length > 0
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: C.orangeSoft, border: `1px solid ${C.orange}` }}>
          <span>{cat?.icon}</span>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 700, color: C.brown }}>{cat?.label}</span>
        </div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: C.brown, marginTop: 10 }}>เมนูไหนมีปัญหาครับ?</div>
      </div>
      <div style={{ padding: '10px 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {DISHES.map((d) => {
          const on = sel.includes(d.id)
          return (
            <button key={d.id} onClick={() => toggle(d.id)} style={{ padding: 8, borderRadius: 16, background: '#fff', border: `2px solid ${on ? C.orange : 'rgba(44,26,14,0.08)'}`, position: 'relative', cursor: 'pointer', fontFamily: 'inherit', boxShadow: on ? '0 6px 18px rgba(232,98,42,0.2)' : '0 2px 6px rgba(44,26,14,0.04)' }}>
              <DishPhoto kind={d.kind} size={88} />
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 12, color: C.brown, marginTop: 6, lineHeight: 1.2, minHeight: 28 }}>{d.name}</div>
              {on && <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6.5L5 9.5L10.5 3"/></svg></div>}
            </button>
          )
        })}
      </div>
      <div style={{ padding: '4px 16px 0' }}>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="บอกรายละเอียดได้เลยครับ — เป็นยังไง?"
          style={{ width: '100%', minHeight: 70, padding: '12px 14px', borderRadius: 18, border: '1.5px solid rgba(44,26,14,0.1)', background: '#fff', resize: 'none', boxSizing: 'border-box', fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown, outline: 'none', lineHeight: 1.4 }} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ margin: '8px 16px 12px', padding: '12px 16px', borderRadius: 20, background: '#FFF1E2', border: `1px dashed ${C.orange}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 18 }}>⚡</div>
        <div style={{ flex: 1, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>ทีมงานรับเรื่องภายใน 2 ชั่วโมง</div>
      </div>
      <div style={{ padding: '0 16px 22px' }}>
        <button onClick={done} disabled={!ready}
          style={{ width: '100%', height: 56, borderRadius: 28, border: 'none', background: ready ? C.orange : 'rgba(232,98,42,0.3)', color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, cursor: ready ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: ready ? '0 8px 20px rgba(232,98,42,0.32)' : 'none' }}>
          ส่งให้ทีมงาน
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h12M10 4l5 5-5 5"/></svg>
        </button>
      </div>
    </div>
  )
}

function ProblemContact({ done }: { done: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
      <div style={{ padding: '8px 6px 0' }}>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: C.brown }}>ติดต่อทีมงานโดยตรง</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 4 }}>เราพร้อมรับสายและตอบกลับครับ</div>
      </div>
      <div style={{ marginTop: 16, padding: 18, borderRadius: 22, background: '#fff', boxShadow: '0 6px 24px rgba(44,26,14,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BossAvatar size={48} />
          <div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown }}>ทีมงาน Best Part</div>
            <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, marginTop: 2 }}>online · ตอบใน 1h 24m เฉลี่ย</div>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: '💬', label: 'LINE @bestpart', detail: 'แชทตอบเร็วที่สุด', big: true },
            { icon: '📞', label: '02-555-2438', detail: 'จ.-ส. 10:00-22:00', big: false },
            { icon: '✉️', label: 'hi@bestpart.co', detail: 'สำหรับเรื่องด่วน', big: false },
          ].map((r) => (
            <button key={r.label} style={{ padding: '14px 14px', borderRadius: 16, background: r.big ? '#06C755' : C.cream, color: r.big ? '#fff' : C.brown, border: r.big ? 'none' : '1.5px solid rgba(44,26,14,0.1)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
              <div style={{ fontSize: 18 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15 }}>{r.label}</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, opacity: 0.85, marginTop: 1 }}>{r.detail}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 2l5 5-5 5"/></svg>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 0 22px' }}>
        <button onClick={done} style={{ width: '100%', height: 52, borderRadius: 26, border: 'none', background: C.brown, color: C.cream, fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>กลับหน้าแรก</button>
      </div>
    </div>
  )
}

export default function ProblemPath() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [catId, setCatId] = useState('')
  const back = () => {
    if (step === 0) return navigate('/landing')
    if (step === 2 || step === 3) return setStep(1)
    setStep((s) => s - 1)
  }
  const pickCat = (id: string) => { setCatId(id); setStep(id === 'contact' ? 3 : 2) }
  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={back} />
          <div style={{ flex: 1 }}><StepDots step={2} /></div>
          <div style={{ width: 36 }} />
        </div>
        {step === 0 && <ProblemIntercept next={() => setStep(1)} />}
        {step === 1 && <ProblemCategories onCat={pickCat} />}
        {step === 2 && <ProblemDetail catId={catId} done={() => navigate('/thanks')} />}
        {step === 3 && <ProblemContact done={() => navigate('/landing')} />}
      </div>
    </MobileFrame>
  )
}
