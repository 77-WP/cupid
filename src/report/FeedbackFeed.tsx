import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  orange: '#E8622A',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  amber: '#F5A623',
  card: '#fff',
}

const SOURCE_LABELS: Record<string, string> = {
  grab: 'Grab',
  lineman: 'LINE MAN',
  shopee: 'Shopee',
  kiosk: 'Kiosk',
  unknown: 'อื่นๆ',
}

const SOURCE_COLORS: Record<string, string> = {
  grab: '#00B14F',
  lineman: '#D4A800',
  shopee: '#EE4D2D',
  kiosk: '#4A90D9',
  unknown: '#9B9B9B',
}

type FilterTab = 'all' | 'love' | 'ok' | 'problem' | 'resolved'

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'love', label: '😍 ชอบ' },
  { id: 'ok', label: '😐 โอเค' },
  { id: 'problem', label: '🚨 ปัญหา' },
  { id: 'resolved', label: '✅ แก้แล้ว' },
]

interface FeedbackRow {
  id: string
  mood: string
  source: string
  category?: string
  text?: string
  created_at: string
  menu_ids?: string[]
  nickname?: string
  is_resolved?: boolean
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'เมื่อกี้'
  if (mins < 60) return `${mins} นาทีที่แล้ว`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`
  return `${Math.floor(hrs / 24)} วันที่แล้ว`
}

function moodEmoji(mood: string) {
  if (mood === 'love' || mood === 'happy') return '😍'
  if (mood === 'ok') return '😐'
  return '🚨'
}

export default function FeedbackFeed() {
  const [tab, setTab] = useState<FilterTab>('all')
  const [items, setItems] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState<string | null>(null)
  const [textMoodFilter, setTextMoodFilter] = useState<string>('all')

  useEffect(() => {
    loadFeedback()
  }, [])

  async function loadFeedback() {
    setLoading(true)
    const { data: feedbackData, error } = await supabase
      .from('cupid_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    console.log('Feedback feed:', feedbackData, error)
    if (feedbackData) setItems(feedbackData as FeedbackRow[])
    setLoading(false)
  }

  async function markResolved(id: string) {
    setResolving(id)
    await supabase.from('cupid_feedback').update({ is_resolved: true }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_resolved: true } : i))
    setResolving(null)
  }

  const filtered = (() => {
    if (tab === 'all') return items
    if (tab === 'love') return items.filter(i => i.mood === 'love' || i.mood === 'happy')
    if (tab === 'ok') return items.filter(i => i.mood === 'ok')
    if (tab === 'problem') return items.filter(i => i.mood === 'problem' && !i.is_resolved)
    if (tab === 'resolved') return items.filter(i => i.is_resolved)
    return items
  })()

  const textItems = filtered.filter(i => {
    if (!i.text?.trim()) return false
    if (textMoodFilter === 'all') return true
    if (textMoodFilter === 'love') return i.mood === 'love' || i.mood === 'happy'
    return i.mood === textMoodFilter
  })

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px', borderRadius: 99, border: 'none', flexShrink: 0,
              background: tab === t.id ? C.orange : '#fff',
              color: tab === t.id ? '#fff' : C.brownSoft,
              fontFamily: '"Sarabun", system-ui', fontWeight: tab === t.id ? 700 : 400,
              fontSize: 13, cursor: 'pointer', boxShadow: '0 1px 4px rgba(44,26,14,0.08)',
              transition: 'all .15s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.brownSoft, fontFamily: '"Sarabun", system-ui' }}>
            กำลังโหลด...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.brownSoft, fontFamily: '"Sarabun", system-ui', background: C.card, borderRadius: 18 }}>
            ไม่มีข้อมูลในหมวดนี้ครับ
          </div>
        ) : (
          filtered.map(fb => {
            const isProblem = fb.mood === 'problem' && !fb.is_resolved
            return (
              <div key={fb.id} style={{
                background: C.card, borderRadius: 18,
                border: `1px solid ${isProblem ? 'rgba(220,50,50,0.2)' : 'rgba(44,26,14,0.07)'}`,
                borderLeft: isProblem ? '4px solid #DC3232' : '4px solid transparent',
                padding: '16px 18px',
              }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{moodEmoji(fb.mood)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      {/* Source badge */}
                      <span style={{
                        padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                        fontFamily: '"DM Sans", system-ui',
                        background: SOURCE_COLORS[fb.source] || '#9B9B9B',
                        color: fb.source === 'lineman' ? '#1A1A1A' : '#fff',
                      }}>
                        {SOURCE_LABELS[fb.source] || fb.source}
                      </span>
                      {/* Category badge */}
                      {fb.category && (
                        <span style={{
                          padding: '2px 8px', borderRadius: 99, fontSize: 11,
                          fontFamily: '"Sarabun", system-ui', fontWeight: 600,
                          background: 'rgba(44,26,14,0.08)', color: C.brownSoft,
                        }}>
                          {fb.category}
                        </span>
                      )}
                      {fb.is_resolved && (
                        <span style={{
                          padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                          fontFamily: '"Sarabun", system-ui',
                          background: 'rgba(63,142,92,0.15)', color: '#3F8E5C',
                        }}>
                          ✅ แก้แล้ว
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)', flexShrink: 0 }}>
                    {timeAgo(fb.created_at)}
                  </div>
                </div>

                {/* Content */}
                {fb.text && (
                  <div style={{
                    fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown,
                    lineHeight: 1.65, marginBottom: 10,
                  }}>
                    "{fb.text}"
                  </div>
                )}

                {/* Menu picks */}
                {fb.menu_ids && fb.menu_ids.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {fb.menu_ids.map(m => (
                      <span key={m} style={{
                        padding: '3px 10px', borderRadius: 99, fontSize: 12,
                        fontFamily: '"Sarabun", system-ui', fontWeight: 600,
                        background: '#FFF0E6', color: C.orange,
                        border: '1px solid rgba(232,98,42,0.2)',
                      }}>
                        🍜 {m}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {fb.nickname ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 9, background: C.orange,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, flexShrink: 0,
                      }}>
                        {fb.nickname.charAt(0)}
                      </div>
                      <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>
                        คุณ{fb.nickname}
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.3)' }}>
                      ไม่ระบุชื่อ
                    </span>
                  )}

                  {isProblem && (
                    <button
                      onClick={() => markResolved(fb.id)}
                      disabled={resolving === fb.id}
                      style={{
                        padding: '6px 14px', borderRadius: 10, border: '1.5px solid #3F8E5C',
                        background: 'transparent', color: '#3F8E5C',
                        fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12,
                        cursor: resolving === fb.id ? 'not-allowed' : 'pointer',
                        opacity: resolving === fb.id ? 0.6 : 1,
                        transition: 'all .15s',
                      }}
                    >
                      {resolving === fb.id ? '...' : 'Mark as resolved'}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Open Text Insights */}
      <section style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, margin: 0 }}>
            💬 สิ่งที่ลูกค้าบอกตรงๆ
          </h2>
          {/* Mood filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { val: 'all', label: 'ทั้งหมด' },
              { val: 'love', label: '😍' },
              { val: 'ok', label: '😐' },
              { val: 'problem', label: '🚨' },
            ].map(f => (
              <button key={f.val} onClick={() => setTextMoodFilter(f.val)}
                style={{
                  padding: '4px 10px', borderRadius: 99, border: 'none',
                  background: textMoodFilter === f.val ? C.brown : 'rgba(44,26,14,0.08)',
                  color: textMoodFilter === f.val ? '#fff' : C.brownSoft,
                  fontFamily: '"Sarabun", system-ui', fontSize: 12, cursor: 'pointer',
                }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: C.card, borderRadius: 18, padding: '16px 18px',
          border: '1px solid rgba(44,26,14,0.07)',
          maxHeight: 400, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {textItems.length === 0 ? (
            <div style={{ color: C.brownSoft, fontFamily: '"Sarabun", system-ui', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
              ไม่มีข้อความในหมวดนี้ครับ
            </div>
          ) : (
            textItems.map(fb => (
              <div key={fb.id} style={{
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(44,26,14,0.03)',
                borderLeft: `3px solid ${fb.mood === 'problem' ? '#DC3232' : fb.mood === 'ok' ? '#F5A623' : C.orange}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{moodEmoji(fb.mood)}</span>
                  <span style={{
                    padding: '1px 7px', borderRadius: 99, fontSize: 10, fontWeight: 700,
                    fontFamily: '"DM Sans", system-ui',
                    background: SOURCE_COLORS[fb.source] || '#9B9B9B',
                    color: fb.source === 'lineman' ? '#1A1A1A' : '#fff',
                  }}>
                    {SOURCE_LABELS[fb.source] || fb.source}
                  </span>
                  <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: 'rgba(44,26,14,0.35)', marginLeft: 'auto' }}>
                    {timeAgo(fb.created_at)}
                  </span>
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, lineHeight: 1.55 }}>
                  {fb.text}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
