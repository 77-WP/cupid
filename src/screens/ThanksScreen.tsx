import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBow } from '../components/Illustrations'
import { StatusBar, StepDots, C } from '../components/SharedUI'

const VOTE_OPTIONS = [
  { id: 'A', label: 'ทองหล่อ', sub: 'ใกล้ BTS · พื้นที่ 60 ตร.ม.' },
  { id: 'B', label: 'อารีย์',  sub: 'ใกล้ BTS · พื้นที่ 80 ตร.ม.' },
  { id: 'C', label: 'พระโขนง',sub: 'ใกล้ MRT · พื้นที่ 50 ตร.ม.' },
  { id: 'D', label: 'อ่อนนุช', sub: 'ใกล้ BTS · พื้นที่ 75 ตร.ม.' },
]

export default function ThanksScreen() {
  const navigate = useNavigate()
  const [vote, setVote] = useState<string | null>(null)
  const nickname = localStorage.getItem('cupid_nickname')
  const baseCounts: Record<string, number> = { A: 124, B: 98, C: 67, D: 53 }
  const counts = { ...baseCounts }
  if (vote) counts[vote]++
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <StatusBar />
        <div style={{ padding: '4px 18px 0' }}><StepDots step={3} /></div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 28px 0' }}>
          <div className="bow-anim"><MascotBow size={160} /></div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: C.brown, marginTop: 8, textAlign: 'center', lineHeight: 1.25 }}>
            {nickname ? <>ขอบคุณคุณ{nickname}มากเลยครับ <span style={{ color: C.orange }}>❤︎</span></> : <>ขอบคุณมากเลยครับ <span style={{ color: C.orange }}>❤︎</span></>}
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
            คุณเป็นคนที่ <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, color: C.brown }}>1,247</span> ที่ช่วยให้ Best Part ดีขึ้นครับ
          </div>
        </div>

        {/* Submission confirmation */}
        <div style={{ margin: '16px 22px 0', padding: '12px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.7)', border: '1px dashed rgba(44,26,14,0.18)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: '#E8F2DE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={C.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5L7 12.5L13.5 5"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, fontWeight: 600 }}>ส่งให้ทีมงานแล้ว</div>
            <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, marginTop: 1 }}>#FB-1247 · 18 พ.ค. 21:42</div>
          </div>
        </div>

        {/* Vote / Announcement */}
        <div style={{ margin: '14px 16px 0', padding: 16, borderRadius: 22, background: 'linear-gradient(135deg, #FFF1E2, #FAE0CB)', border: '1.5px solid rgba(232,98,42,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 18 }}>📣</div>
            <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: C.brown }}>มีเรื่องอยากบอก · จากทีมงาน</div>
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, marginTop: 8, lineHeight: 1.35 }}>ช่วยเลือกทำเลสาขาใหม่ให้เราหน่อยได้ไหมครับ?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {VOTE_OPTIONS.map((o) => {
              const on = vote === o.id
              const pct = Math.round((counts[o.id] / total) * 100)
              return (
                <button key={o.id} onClick={() => !vote && setVote(o.id)} disabled={!!vote && !on}
                  style={{ padding: '10px 14px', borderRadius: 14, border: 'none', background: vote ? 'rgba(255,255,255,0.6)' : '#fff', position: 'relative', overflow: 'hidden', cursor: vote ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'left', boxShadow: on ? '0 0 0 2px #E8622A inset' : '0 1px 4px rgba(44,26,14,0.05)', opacity: !!vote && !on ? 0.7 : 1, transition: 'all .25s ease' }}>
                  {vote && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: on ? 'rgba(232,98,42,0.18)' : 'rgba(44,26,14,0.06)', transition: 'width .6s cubic-bezier(.2,.7,.3,1)' }} />}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, flexShrink: 0, background: on ? C.orange : 'transparent', border: `1.5px solid ${on ? C.orange : 'rgba(44,26,14,0.2)'}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 11 }}>
                      {on ? '✓' : o.id}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>{o.label}</div>
                      <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginTop: 1 }}>{o.sub}</div>
                    </div>
                    {vote && <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>{pct}%</div>}
                  </div>
                </button>
              )
            })}
          </div>
          {vote && <div style={{ marginTop: 8, fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, textAlign: 'center' }}>{total.toLocaleString()} คนโหวตแล้ว · ปิดโหวต 31 พ.ค.</div>}
        </div>

        {/* Q&A link */}
        <button onClick={() => navigate('/qa')} style={{ margin: '12px 16px 0', padding: '14px 18px', borderRadius: 20, background: '#fff', border: '1.5px solid rgba(44,26,14,0.08)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: C.orangeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📋</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>ตอบคำถามของสัปดาห์ →</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginTop: 1 }}>30 วินาที · ข้ามได้ทุกเมื่อครับ</div>
          </div>
        </button>

        <div style={{ padding: '12px 24px 6px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, lineHeight: 1.5 }}>ทีมงานจะอ่านข้อความนี้คืนนี้เองครับ 🙏</div>
        </div>

        {/* Personal signature */}
        <div style={{ padding: '16px 24px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.orangeSoft, border: `2px solid ${C.orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍🍳</div>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: '#F2E7D2', border: `2px solid ${C.orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👩‍🍳</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"Caveat", cursive', fontWeight: 600, fontSize: 20, color: C.brown, lineHeight: 1.2 }}>ขอบคุณจากใจจริงครับ 🙏</div>
            <div style={{ fontFamily: '"Caveat", cursive', fontSize: 16, color: C.brownSoft, marginTop: 2 }}>— บอย & นุ้ย, Best Part</div>
          </div>
        </div>

        {/* Small social cards */}
        <div style={{ padding: '8px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button style={{ padding: '12px 12px', borderRadius: 14, background: '#fff', border: '1px solid rgba(44,26,14,0.08)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 18 }}>📱</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 12, color: C.brown }}>ติดตามเมนูใหม่</div>
          </button>
          <button style={{ padding: '12px 12px', borderRadius: 14, background: '#fff', border: '1px solid rgba(44,26,14,0.08)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 18 }}>🍜</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 12, color: C.brown }}>สั่งอาหารรอบหน้า</div>
          </button>
        </div>

        <div style={{ padding: '14px 24px 22px', textAlign: 'center' }}>
          <button onClick={() => navigate('/landing')} style={{ background: 'transparent', border: 'none', color: C.orange, fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4 }}>กลับหน้าแรก</button>
        </div>
      </div>
    </MobileFrame>
  )
}
