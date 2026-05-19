import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBowl, FaceHappy, FaceNeutral, FaceAlert, HeartLogo } from '../components/Illustrations'
import { StatusBar, StepDots, C } from '../components/SharedUI'

export default function LandingScreen() {
  const navigate = useNavigate()
  const [hover, setHover] = useState<string | null>(null)

  const tiles = [
    { key: 'happy', face: <FaceHappy size={60} />, label: 'ชอบมาก', sub: 'บอกต่อ', path: '/happy' },
    { key: 'okay', face: <FaceNeutral size={60} />, label: 'โอเค', sub: 'แสดงความคิด', path: '/neutral' },
    { key: 'bad', face: <FaceAlert size={60} />, label: 'มีปัญหา', sub: 'แจ้งด่วน', path: '/problem' },
  ]

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HeartLogo size={18} />
            <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 13, letterSpacing: 2.4, color: C.brown }}>BEST PART</span>
          </div>
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 0.6, textTransform: 'uppercase' }}>cupid</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
          <div className="mascot-float"><MascotBowl size={148} mood="happy" wave /></div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 22, color: C.brown, marginTop: 6, textAlign: 'center', lineHeight: 1.25, padding: '0 28px' }}>
            วันนี้เป็นยังไงบ้างครับ?
          </div>
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 4, letterSpacing: 0.3 }}>ใช้เวลา 30 วินาที</div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '18px 18px 0' }}>
          {tiles.map((t) => (
            <button key={t.key}
              onMouseEnter={() => setHover(t.key)} onMouseLeave={() => setHover(null)}
              onClick={() => navigate(t.path)}
              style={{
                flex: 1, padding: '16px 8px 14px', borderRadius: 20, background: '#fff',
                border: `1.5px solid ${hover === t.key ? C.orange : 'rgba(44,26,14,0.08)'}`,
                boxShadow: hover === t.key ? '0 8px 24px rgba(232,98,42,0.18)' : '0 2px 8px rgba(44,26,14,0.05)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                cursor: 'pointer', transition: 'all .2s ease', fontFamily: 'inherit',
                transform: hover === t.key ? 'translateY(-3px)' : 'translateY(0)',
              }}>
              {t.face}
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown }}>{t.label}</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft }}>{t.sub}</div>
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', paddingTop: 14 }}>
          <button onClick={() => navigate('/founder')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            วิสัยทัศน์ของเรา <span style={{ color: C.orange }}>→</span>
          </button>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '0 20px 12px' }}><StepDots step={1} /></div>
        <div style={{ margin: '0 16px 22px', padding: '18px 18px', borderRadius: 22, background: `linear-gradient(135deg, ${C.creamDeep}, #F8E2D2)`, display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, top: -10, opacity: 0.4 }}><HeartLogo size={48} color={C.orange} /></div>
          <div style={{ display: 'flex' }}>
            {[C.orange, C.amber, '#D9482A', C.brownSoft].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: `2.5px solid ${C.cream}`, marginLeft: i === 0 ? 0 : -10, zIndex: 4 - i, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 11 }}>
                {['ปอ', 'นุ้ย', 'โต', '+'][i]}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 22, color: C.brown, lineHeight: 1 }}>342</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 2 }}>คนให้กำลังใจทีมงานเราเดือนนี้ ❤︎</div>
          </div>
        </div>
      </div>
    </MobileFrame>
  )
}
