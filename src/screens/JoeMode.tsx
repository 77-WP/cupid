import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { HeroCar, HeroStar, HeroPork } from '../components/Illustrations'
import { StatusBar, BackBtn, C } from '../components/SharedUI'

const ARTICLES = [
  {
    id: 'car', emoji: '🚗', tag: 'New service',
    title: 'เสิร์ฟที่รถ', sub: 'ของใหม่ตามคำขอของลูกค้าที่มีน้องในรถ',
    by: 'คุณตูน', when: '2 สัปดาห์ก่อน', hero: 'car' as const,
    body: [
      'วันที่ 28 เมษา คุณตูนเขียนเข้ามาว่า:',
      '"พามาเที่ยวกับน้องหมาและลูกครับ — ขอจอดหน้าร้านแล้วทีมงานเดินมาส่งได้ไหม? ลงรถลำบาก"',
      'พวกเราคุยกันคืนนั้นเลยครับ — มันคือเรื่องเล็กแต่สำคัญมาก เพราะคนที่มีลูกเล็ก หรือมีน้องที่ไม่อยากทิ้งในรถคนเดียว ก็เป็นพวกเราเองด้วย',
      'สามวันต่อมา เราทดลองเปิด "เสิร์ฟที่รถ" ทุกสาขา ไม่มีค่าใช้จ่ายเพิ่ม กดในแอพ Best Part ก่อนถึงร้าน 5 นาทีครับ',
      'ขอบคุณคุณตูนที่บอกเรานะครับ ❤︎',
    ],
  },
  {
    id: 'you', emoji: '🌟', tag: 'Personalization',
    title: "You're Best Part Session", sub: 'จดจำสิ่งที่คุณชอบ — เผ็ดน้อย ไม่ใส่ผัก ฯลฯ',
    by: 'คุณนัท', when: '1 เดือนก่อน', hero: 'star' as const,
    body: [
      'เมื่อก่อนเวลาสั่ง คุณนัทต้องพิมพ์ "เผ็ดน้อย ไม่ใส่ผักคะน้า กล่องแยก" ทุกครั้ง — แล้วบางทีเราก็ลืม',
      'เราเลยสร้าง "You\'re Best Part Session" — โปรไฟล์ส่วนตัวของคุณ ที่จดจำว่าคุณชอบและไม่ชอบอะไร พอกดสั่งครั้งถัดไป ทีมครัวเห็นเป็นอันแรก',
      'มันไม่ใช่ AI ลึกซึ้งอะไรหรอกครับ — แค่หมายเหตุที่ทีมงานเห็นทุกคน รวมถึงน้องส่งของด้วย',
      'ตอนนี้มีคน 2,800 คนเปิดใช้แล้ว เผื่อใครอยากลอง ไปที่หน้า Profile → "ของฉัน" ครับ',
    ],
  },
  {
    id: 'pork', emoji: '🥩', tag: 'R&D',
    title: 'หมูกรอบทองคำ', sub: '6 เดือนกับสูตรหมูกรอบที่กรอบนานขึ้น',
    by: 'คุณปอ + อีก 47 คน', when: 'เริ่ม 6 เดือนก่อน', hero: 'pork' as const,
    handwriting: true,
    body: [
      'ครั้งแรกที่ได้ยินคำว่า "หมูกรอบของพี่ไม่กรอบเหมือนเดิม" — เป็นความรู้สึกที่หายใจไม่ออกเลยครับ',
      'พวกเราใช้สูตรเดียวกันมา 4 ปี แต่หมูที่ตลาดเปลี่ยน น้ำมันเปลี่ยน อากาศบ้านเราก็เปลี่ยน',
      '6 เดือนที่ผ่านมาเราลองสูตรใหม่ 23 ครั้ง — น้ำมันมะพร้าวสกัดเย็น ทอด 2 รอบ พักให้สะเด็ดน้ำ 8 นาที',
      'จนเมื่อสัปดาห์ที่แล้ว คุณปอเขียนกลับมาว่า "กรอบกว่าเดิมอีกนะ"',
      'นั่นแหละครับ — คือสิ่งที่ทำให้เราตื่นมาทำงานทุกวัน',
      '— ทีมงาน Best Part',
    ],
  },
]

type Article = typeof ARTICLES[number]

function ArticleView({ a, onBack }: { a: Article; onBack: () => void }) {
  const Hero = a.hero === 'car' ? HeroCar : a.hero === 'star' ? HeroStar : HeroPork
  const fontStack = a.handwriting ? '"Caveat", "Sarabun", cursive' : '"Sarabun", system-ui'
  return (
    <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
        <BackBtn onClick={onBack} />
        <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, flex: 1, textAlign: 'center' }}>STORY</div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ margin: '12px 16px 0', borderRadius: 22, background: 'linear-gradient(135deg, #FFF1E2, #FAE0CB)', padding: '20px 16px', display: 'flex', justifyContent: 'center' }}>
        <Hero size={220} />
      </div>
      <div style={{ padding: '14px 22px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, background: C.brown, color: C.cream, fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          {a.emoji} {a.tag}
        </div>
        <div style={{ fontFamily: fontStack, fontWeight: a.handwriting ? 600 : 700, fontSize: a.handwriting ? 30 : 24, color: C.brown, marginTop: 10, lineHeight: 1.2 }}>{a.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: C.orange, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
            {a.by.replace('คุณ', '').charAt(0)}
          </span>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>Inspired by <b style={{ color: C.brown }}>{a.by}</b> · {a.when}</div>
        </div>
      </div>
      <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {a.body.map((p, i) => (
          <div key={i} style={{ fontFamily: fontStack, fontSize: a.handwriting ? 18 : 14, color: C.brown, lineHeight: a.handwriting ? 1.55 : 1.65, fontWeight: a.handwriting ? 500 : 400 }}>{p}</div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 14 }} />
      <div style={{ margin: '16px 16px 22px', padding: '14px 16px', borderRadius: 18, background: '#fff', border: '1px dashed rgba(44,26,14,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: '#E8F2DE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={C.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5L7 12.5L13.5 5"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>ทำแล้วครับ</div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginTop: 1 }}>มีใช้ทุกสาขาตั้งแต่ {a.when}</div>
        </div>
      </div>
    </div>
  )
}

export default function JoeMode() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [annOpen, setAnnOpen] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(null)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])

  const article = articleId ? ARTICLES.find((a) => a.id === articleId) : null

  if (article) {
    return <MobileFrame><ArticleView a={article} onBack={() => setArticleId(null)} /></MobileFrame>
  }

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={() => navigate('/qa')} />
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>JOE MODE</div>
          <div style={{ width: 36 }} />
        </div>
        <div style={{ padding: '10px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22 }}>💘</span>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: C.brown, lineHeight: 1.2 }}>เรื่องที่เราทำ</div>
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 4 }}>เบื้องหลังคำขอของคุณและเพื่อนๆ</div>
        </div>
        <div style={{ padding: '10px 16px 0', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}>
          {ARTICLES.map((a, i) => (
            <button key={a.id} onClick={() => setArticleId(a.id)} style={{ padding: 14, borderRadius: 18, background: '#fff', border: '1.5px solid rgba(44,26,14,0.06)', boxShadow: '0 2px 8px rgba(44,26,14,0.04)', display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transform: mounted ? 'translateY(0)' : 'translateY(20px)', opacity: mounted ? 1 : 0, transition: `all .5s cubic-bezier(.2,.7,.3,1) ${i * 90}ms` }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: C.orangeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>{a.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, background: C.creamDeep, fontFamily: '"DM Sans", system-ui', fontSize: 9, fontWeight: 700, color: C.brownSoft, letterSpacing: 0.6, textTransform: 'uppercase' }}>{a.tag}</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown, marginTop: 4, lineHeight: 1.3 }}>{a.title}</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 2, lineHeight: 1.35 }}>{a.sub}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 7, background: C.orange, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>
                    {a.by.replace('คุณ', '').charAt(0)}
                  </span>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: C.brownSoft }}>Inspired by {a.by} · {a.when}</div>
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={C.brownSoft} strokeWidth="2.4" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="M5 2l5 5-5 5"/></svg>
            </button>
          ))}

          {/* Announcement card */}
          <div style={{ padding: 14, borderRadius: 18, background: 'linear-gradient(135deg, #FFF1E2, #FAE0CB)', border: `1.5px dashed ${C.orange}`, marginBottom: 16 }}>
            <button onClick={() => setAnnOpen((x) => !x)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', padding: 0 }}>
              <div style={{ fontSize: 20 }}>📣</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.brownSoft }}>Announcement · Cupid Report</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, marginTop: 2 }}>เปิดสาขาใหม่ที่อารีย์ มิ.ย. นี้!</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.brown} strokeWidth="2.4" strokeLinecap="round" style={{ transform: annOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .2s ease' }}><path d="M5 2l5 5-5 5"/></svg>
            </button>
            {annOpen && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(44,26,14,0.2)', fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brown, lineHeight: 1.5 }}>
                ขอบคุณทุกคนที่โหวต — สาขาใหม่จะเปิด 12 มิถุนายน ที่อารีย์ ซอย 4 คุณที่โหวต A จะได้ส่วนลด 100.- ในวีคแรกครับ 🙏
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
