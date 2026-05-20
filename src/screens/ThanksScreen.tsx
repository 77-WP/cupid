import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBow } from '../components/Illustrations'
import { StatusBar, StepDots, C } from '../components/SharedUI'
import SocialFooter from '../components/SocialFooter'
import { supabase } from '../lib/supabase'

interface MenuItem {
  id: string
  name: string
  emoji?: string
}

interface JoeEntry {
  id: string
  title: string
  icon: string
  summary: string
  status: string
}

interface CupidSettings {
  announcement_is_active: boolean
  announcement_title: string | null
  announcement_text: string | null
  announcement_vote_options: string[] | null
  weekly_question: string | null
}

export default function ThanksScreen() {
  const navigate = useNavigate()

  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [settings, setSettings] = useState<CupidSettings | null>(null)
  const [annVote, setAnnVote] = useState<string | null>(null)
  const [joeEntry, setJoeEntry] = useState<JoeEntry | null>(null)

  useEffect(() => {
    // Feedback count
    supabase.from('cupid_feedback').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count != null) setFeedbackCount(count)
    })

    // Menus — graceful fallback if table doesn't exist
    supabase.from('menus').select('id, name, emoji').order('display_order').limit(6).then(({ data, error }) => {
      if (!error && data && data.length > 0) setMenus(data as MenuItem[])
    })

    // Settings
    supabase.from('cupid_settings').select('announcement_is_active, announcement_title, announcement_text, announcement_vote_options, weekly_question').eq('id', 1).single().then(({ data }) => {
      if (data) setSettings(data as CupidSettings)
    })

    // Latest done Joe entry
    supabase.from('cupid_joe_mode').select('id, title, icon, summary, status').eq('status', 'done').order('display_order', { ascending: false }).limit(1).single().then(({ data }) => {
      if (data) setJoeEntry(data as JoeEntry)
    })
  }, [])

  const handleMenuSelect = (menuId: string) => {
    if (selectedMenu) return
    setSelectedMenu(menuId)
    sessionStorage.setItem('last_vote_menu', menuId)
    // Non-blocking DB save
    const lastId = sessionStorage.getItem('cupid_last_feedback_id')
    if (lastId) {
      supabase.from('cupid_feedback').update({ menu_ids: [menuId] }).eq('id', lastId)
    }
  }

  const annOptions = settings?.announcement_vote_options?.filter(Boolean) ?? []

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <StatusBar />
        <div style={{ padding: '4px 18px 0' }}><StepDots step={3} /></div>

        {/* ── Section 1: Hero ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 28px 0' }}>
          <div className="bow-anim"><MascotBow size={150} /></div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 24, color: C.brown, marginTop: 8, textAlign: 'center', lineHeight: 1.25 }}>
            ขอบคุณมากเลยครับ ❤️
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brownSoft, marginTop: 6, textAlign: 'center', lineHeight: 1.5 }}>
            คุณเป็นคนที่{' '}
            <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, color: C.brown }}>
              {feedbackCount != null ? feedbackCount.toLocaleString() : '...'}
            </span>{' '}
            ที่ช่วยให้ Best Part ดีขึ้นครับ
          </div>

          {/* Confirmation pill */}
          <div style={{
            marginTop: 12, padding: '7px 16px', borderRadius: 999,
            background: 'rgba(63,142,92,0.12)', border: '1px solid rgba(63,142,92,0.2)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#3F8E5C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7.5L5.5 11L12 4"/></svg>
            <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: '#3F8E5C', fontWeight: 600 }}>
              ส่งให้ทีมงานแล้ว · ทีมงานจะอ่านคืนนี้เองครับ 🙏
            </span>
          </div>
        </div>

        {/* ── Section 2: Menu Vote ── */}
        {menus.length > 0 && (
          <div style={{
            margin: '16px 16px 0', padding: '14px',
            borderRadius: 18, background: 'rgba(232,98,42,0.06)',
            border: '1px solid rgba(232,98,42,0.12)',
          }}>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown, marginBottom: 2 }}>
              เมนูไหนที่คุณชอบมากที่สุดครับ?
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginBottom: 12 }}>
              ไม่บังคับนะครับ
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {menus.map(menu => {
                const selected = selectedMenu === menu.id
                const voted = selectedMenu !== null
                return (
                  <button
                    key={menu.id}
                    onClick={() => handleMenuSelect(menu.id)}
                    disabled={voted && !selected}
                    style={{
                      padding: '10px 6px', borderRadius: 12,
                      border: `2px solid ${selected ? C.orange : 'rgba(44,26,14,0.08)'}`,
                      background: selected ? '#FFF0E6' : '#fff',
                      cursor: voted && !selected ? 'default' : 'pointer',
                      opacity: voted && !selected ? 0.45 : 1,
                      fontFamily: 'inherit', transition: 'all .18s ease',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}
                  >
                    <div style={{
                      fontSize: 24, lineHeight: 1,
                      width: 40, height: 40, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', borderRadius: 10,
                      background: selected ? 'rgba(232,98,42,0.1)' : 'rgba(44,26,14,0.05)',
                    }}>
                      {menu.emoji || (
                        <span style={{ fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 14, color: C.orange }}>
                          {menu.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: '"Sarabun", system-ui', fontSize: 10, fontWeight: 600,
                      color: C.brown, lineHeight: 1.3, textAlign: 'center',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {menu.name}
                    </div>
                    {selected && <div style={{ fontSize: 11, color: C.orange, fontWeight: 700 }}>✓</div>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Section 3: Announcement ── */}
        {settings?.announcement_is_active && (
          <div style={{
            margin: '14px 16px 0', padding: '14px 16px', borderRadius: 18,
            background: 'linear-gradient(135deg, #FFF8F4, #FFF0E6)',
            border: '1.5px solid rgba(232,98,42,0.22)',
          }}>
            <div style={{
              fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700,
              letterSpacing: 1.1, textTransform: 'uppercase', color: C.brownSoft, marginBottom: 6,
            }}>
              📣 มีเรื่องอยากบอก · จากทีมงาน
            </div>
            {settings.announcement_title && (
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, lineHeight: 1.35, marginBottom: 4 }}>
                {settings.announcement_title}
              </div>
            )}
            {settings.announcement_text && (
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, lineHeight: 1.6 }}>
                {settings.announcement_text}
              </div>
            )}
            {annOptions.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {annOptions.map((opt, i) => {
                  const key = String.fromCharCode(65 + i)
                  const on = annVote === key
                  return (
                    <button key={key} onClick={() => !annVote && setAnnVote(key)}
                      disabled={!!annVote && !on}
                      style={{
                        padding: '9px 14px', borderRadius: 12, border: 'none',
                        background: on ? 'rgba(232,98,42,0.15)' : 'rgba(255,255,255,0.7)',
                        boxShadow: on ? '0 0 0 1.5px #E8622A inset' : '0 1px 3px rgba(44,26,14,0.06)',
                        fontFamily: 'inherit', textAlign: 'left', cursor: annVote ? 'default' : 'pointer',
                        opacity: !!annVote && !on ? 0.6 : 1, transition: 'all .2s ease',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                        background: on ? C.orange : 'transparent',
                        border: `1.5px solid ${on ? C.orange : 'rgba(44,26,14,0.2)'}`,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 10,
                      }}>
                        {on ? '✓' : key}
                      </div>
                      <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown, fontWeight: on ? 700 : 400 }}>
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Section 4: Q&A link ── */}
        {settings?.weekly_question && (
          <button onClick={() => navigate('/qa')} style={{
            margin: '12px 16px 0', padding: '12px 16px', borderRadius: 16,
            background: '#fff', border: '1px solid rgba(44,26,14,0.08)',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 17, background: C.orangeSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
            }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown }}>ตอบคำถามของสัปดาห์ →</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginTop: 1 }}>30 วินาที · ข้ามได้ทุกเมื่อครับ</div>
            </div>
          </button>
        )}

        {/* ── Section 5: เหมือนฝัน preview ── */}
        {joeEntry && (
          <div style={{
            margin: '12px 16px 0', padding: '14px 16px', borderRadius: 18,
            background: 'rgba(232,98,42,0.05)', border: '1px solid rgba(232,98,42,0.2)',
          }}>
            <div style={{
              fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase', color: C.orange,
              marginBottom: 10, opacity: 0.8,
            }}>
              💘 เหมือนฝัน · สิ่งที่เราทำตามคำขอของคุณ
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13, background: C.orangeSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>
                {joeEntry.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                  borderRadius: 99, background: 'rgba(100,200,120,0.15)',
                  fontFamily: '"Sarabun", system-ui', fontSize: 10, fontWeight: 700, color: '#4caf78',
                  marginBottom: 4,
                }}>
                  ✅ ทำแล้วครับ
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown, lineHeight: 1.35 }}>
                  {joeEntry.title}
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 2, lineHeight: 1.4 }}>
                  {joeEntry.summary.length > 60 ? joeEntry.summary.slice(0, 60) + '...' : joeEntry.summary}
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/joe-mode')} style={{
              marginTop: 10, background: 'transparent', border: 'none',
              color: C.orange, fontFamily: '"Sarabun", system-ui',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0,
            }}>
              ดูทั้งหมด →
            </button>
          </div>
        )}

        {/* ── Section 6: Social Footer ── */}
        <div style={{ marginTop: 16 }}>
          <SocialFooter feedbackCount={feedbackCount} />
        </div>

        <div style={{ padding: '0 24px 20px', textAlign: 'center' }}>
          <button onClick={() => navigate('/landing')} style={{
            background: 'transparent', border: 'none', color: 'rgba(44,26,14,0.35)',
            fontFamily: '"Sarabun", system-ui', fontSize: 12, cursor: 'pointer',
          }}>
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </MobileFrame>
  )
}
