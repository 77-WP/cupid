import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { BackBtn, C } from '../components/SharedUI'
import { supabase } from '../lib/supabase'

interface TimelineItem {
  date: string
  note: string
  type: 'note' | 'done'
}

interface JoeEntry {
  id: string
  title: string
  icon: string
  summary: string
  story_text: string
  status: 'done' | 'in-progress' | 'response'
  status_note: string | null
  inspired_by_nickname: string
  timeline: TimelineItem[]
  display_order: number
  image_url?: string
}

const STATUS_CONFIG: Record<JoeEntry['status'], { bg: string; color: string; label: string }> = {
  'done':        { bg: '#DCFCE7', color: '#15803D', label: '✅ เสร็จแล้ว' },
  'in-progress': { bg: '#FEF3C7', color: '#B45309', label: '⏳ กำลังทำ' },
  'response':    { bg: '#F1F5F9', color: '#64748B', label: '💬 รับทราบ' },
}

function StatusPill({ status }: { status: JoeEntry['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 20,
      background: cfg.bg, fontFamily: '"Sarabun", system-ui', fontSize: 10, fontWeight: 700,
      color: cfg.color,
    }}>
      {cfg.label}
    </div>
  )
}

function ArticleView({ entry, onBack }: { entry: JoeEntry; onBack: () => void }) {
  const timeline = [...(entry.timeline || [])].reverse()
  return (
    <div style={{
      background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto',
      animation: 'detailSlideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
    }}>
      <style>{`
        @keyframes detailSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroReveal { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      {/* A) HEADER BAR */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(250,243,232,0.92)', backdropFilter: 'blur(8px)',
        padding: '12px 16px', display: 'flex', alignItems: 'center',
      }}>
        <BackBtn onClick={onBack} />
        <div style={{
          flex: 1, textAlign: 'center',
          fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 11,
          letterSpacing: '0.12em', color: '#2C1A0E', opacity: 0.5,
        }}>STORY</div>
        <div style={{ width: 36 }} />
      </div>

      {/* B) HERO BLOCK */}
      <div style={{
        margin: '12px 16px 0', borderRadius: 20, overflow: 'hidden',
        height: 220, background: 'linear-gradient(135deg, #F5ECD8, #EDDFCC)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'heroReveal 0.5s ease-out',
      }}>
        {entry.image_url
          ? <img src={entry.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={entry.title} />
          : <div style={{ fontSize: 56, textShadow: '0 2px 8px rgba(44,26,14,0.15)' }}>{entry.icon}</div>
        }
      </div>

      {/* C) CONTENT AREA */}
      <div style={{ padding: '20px 20px 40px' }}>
        <StatusPill status={entry.status} />

        <div style={{
          fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 28,
          color: '#2C1A0E', lineHeight: 1.25, marginTop: 10, marginBottom: 6,
        }}>
          {entry.title}
        </div>

        {/* Inspired by row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: '#E8622A', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 10, color: '#fff', flexShrink: 0,
          }}>
            {entry.inspired_by_nickname.charAt(0)}
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontStyle: 'italic', fontSize: 13, color: '#E8622A' }}>
            Inspired by {entry.inspired_by_nickname}
          </div>
        </div>

        {/* Story text */}
        <div style={{
          fontFamily: '"Sarabun", system-ui', fontSize: 15, color: '#2C1A0E',
          lineHeight: 1.75, marginBottom: 24,
          animation: 'fadeInUp 0.4s ease-out 0.2s both',
        }}>
          {entry.story_text}
        </div>

        {/* Response card */}
        {entry.status_note && (
          <div style={{
            background: '#F0EBE3', borderRadius: 14, padding: '14px 16px', marginBottom: 24,
          }}>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: '#2C1A0E', lineHeight: 1.7 }}>
              {entry.status_note}
            </div>
          </div>
        )}

        {/* D) TIMELINE SECTION */}
        {timeline.length > 0 && (
          <div>
            <div style={{
              fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16,
              color: '#2C1A0E', marginBottom: 16,
            }}>ความคืบหน้า</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {timeline.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: 6, flexShrink: 0,
                      background: i === 0 ? '#E8622A' : '#D4C4B0',
                      animation: 'dotPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                      animationDelay: `${i * 120}ms`,
                    }} />
                    {i < timeline.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: '#E8D5C0', minHeight: 20 }} />
                    )}
                  </div>
                  <div style={{ flex: 1, marginBottom: 20 }}>
                    <div style={{
                      fontFamily: '"Sarabun", system-ui', fontSize: 12,
                      color: '#6B4C2A', opacity: 0.7, marginBottom: 3,
                    }}>{item.date}</div>
                    <div style={{
                      fontFamily: '"Sarabun", system-ui', fontSize: 14,
                      color: '#2C1A0E', lineHeight: 1.6,
                    }}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const FILTERS = [
  { label: 'ทั้งหมด',    value: 'all' },
  { label: '⏳ กำลังทำ', value: 'in-progress' },
  { label: '✅ เสร็จแล้ว', value: 'done' },
  { label: '💬 รับทราบ', value: 'response' },
]

export default function JoeMode() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<JoeEntry[]>([])
  const [annOpen, setAnnOpen] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    supabase
      .from('cupid_joe_mode')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setEntries(data as JoeEntry[])
      })
  }, [])

  const article = articleId ? entries.find((e) => e.id === articleId) : null

  if (article) {
    return (
      <MobileFrame>
        <ArticleView entry={article} onBack={() => setArticleId(null)} />
      </MobileFrame>
    )
  }

  const filteredEntries = filter === 'all' ? entries : entries.filter((e) => e.status === filter)

  return (
    <MobileFrame>
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .joe-filter-row::-webkit-scrollbar { display: none; }
      `}</style>
      <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 0', gap: 8 }}>
          <BackBtn onClick={() => navigate('/landing')} />
          <div style={{
            flex: 1, textAlign: 'center',
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 20, color: '#2C1A0E',
          }}>เหมือนฝัน</div>
          <div style={{ width: 36 }} />
        </div>
        <div style={{
          fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#6B4C2A',
          opacity: 0.7, textAlign: 'center', marginTop: 4, marginBottom: 14,
        }}>เรื่องที่เราทำเพราะคุณ</div>

        {/* FILTER ROW */}
        <div
          className="joe-filter-row"
          style={{
            display: 'flex', gap: 8, padding: '0 16px', marginBottom: 16,
            overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none',
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '7px 14px', borderRadius: 20,
                fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12,
                cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
                background: filter === f.value ? '#2C1A0E' : 'rgba(44,26,14,0.07)',
                color: filter === f.value ? '#fff' : '#6B4C2A',
                transition: 'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 2-COLUMN GRID */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12, padding: '0 16px', flex: 1,
        }}>
          {filteredEntries.length === 0 && (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px 0', color: '#6B4C2A', opacity: 0.4 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
              <p style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, margin: 0 }}>ไม่มีรายการในหมวดนี้ครับ</p>
            </div>
          )}
          {filteredEntries.map((entry, i) => (
            <div
              key={entry.id}
              onClick={() => setArticleId(entry.id)}
              style={{
                background: '#FFFFFF', borderRadius: 18, padding: '12px 12px 10px',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 1px 4px rgba(44,26,14,0.07), 0 4px 16px rgba(44,26,14,0.05)',
                border: '1.5px solid rgba(44,26,14,0.06)',
                cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
                animation: 'cardFadeIn 0.4s ease-out both',
                animationDelay: `${i * 80}ms`,
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.97)' }}
              onMouseUp={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
            >
              {/* A) TOP ROW — emoji + status pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 32, lineHeight: 1 }}>{entry.icon}</span>
                <StatusPill status={entry.status} />
              </div>

              {/* B) TITLE */}
              <div style={{
                fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15,
                color: '#2C1A0E', lineHeight: 1.3, marginBottom: 5,
              }}>
                {entry.title}
              </div>

              {/* C) SUMMARY */}
              <div style={{
                fontFamily: '"Sarabun", system-ui', fontSize: 11, color: '#6B4C2A',
                lineHeight: 1.5, marginBottom: 8,
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              } as React.CSSProperties}>
                {entry.summary}
              </div>

              {/* D) INSPIRED BY ROW */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 'auto' }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#E8622A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 8, color: '#fff', flexShrink: 0,
                }}>
                  {entry.inspired_by_nickname.charAt(0)}
                </div>
                <div style={{
                  fontFamily: '"Sarabun", system-ui', fontSize: 11,
                  color: 'rgba(44,26,14,0.45)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120,
                }}>
                  โดย {entry.inspired_by_nickname}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ANNOUNCEMENT BANNER */}
        <div style={{ padding: '16px 16px 0' }}>
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
