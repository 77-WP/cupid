import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { FounderPortrait } from '../components/Illustrations'
import { BackBtn, C } from '../components/SharedUI'

export default function FounderVision() {
  const navigate = useNavigate()
  return (
    <MobileFrame>
      <div style={{ background: 'linear-gradient(180deg, #FAF3E8 0%, #F5E6CC 100%)', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={() => navigate('/landing')} />
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, flex: 1, textAlign: 'center' }}>วิสัยทัศน์ของเรา</div>
          <div style={{ width: 36 }} />
        </div>

        {/* Paper card */}
        <div style={{
          margin: '12px 16px 0', padding: '22px 22px 24px', borderRadius: 22,
          background: '#FFFCF4',
          boxShadow: '0 12px 32px rgba(44,26,14,0.1), 0 2px 4px rgba(44,26,14,0.06)',
          position: 'relative',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(44,26,14,0.04) 28px, rgba(44,26,14,0.04) 29px)',
        }}>
          {/* Washi tape */}
          <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%) rotate(-2deg)', width: 60, height: 18, background: 'rgba(232,98,42,0.4)', borderRadius: 2 }} />

          {/* Portraits */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(44,26,14,0.1)' }}>
              <FounderPortrait size={70} who="boss" />
            </div>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(44,26,14,0.1)' }}>
              <FounderPortrait size={70} who="partner" />
            </div>
          </div>
          <div style={{ textAlign: 'center', fontFamily: '"DM Sans", system-ui', fontSize: 10, color: C.brownSoft, marginTop: 6, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>
            พี่โจ & พี่นุ้ย · ผู้ก่อตั้ง Best Part
          </div>

          <div style={{ fontFamily: '"Caveat", "Sarabun", cursive', fontSize: 28, color: C.brown, marginTop: 18, lineHeight: 1.2, textAlign: 'center' }}>
            ทำไมเราถึงทำร้านนี้ครับ?
          </div>

          <div style={{ marginTop: 14, fontFamily: '"Caveat", "Sarabun", cursive', fontSize: 19, color: C.brown, lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 12px' }}>
              สวัสดีครับ — ผมโจครับ ผมและนุ้ย แฟนผม เปิด Best Part ครั้งแรกที่บางลำพู ปี 2563 มีเงินทุน 80,000 บาทกับรถเข็นคันนึง
            </p>
            <p style={{ margin: '0 0 12px' }}>
              ไม่ใช่เรามีไอเดียอะไรยิ่งใหญ่ครับ — เราแค่อยากทำอาหารที่อร่อยจริง ในราคาที่คนเดินถนนกินได้ทุกวัน
            </p>
            <p style={{ margin: '0 0 12px' }}>
              4 ปีผ่านมา เราทำผิดเยอะมากครับ และทุกครั้งที่ทำผิด ลูกค้าคนนึงเขียนมาบอกเรา — บางคนเขียนยาวมาก บางคนเขียนสั้นมาก
            </p>
            <p style={{ margin: '0 0 12px' }}>
              เราอ่านทุกข้อความเองครับ ทุกคืน เป็นเหตุผลเดียวที่ Best Part มาถึงตรงนี้ได้
            </p>
            <p style={{ margin: 0 }}>
              ถ้าวันนี้คุณกินอาหารเรา แล้วรู้สึกว่ามันมีอะไรน่ารักนิดหน่อย — มันมาจากคนที่บอกเราเมื่อ 2 ปีก่อนทั้งนั้นครับ 🙏
            </p>
          </div>

          <div style={{ marginTop: 16, fontFamily: '"Caveat", "Sarabun", cursive', fontSize: 22, color: C.orange, textAlign: 'right' }}>
            — โจ & นุ้ย ✿
          </div>
        </div>

        <div style={{ padding: '18px 28px 0', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, lineHeight: 1.6 }}>
            ถ้าเชื่อใน vision นี้ ฝากบอกต่อด้วยนะครับ
          </div>
          <button style={{ marginTop: 10, padding: '8px 18px', borderRadius: 999, background: 'transparent', border: `1.5px solid ${C.orange}`, color: C.orange, fontFamily: '"Sarabun", system-ui', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="4" cy="8" r="2"/><circle cx="12" cy="3" r="2"/><circle cx="12" cy="13" r="2"/>
              <path d="M6 7l4 -3M6 9l4 3"/>
            </svg>
            แชร์
          </button>
        </div>

        <div style={{ flex: 1, minHeight: 30 }} />
      </div>
    </MobileFrame>
  )
}
