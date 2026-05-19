// Shared UI primitives used across screens

export const C = {
  cream: '#FAF3E8',
  creamDeep: '#F2E7D2',
  orange: '#E8622A',
  orangeSoft: '#F8E2D2',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  amber: '#F5A623',
  green: '#3F8E5C',
}

export function StatusBar({ light = false }: { light?: boolean }) {
  const fg = light ? '#fff' : C.brown
  return (
    <div style={{
      height: 44, padding: '0 26px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      fontFamily: '"DM Sans", system-ui', fontWeight: 600, fontSize: 16,
      color: fg, position: 'relative', zIndex: 4,
    }}>
      <span style={{ letterSpacing: -0.2 }}>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11">
          <rect x="0" y="7" width="3" height="4" rx="0.6" fill={fg} />
          <rect x="5" y="5" width="3" height="6" rx="0.6" fill={fg} />
          <rect x="10" y="2.5" width="3" height="8.5" rx="0.6" fill={fg} />
          <rect x="15" y="0" width="3" height="11" rx="0.6" fill={fg} />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11">
          <path d="M8 3a8 8 0 0 1 5.5 2.2l.9-.9A9.3 9.3 0 0 0 8 1.5 9.3 9.3 0 0 0 1.6 4.3l.9.9A8 8 0 0 1 8 3z" fill={fg} />
          <path d="M8 6.2c1.3 0 2.5.5 3.4 1.4l.9-.9A6.4 6.4 0 0 0 8 4.7a6.4 6.4 0 0 0-4.3 2L4.6 7.6A4.8 4.8 0 0 1 8 6.2z" fill={fg} />
          <circle cx="8" cy="9.5" r="1.3" fill={fg} />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={fg} strokeOpacity="0.4" />
          <rect x="2" y="2" width="19" height="8" rx="1.6" fill={fg} />
          <path d="M24 4v4c.7-.3 1.3-1 1.3-2s-.6-1.7-1.3-2z" fill={fg} opacity="0.6" />
        </svg>
      </span>
    </div>
  )
}

export function StepDots({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1
        return (
          <div key={i} style={{
            width: idx === step ? 22 : 7, height: 7, borderRadius: 4,
            background: idx === step ? C.orange : 'rgba(44,26,14,0.18)',
            transition: 'all .3s ease',
          }} />
        )
      })}
    </div>
  )
}

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 18, background: '#fff',
      border: '1.5px solid rgba(44,26,14,0.08)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.brown} strokeWidth="2.4" strokeLinecap="round">
        <path d="M9 2L4 7l5 5" />
      </svg>
    </button>
  )
}

export function useCycle(items: string[], ms = 2400) {
  const [i, setI] = React.useState(0)
  React.useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % items.length), ms)
    return () => clearInterval(t)
  }, [items.length, ms])
  return items[i]
}

// React import for useCycle
import React from 'react'
