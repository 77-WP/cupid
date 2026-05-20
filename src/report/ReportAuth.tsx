import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const AUTH_KEY = 'cupid_report_auth'
const AUTH_VAL = 'bestpart2026'

const C = {
  bg: '#F5EDD8',
  orange: '#E8622A',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
}

export default function ReportAuth() {
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === AUTH_VAL)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  if (authed) return <Outlet />

  const handleLogin = () => {
    if (pw === AUTH_VAL) {
      localStorage.setItem(AUTH_KEY, AUTH_VAL)
      setAuthed(true)
    } else {
      setErr(true)
      setPw('')
    }
  }

  return (
    <div style={{
      minHeight: '100dvh', background: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      fontFamily: '"Sarabun", system-ui',
    }}>
      <div style={{
        width: '100%', maxWidth: 360, background: '#fff', borderRadius: 24,
        padding: '36px 28px', boxShadow: '0 4px 40px rgba(44,26,14,0.12)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>💘</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: C.brown }}>Cupid Report</div>
          <div style={{
            fontSize: 11, color: C.brownSoft, marginTop: 4,
            letterSpacing: 1.5, textTransform: 'uppercase',
            fontFamily: '"DM Sans", system-ui', fontWeight: 600,
          }}>BEST PART</div>
        </div>

        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
            border: `1.5px solid ${err ? C.orange : 'rgba(44,26,14,0.15)'}`,
            fontFamily: '"Sarabun", system-ui', fontSize: 15, outline: 'none', color: C.brown,
            background: '#FAFAFA',
          }}
        />
        {err && (
          <div style={{ color: C.orange, fontSize: 13, marginTop: 6 }}>
            รหัสผ่านไม่ถูกต้องครับ
          </div>
        )}
        <button
          onClick={handleLogin}
          style={{
            marginTop: 14, width: '100%', padding: 13, borderRadius: 14,
            background: C.orange, border: 'none', color: '#fff',
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16,
            cursor: 'pointer',
          }}
        >
          เข้าสู่ระบบ
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(44,26,14,0.35)' }}>
          สำหรับทีมงาน Best Part เท่านั้น
        </div>
      </div>
    </div>
  )
}
