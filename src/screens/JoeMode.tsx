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
  'done':        { bg: 'rgba(34,197,94,0.9)',    color: '#fff',    label: 'เสร็จแล้ว' },
  'in-progress': { bg: 'rgba(245,166,35,0.9)',   color: '#2C1A0E', label: 'กำลังทำ' },
  'response':    { bg: 'rgba(148,163,184,0.85)', color: '#fff',    label: 'รับทราบ' },
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
    <div style={{ background: '#FAF3E8', minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <style>{`
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
                  {/* Left track */}
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
                  {/* Right content */}
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

export default function JoeMode() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<JoeEntry[]>([])
  const [annOpen, setAnnOpen] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('cupid_joe_mode')
      .select('id, title, icon, summary, story_text, status, status_note, inspired_by_nickname, timeline, display_order, image_url')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setEntries(data as JoeEntry[])
      })
  }, [])

  const article = articleId ? entries.find((e) => e.id === articleId) : null

  if (article) {
    return (
      <MobileFrame>
        <ArticleView entry={article} onBack={() => navigate('/meunfun')} />
      </MobileFrame>
    )
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
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
          opacity: 0.7, textAlign: 'center', marginTop: 4, marginBottom: 20,
        }}>เรื่องที่เราทำเพราะคุณ</div>

        {/* 3-COLUMN GRID */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8, padding: '0 16px', flex: 1,
        }}>
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              onClick={() => setArticleId(entry.id)}
              style={{
                position: 'relative', cursor: 'pointer',
                borderRadius: 14, overflow: 'hidden',
                aspectRatio: '1', background: '#F0EBE3',
                animation: 'cardFadeIn 0.35s ease-out both',
                animationDelay: `${i * 60}ms`,
              }}
            >
              {/* Image or placeholder */}
              {entry.image_url
                ? <img src={entry.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt={entry.title} />
                : (
                  <div style={{
                    width: '100%', height: '100%', background: '#E8DDD4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 28, opacity: 0.6 }}>{entry.icon}</span>
                  </div>
                )
              }

              {/* Status badge */}
              <div style={{ position: 'absolute', top: 7, left: 7 }}>
                <StatusPill status={entry.status} />
              </div>

              {/* Bottom gradient overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 52,
                background: 'linear-gradient(to top, rgba(44,26,14,0.65), transparent)',
                display: 'flex', alignItems: 'flex-end', padding: '7px 8px',
              }}>
                <div style={{
                  fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11,
                  color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', width: '100%',
                }}>
                  {entry.title}
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
