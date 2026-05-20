import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { StatusBar, BackBtn, C } from '../components/SharedUI'
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
}

const STATUS_CONFIG: Record<JoeEntry['status'], { bg: string; color: string; label: string; pulse?: boolean }> = {
  'done':        { bg: 'rgba(100,200,120,0.2)', color: '#4caf78',  label: '✅ ทำแล้วครับ' },
  'in-progress': { bg: 'rgba(245,166,35,0.2)',  color: '#C9933A',  label: '⏳ กำลังทำอยู่ครับ', pulse: true },
  'response':    { bg: 'rgba(100,150,200,0.2)', color: '#6496aa',  label: '💭 รับทราบแล้วครับ' },
}

function StatusBadge({ status }: { status: JoeEntry['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999,
      background: cfg.bg, fontFamily: '"Sarabun", system-ui', fontSize: 11, fontWeight: 700,
      color: cfg.color, animation: cfg.pulse ? 'badge-pulse 2s ease-in-out infinite' : undefined,
    }}>
      {cfg.label}
    </div>
  )
}

function ArticleView({ entry, onBack }: { entry: JoeEntry; onBack: () => void }) {
  const timeline = [...(entry.timeline || [])].reverse()
  return (
    <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
        <BackBtn onClick={onBack} />
        <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, flex: 1, textAlign: 'center' }}>STORY</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ margin: '12px 16px 0', borderRadius: 22, background: 'linear-gradient(135deg, #FFF1E2, #FAE0CB)', padding: '28px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: 72 }}>{entry.icon}</div>
      </div>

      <div style={{ padding: '14px 22px 0' }}>
        <StatusBadge status={entry.status} />
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: C.brown, marginTop: 10, lineHeight: 1.2 }}>{entry.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: C.orange, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
            {entry.inspired_by_nickname.charAt(0)}
          </span>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.orange, fontWeight: 600 }}>
            Inspired by คุณ{entry.inspired_by_nickname}
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 22px 0' }}>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown, lineHeight: 1.65 }}>{entry.story_text}</div>
      </div>

      {entry.status === 'response' && entry.status_note && (
        <div style={{ margin: '16px 16px 0', padding: 16, borderRadius: 18, background: 'rgba(100,150,200,0.08)', border: '1px solid rgba(100,150,200,0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22, flexShrink: 0 }}>💭</div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, lineHeight: 1.6 }}>{entry.status_note}</div>
        </div>
      )}

      {timeline.length > 0 && (
        <div style={{ padding: '20px 22px 0' }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, marginBottom: 14 }}>📅 ความคืบหน้า</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {timeline.map((item, i) => {
              const dotColor = item.type === 'done' ? '#4caf78' : C.amber
              return (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: i < timeline.length - 1 ? 18 : 0, position: 'relative' }}>
                  {i < timeline.length - 1 && (
                    <div style={{ position: 'absolute', left: 4, top: 14, bottom: 0, width: 2, background: 'rgba(44,26,14,0.1)', borderRadius: 1 }} />
                  )}
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: dotColor, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 10, color: C.brownSoft, marginBottom: 2 }}>{item.date}</div>
                    <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, lineHeight: 1.5 }}>{item.note}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 28 }} />
    </div>
  )
}

export default function JoeMode() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<JoeEntry[]>([])
  const [mounted, setMounted] = useState(false)
  const [annOpen, setAnnOpen] = useState(false)
  const [articleId, setArticleId] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('cupid_joe_mode')
      .select('id, title, icon, summary, story_text, status, status_note, inspired_by_nickname, timeline, display_order')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setEntries(data as JoeEntry[])
      })
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const article = articleId ? entries.find((e) => e.id === articleId) : null

  if (article) {
    return <MobileFrame><ArticleView entry={article} onBack={() => setArticleId(null)} /></MobileFrame>
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes badge-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
      `}</style>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 18px 0', gap: 8 }}>
          <BackBtn onClick={() => navigate('/qa')} />
          <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: C.brownSoft, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>JOE MODE</div>
          <div style={{ width: 36 }} />
        </div>
        <div style={{ padding: '10px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22 }}>💘</span>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: C.brown, lineHeight: 1.2 }}>เรื่องที่เราทำ</div>
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, marginTop: 4 }}>เบื้องหลังคำขอของคุณและเพื่อนๆ</div>
        </div>
        <div style={{ padding: '10px 16px 0', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}>
          {entries.map((entry, i) => (
            <button key={entry.id} onClick={() => setArticleId(entry.id)}
              style={{ padding: 14, borderRadius: 18, background: '#fff', border: '1.5px solid rgba(44,26,14,0.06)', boxShadow: '0 2px 8px rgba(44,26,14,0.04)', display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transform: mounted ? 'translateY(0)' : 'translateY(20px)', opacity: mounted ? 1 : 0, transition: `all .5s cubic-bezier(.2,.7,.3,1) ${i * 90}ms` }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: C.orangeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>{entry.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <StatusBadge status={entry.status} />
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown, marginTop: 4, lineHeight: 1.3 }}>{entry.title}</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 2, lineHeight: 1.35 }}>{entry.summary}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 7, background: C.orange, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>
                    {entry.inspired_by_nickname.charAt(0)}
                  </span>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: C.brownSoft }}>Inspired by คุณ{entry.inspired_by_nickname}</div>
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={C.brownSoft} strokeWidth="2.4" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 4 }}><path d="M5 2l5 5-5 5"/></svg>
            </button>
          ))}

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
