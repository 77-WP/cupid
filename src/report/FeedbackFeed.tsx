import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  orange: '#E8622A',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  card: '#fff',
}

const SOURCE_LABELS: Record<string, string> = {
  grab: 'Grab',
  lineman: 'LINE MAN',
  shopee: 'Shopee',
  kiosk: 'Kiosk',
  unknown: 'อื่นๆ',
}

const MOOD_LABELS: Record<string, string> = {
  love: 'ชอบมาก',
  happy: 'ชอบมาก',
  ok: 'โอเค',
  problem: 'ปัญหา',
}

type FilterTab = 'all' | 'love' | 'ok' | 'problem' | 'resolved'

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'love', label: '😍' },
  { id: 'ok', label: '😐' },
  { id: 'problem', label: '🚨' },
  { id: 'resolved', label: '✅' },
]

interface FeedbackRow {
  id: string
  mood: string
  source: string
  category?: string
  text?: string
  created_at: string
  nickname?: string
  is_resolved?: boolean
  vote_choice?: string
  qa_answer?: string
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

function FeedbackCard({
  fb,
  resolving,
  onResolve,
}: {
  fb: FeedbackRow
  resolving: string | null
  onResolve: (id: string) => void
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>{moodEmoji(fb.mood)}</span>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>
            {MOOD_LABELS[fb.mood] || 'ไม่ระบุ'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)' }}>
            {timeAgo(fb.created_at)}
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700,
            fontFamily: '"DM Sans", system-ui',
            background: C.orange, color: '#fff',
          }}>
            {SOURCE_LABELS[fb.source] || fb.source}
          </span>
        </div>
      </div>

      {/* Section 1: Feedback text + category tag */}
      {fb.text?.trim() && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown, lineHeight: 1.65 }}>
            {fb.text}
          </div>
          {fb.category && (
            <span style={{
              alignSelf: 'flex-start',
              padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
              fontFamily: '"Sarabun", system-ui',
              background: 'rgba(44,26,14,0.07)', color: C.brownSoft,
            }}>
              {fb.category}
            </span>
          )}
        </div>
      )}

      {/* Section 2: Menu vote */}
      {fb.vote_choice?.trim() && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)' }}>
            🍽 โหวตเมนู
          </span>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, fontWeight: 600, color: C.orange }}>
            {fb.vote_choice}
          </span>
        </div>
      )}

      {/* Section 3: Q&A answer */}
      {fb.qa_answer?.trim() && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.45)' }}>
            💬 ตอบคำถาม
          </span>
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown }}>
            {fb.qa_answer}
          </span>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(44,26,14,0.07)' }} />

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {fb.is_resolved ? (
          <span style={{
            padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
            fontFamily: '"Sarabun", system-ui',
            background: 'rgba(63,142,92,0.12)', color: '#3F8E5C',
          }}>
            ✓ แก้แล้ว
          </span>
        ) : (
          <button
            onClick={() => onResolve(fb.id)}
            disabled={resolving === fb.id}
            style={{
              background: 'transparent', border: 'none', padding: 0,
              cursor: resolving === fb.id ? 'not-allowed' : 'pointer',
              fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.4)',
              opacity: resolving === fb.id ? 0.6 : 1,
              transition: 'color .15s',
            }}
            onMouseEnter={e => { if (resolving !== fb.id) (e.currentTarget as HTMLButtonElement).style.color = '#3F8E5C' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(44,26,14,0.4)' }}
          >
            {resolving === fb.id ? '...' : 'ทำเครื่องหมายว่าแก้แล้ว'}
          </button>
        )}
        {fb.nickname && (
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.4)' }}>
            คุณ{fb.nickname}
          </span>
        )}
      </div>
    </div>
  )
}

export default function FeedbackFeed() {
  const [tab, setTab] = useState<FilterTab>('all')
  const [items, setItems] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState<string | null>(null)

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

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filter Tabs — pill style */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '7px 18px', borderRadius: 99, flexShrink: 0,
              background: tab === t.id ? C.orange : 'transparent',
              color: tab === t.id ? '#fff' : C.brownSoft,
              border: tab === t.id ? '1.5px solid transparent' : '1.5px solid rgba(44,26,14,0.2)',
              fontFamily: '"Sarabun", system-ui', fontWeight: tab === t.id ? 700 : 400,
              fontSize: 13, cursor: 'pointer',
              transition: 'all .15s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Card stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.brownSoft, fontFamily: '"Sarabun", system-ui' }}>
            กำลังโหลด...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: 40, textAlign: 'center', color: C.brownSoft,
            fontFamily: '"Sarabun", system-ui', background: C.card, borderRadius: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}>
            ไม่มีข้อมูลในหมวดนี้ครับ
          </div>
        ) : (
          filtered.map(fb => (
            <FeedbackCard key={fb.id} fb={fb} resolving={resolving} onResolve={markResolved} />
          ))
        )}
      </div>
    </div>
  )
}
