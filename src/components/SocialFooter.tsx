import { C } from './SharedUI'

const SOCIAL_LINKS = [
  { icon: '🌐', label: 'Website',   href: 'https://bestpartbowls.com' },
  { icon: '📘', label: 'Facebook',  href: '#' },
  { icon: '🎵', label: 'TikTok',    href: '#' },
  { icon: '📷', label: 'Instagram', href: '#' },
]

const BRAND_COLORS = ['#E8622A', '#F5A623', '#2C1A0E', '#7CB342', '#1565C0']
const DEFAULT_INITIALS = ['ป', 'น', 'ต', 'ก']
const MAX_SHOWN = 4

interface SocialFooterProps {
  feedbackCount?: number | null
  hideCTA?: boolean
  supporters?: string[]
}

export default function SocialFooter({ feedbackCount, hideCTA, supporters }: SocialFooterProps) {
  const initials = supporters && supporters.length > 0 ? supporters : DEFAULT_INITIALS
  const displayInitials = initials.slice(0, MAX_SHOWN)
  const overflowCount = feedbackCount != null ? Math.max(0, feedbackCount - MAX_SHOWN) : null

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

      {/* Row 3: Supporter avatars + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Stacked initial circles */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {displayInitials.map((initial, i) => (
            <div
              key={i}
              style={{
                width: 22, height: 22, borderRadius: 11,
                background: BRAND_COLORS[i % BRAND_COLORS.length],
                border: '2px solid rgba(250,243,232,1)',
                marginLeft: i === 0 ? 0 : -7,
                zIndex: MAX_SHOWN - i,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontFamily: '"DM Sans", system-ui',
                fontWeight: 700, fontSize: 8,
                position: 'relative',
              }}
            >
              {initial}
            </div>
          ))}
        </div>

        {/* Count text */}
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>
          {feedbackCount != null ? (
            <>
              <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, color: C.brown }}>
                +{overflowCount != null && overflowCount > 0 ? overflowCount.toLocaleString() : feedbackCount.toLocaleString()} คน
              </span>
              {' '}ให้กำลังใจทีมงานเราเดือนนี้ ❤︎
            </>
          ) : (
            <span style={{ color: 'rgba(44,26,14,0.35)' }}>คนให้กำลังใจทีมงานเราเดือนนี้ ❤︎</span>
          )}
        </div>
      </div>
    </div>
  )
}
