import { C } from './SharedUI'

const SOCIAL_LINKS = [
  { icon: '🌐', label: 'Website',   href: 'https://bestpartbowls.com' },
  { icon: '📘', label: 'Facebook',  href: '#' },
  { icon: '🎵', label: 'TikTok',    href: '#' },
  { icon: '📷', label: 'Instagram', href: '#' },
]

interface SocialFooterProps {
  feedbackCount?: number | null
  hideCTA?: boolean
}

export default function SocialFooter({ feedbackCount, hideCTA }: SocialFooterProps) {
  return (
    <div style={{
      padding: '14px 16px 20px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 12, maxWidth: 390, width: '100%', margin: '0 auto',
    }}>
      {/* Row 1: Social icon circles */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: 36, height: 36, borderRadius: 18,
              background: 'rgba(232,98,42,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, textDecoration: 'none',
              border: '1px solid rgba(232,98,42,0.15)',
              transition: 'background .15s',
            }}
            title={s.label}
          >
            {s.icon}
          </a>
        ))}
      </div>

      {/* Row 2: Order CTA */}
      {!hideCTA && (
        <a
          href="https://bestpartbowls.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', width: '100%', padding: '11px 0',
            borderRadius: 10, textAlign: 'center',
            border: `1.5px solid ${C.orange}`, color: C.orange,
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
            textDecoration: 'none', boxSizing: 'border-box',
            transition: 'background .15s',
          }}
        >
          🍜 ดูเมนูและสั่งอาหาร →
        </a>
      )}

      {/* Row 3: Feedback count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex' }}>
          {[C.orange, C.amber, '#D9482A', C.brownSoft].map((c, i) => (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: 11,
              background: c, border: `2px solid rgba(245,237,216,1)`,
              marginLeft: i === 0 ? 0 : -7, zIndex: 4 - i,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: '"DM Sans", system-ui',
              fontWeight: 700, fontSize: 8,
            }}>
              {['ป', 'น', 'ต', '+'][i]}
            </div>
          ))}
        </div>
        <div style={{
          fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft,
        }}>
          {feedbackCount != null
            ? <><span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, color: C.brown }}>{feedbackCount.toLocaleString()}</span> คนให้กำลังใจทีมงานเราเดือนนี้ ❤︎</>
            : <span style={{ color: 'rgba(44,26,14,0.35)' }}>คนให้กำลังใจทีมงานเราเดือนนี้ ❤︎</span>
          }
        </div>
      </div>
    </div>
  )
}
