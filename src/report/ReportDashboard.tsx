import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const C = {
  orange: '#E8622A',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  amber: '#F5A623',
  green: '#3F8E5C',
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
  lineman: '#FFC800',
  shopee: '#EE4D2D',
  kiosk: '#4A90D9',
  unknown: '#9B9B9B',
}

const MEDAL = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
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

interface MoodCounts { love: number; ok: number; problem: number }
interface SourceCount { source: string; count: number }
interface MenuVote { vote_choice: string; votes: number }

export default function ReportDashboard() {
  const navigate = useNavigate()
  const [moodCounts, setMoodCounts] = useState<MoodCounts>({ love: 0, ok: 0, problem: 0 })
  const [sourceCounts, setSourceCounts] = useState<SourceCount[]>([])
  const [menuVotes, setMenuVotes] = useState<MenuVote[]>([])
  const [latest, setLatest] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Single fetch — all filtering done client-side
      const { data: allFeedback, error: fbError } = await supabase
        .from('cupid_feedback')
        .select('id, mood, source, created_at, text, category, is_resolved')
        .order('created_at', { ascending: false })

      console.log('All feedback:', allFeedback, fbError)

      if (allFeedback) {
        // Today's mood counts (from midnight)
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const todayFeedback = allFeedback.filter(f => new Date(f.created_at) >= todayStart)
        setMoodCounts({
          love: todayFeedback.filter(f => f.mood === 'love').length,
          ok: todayFeedback.filter(f => f.mood === 'ok').length,
          problem: todayFeedback.filter(f => f.mood === 'problem').length,
        })

        // Source breakdown (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const weekFeedback = allFeedback.filter(f => new Date(f.created_at) >= sevenDaysAgo)
        const srcMap: Record<string, number> = {}
        weekFeedback.forEach(f => {
          const src = f.source || 'unknown'
          srcMap[src] = (srcMap[src] || 0) + 1
        })
        setSourceCounts(Object.entries(srcMap).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count))

        // Latest 5
        setLatest(allFeedback.slice(0, 5) as FeedbackRow[])
      }

      // Menu vote leaderboard — from vote_choice column, last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const { data: voteData, error: voteError } = await supabase
        .from('cupid_feedback')
        .select('vote_choice')
        .not('vote_choice', 'is', null)
        .neq('vote_choice', '')
        .gte('created_at', thirtyDaysAgo.toISOString())

      console.log('Vote data:', voteData, voteError)
      if (voteData) {
        const voteMap: Record<string, number> = {}
        voteData.forEach(row => {
          if (row.vote_choice) {
            voteMap[row.vote_choice] = (voteMap[row.vote_choice] || 0) + 1
          }
        })
        const topVotes = Object.entries(voteMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([vote_choice, votes]) => ({ vote_choice, votes }))
        setMenuVotes(topVotes)
      }

      setLoading(false)
    }
    load()
  }, [])

  const maxSourceCount = Math.max(...sourceCounts.map(s => s.count), 1)

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: C.brownSoft, fontFamily: '"Sarabun", system-ui' }}>
        กำลังโหลดข้อมูล...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Section 1: Mood Summary Cards */}
      <section>
        <h2 style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, marginBottom: 14, marginTop: 0 }}>
          🎯 Mood วันนี้
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {/* Love */}
          <div style={{ background: '#FFF0E6', borderRadius: 18, padding: '20px 18px', border: '1.5px solid rgba(232,98,42,0.2)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>😍</div>
            <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 36, color: C.orange }}>{moodCounts.love}</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, marginTop: 4 }}>ชอบมาก</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)', marginTop: 2 }}>วันนี้</div>
          </div>
          {/* OK */}
          <div style={{ background: '#FFF8E6', borderRadius: 18, padding: '20px 18px', border: '1.5px solid rgba(245,166,35,0.25)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>😐</div>
            <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 36, color: '#C9933A' }}>{moodCounts.ok}</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, marginTop: 4 }}>โอเค</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)', marginTop: 2 }}>วันนี้</div>
          </div>
          {/* Problem */}
          <div style={{
            background: moodCounts.problem > 0 ? '#FFF0F0' : '#F8F8F8',
            borderRadius: 18, padding: '20px 18px',
            border: `1.5px solid ${moodCounts.problem > 0 ? 'rgba(220,50,50,0.3)' : 'rgba(44,26,14,0.08)'}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🚨</div>
            <div style={{
              fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 36,
              color: moodCounts.problem > 0 ? '#DC3232' : C.brownSoft,
            }}>{moodCounts.problem}</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, marginTop: 4 }}>ปัญหา</div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)', marginTop: 2 }}>วันนี้</div>
          </div>
        </div>
      </section>

      {/* Section 2: Source Breakdown */}
      <section>
        <h2 style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, marginBottom: 14, marginTop: 0 }}>
          📦 แหล่งที่มา (7 วัน)
        </h2>
        <div style={{ background: C.card, borderRadius: 18, padding: '20px 22px', border: '1px solid rgba(44,26,14,0.07)' }}>
          {sourceCounts.length === 0 ? (
            <div style={{ color: C.brownSoft, fontFamily: '"Sarabun", system-ui', fontSize: 14 }}>ยังไม่มีข้อมูลครับ</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['grab', 'lineman', 'shopee', 'kiosk', 'unknown'].map(src => {
                const found = sourceCounts.find(s => s.source === src)
                const count = found?.count || 0
                const pct = Math.round((count / maxSourceCount) * 100)
                return (
                  <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 72, fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, flexShrink: 0 }}>
                      {SOURCE_LABELS[src]}
                    </div>
                    <div style={{ flex: 1, height: 10, background: 'rgba(44,26,14,0.07)', borderRadius: 99 }}>
                      <div style={{
                        height: '100%', borderRadius: 99, width: `${pct}%`,
                        background: SOURCE_COLORS[src] || C.orange,
                        transition: 'width .6s cubic-bezier(.2,.7,.3,1)',
                        minWidth: count > 0 ? 6 : 0,
                      }} />
                    </div>
                    <div style={{ width: 28, fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 13, color: C.brown, textAlign: 'right', flexShrink: 0 }}>
                      {count}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Menu Vote Leaderboard */}
      <section>
        <h2 style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, marginBottom: 14, marginTop: 0 }}>
          ⭐ เมนูยอดนิยม (30 วัน)
        </h2>
        <div style={{ background: C.card, borderRadius: 18, padding: '20px 22px', border: '1px solid rgba(44,26,14,0.07)' }}>
          {menuVotes.length === 0 ? (
            <div style={{ color: C.brownSoft, fontFamily: '"Sarabun", system-ui', fontSize: 14 }}>ยังไม่มีข้อมูล vote ครับ</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {menuVotes.map((mv, i) => (
                <div key={mv.vote_choice} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  borderRadius: 12, background: i === 0 ? '#FFF8E0' : 'rgba(44,26,14,0.03)',
                  border: `1px solid ${i === 0 ? 'rgba(245,166,35,0.3)' : 'rgba(44,26,14,0.06)'}`,
                }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{MEDAL[i]}</span>
                  <div style={{ flex: 1, fontFamily: '"Sarabun", system-ui', fontSize: 14, fontWeight: 600, color: C.brown }}>
                    {mv.vote_choice}
                  </div>
                  <div style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 15, color: C.orange }}>
                    {mv.votes}
                  </div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>votes</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Latest Feedback */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, margin: 0 }}>
            💬 Feedback ล่าสุด
          </h2>
          <button
            onClick={() => navigate('/report/feedback')}
            style={{
              background: 'transparent', border: 'none', color: C.orange,
              fontFamily: '"Sarabun", system-ui', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            ดูทั้งหมด →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {latest.length === 0 ? (
            <div style={{ background: C.card, borderRadius: 18, padding: '20px 22px', color: C.brownSoft, fontFamily: '"Sarabun", system-ui', fontSize: 14 }}>
              ยังไม่มีข้อมูลครับ
            </div>
          ) : (
            latest.map(fb => {
              const isProblem = fb.mood === 'problem'
              return (
                <button
                  key={fb.id}
                  onClick={() => navigate('/report/feedback')}
                  style={{
                    background: C.card, borderRadius: 16, padding: '14px 16px',
                    border: `1px solid ${isProblem ? 'rgba(220,50,50,0.2)' : 'rgba(44,26,14,0.07)'}`,
                    borderLeft: isProblem ? '4px solid #DC3232' : `4px solid transparent`,
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%',
                    transition: 'box-shadow .15s',
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{moodEmoji(fb.mood)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      {fb.category && (
                        <span style={{
                          fontFamily: '"Sarabun", system-ui', fontSize: 11, fontWeight: 700,
                          color: C.brownSoft, background: 'rgba(44,26,14,0.07)',
                          padding: '2px 8px', borderRadius: 99,
                        }}>{fb.category}</span>
                      )}
                      <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)' }}>
                        {SOURCE_LABELS[fb.source] || fb.source}
                      </span>
                    </div>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, lineHeight: 1.4 }}>
                      {fb.text ? fb.text.slice(0, 50) + (fb.text.length > 50 ? '...' : '') : '—'}
                    </div>
                  </div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.4)', flexShrink: 0, marginTop: 2 }}>
                    {timeAgo(fb.created_at)}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
