import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/report', icon: '📊', label: "Today's Pulse" },
  { path: '/report/feedback', icon: '📋', label: 'Feedback' },
  { path: '/report/settings', icon: '⚙️', label: 'Settings' },
  { path: '/report/joe', icon: '💘', label: 'เหมือนฝัน' },
]

const C = {
  bg: '#F5EDD8',
  sidebar: '#2C1A0E',
  orange: '#E8622A',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
}

function isActive(itemPath: string, pathname: string) {
  if (itemPath === '/report') return pathname === '/report'
  return pathname.startsWith(itemPath)
}

export default function ReportLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeItem = NAV_ITEMS.find(n => isActive(n.path, pathname))

  return (
    <>
      <style>{`
        .report-sidebar { display: flex; }
        .report-main { margin-left: 220px; padding-bottom: 0; }
        .report-bottom-tabs { display: none; }
        @media (max-width: 768px) {
          .report-sidebar { display: none; }
          .report-main { margin-left: 0; padding-bottom: 72px; }
          .report-bottom-tabs { display: flex; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100dvh', background: C.bg, fontFamily: '"Sarabun", system-ui' }}>

        {/* Desktop Sidebar */}
        <aside className="report-sidebar" style={{
          width: 220, background: C.sidebar, flexDirection: 'column',
          padding: '28px 14px', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, padding: '0 8px' }}>
            <span style={{ fontSize: 26 }}>💘</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', lineHeight: 1.2 }}>Cupid Report</div>
              <div style={{
                fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: 2,
                textTransform: 'uppercase', fontFamily: '"DM Sans", system-ui', fontWeight: 600, marginTop: 2,
              }}>BEST PART</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV_ITEMS.map(item => {
              const active = isActive(item.path, pathname)
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 12, border: 'none',
                    background: active ? 'rgba(232,98,42,0.22)' : 'transparent',
                    color: active ? C.orange : 'rgba(255,255,255,0.65)',
                    fontFamily: '"Sarabun", system-ui', fontSize: 14,
                    fontWeight: active ? 700 : 400, cursor: 'pointer',
                    textAlign: 'left', transition: 'all .18s ease',
                  }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div style={{ flex: 1 }} />
          <div style={{ padding: '0 8px', fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
            Cupid Report v1.0<br />Best Part © 2026
          </div>
        </aside>

        {/* Main content */}
        <main className="report-main" style={{ flex: 1, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
          {/* Top bar */}
          <div style={{
            background: '#fff', borderBottom: '1px solid rgba(44,26,14,0.08)',
            padding: '14px 28px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
          }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: C.brown, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{activeItem?.icon}</span>
              <span>{activeItem?.label}</span>
            </div>
            <div style={{
              fontSize: 11, color: C.brownSoft, letterSpacing: 1.5,
              textTransform: 'uppercase', fontFamily: '"DM Sans", system-ui', fontWeight: 600,
            }}>BEST PART</div>
          </div>

          <div style={{ padding: '28px', flex: 1 }}>
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Tabs */}
        <nav className="report-bottom-tabs" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: C.sidebar, zIndex: 100,
          paddingBottom: 'env(safe-area-inset-bottom)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path, pathname)
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  flex: 1, padding: '8px 4px 6px', border: 'none',
                  background: 'transparent',
                  color: active ? C.orange : 'rgba(255,255,255,0.45)',
                  fontFamily: '"Sarabun", system-ui', fontSize: 10,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 3, fontWeight: active ? 700 : 400,
                  transition: 'color .15s',
                }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
