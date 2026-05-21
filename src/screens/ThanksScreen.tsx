import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBow } from '../components/Illustrations'
import { StatusBar, StepDots, C } from '../components/SharedUI'
import SocialFooter from '../components/SocialFooter'
import { supabase } from '../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────

interface Category {
  id: string
  name_th: string
  image_url: string | null
  display_order: number
}

interface MenuItemDB {
  id: string
  name_th: string
  image_url: string | null
  base_price: number | null
  display_order: number
}

interface JoeEntry {
  id: string
  title: string
  icon: string
  summary: string
}

interface CupidSettings {
  announcement_is_active: boolean
  announcement_title: string | null
  announcement_text: string | null
  announcement_mode: string | null
  announcement_vote_options: string[] | null
  announcement_priority: string | null
  qa_is_active: boolean
  weekly_question: string | null
  weekly_question_options: string[] | null
  qa_priority: string | null
}

// ── Section: Menu Vote (2-step: category → menu) ──────────────────────────

const BEST_SELLER_CAT_ID = 'c492de49-8cf0-4e00-9602-cebeb3ce7921'

function MenuVote({ categories }: { categories: Category[] }) {
  const [step, setStep] = useState<'category' | 'menu'>('category')
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItemDB[]>([])
  const [loadingMenus, setLoadingMenus] = useState(false)
  const [tappedId, setTappedId] = useState<string | null>(null)   // brief scale-up
  const [voted, setVoted] = useState(false)                        // show thank-you card

  const handleCatSelect = async (cat: Category) => {
    setSelectedCat(cat)
    setLoadingMenus(true)
    setStep('menu')
    const { data, error } = await supabase
      .from('menu_items')
      .select('id, name_th, image_url, base_price, display_order')
      .eq('category_id', cat.id)
      .eq('is_active', true)
      .order('display_order')
    console.log('Menu items:', data, error)
    setMenuItems(data || [])
    setLoadingMenus(false)
  }

  const handleMenuSelect = async (menu: MenuItemDB) => {
    if (tappedId) return
    setTappedId(menu.id)

    // FIX 1: Save vote_choice (name_th) to cupid_feedback row
    const feedbackId = sessionStorage.getItem('last_feedback_id')
    console.log('Saving vote, feedback_id:', feedbackId, 'vote:', menu.name_th)
    if (feedbackId) {
      const { error } = await supabase
        .from('cupid_feedback')
        .update({ vote_choice: menu.name_th })
        .eq('id', feedbackId)
      if (error) console.error('Vote save error:', error)
      else console.log('Vote saved successfully')
    } else {
      console.warn('No feedback_id in sessionStorage — cannot save vote')
    }

    // After 600ms cross-fade to thank-you card
    setTimeout(() => setVoted(true), 600)
  }

  if (categories.length === 0) return null

  return (
    <div style={{
      margin: '16px 16px 0',
      borderRadius: 20,
      background: C.cream,
      padding: '16px',
      // transition for cross-fade
      transition: 'opacity .35s ease',
    }}>

      {/* Thank-you card (post-vote) */}
      {voted ? (
        <div style={{
          background: '#fff',
          borderRadius: 18,
          padding: '20px 16px',
          boxShadow: '0 4px 20px rgba(44,26,14,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          animation: 'voteThanksFadeIn .35s ease forwards',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 20,
            background: 'rgba(232,98,42,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10.5L8 14.5L16 6"/>
            </svg>
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown }}>
            รับทราบแล้วครับ 🙏
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, textAlign: 'center' }}>
            ขอบคุณที่ช่วยให้เราดีขึ้นครับ
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: C.brown, marginBottom: 2 }}>
            เมนูไหนที่คุณชอบมากที่สุดครับ?
          </div>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginBottom: 10 }}>
            ไม่บังคับนะครับ
          </div>

          {step === 'category' ? (
            /* ── Step 1: Category Grid (3-col, 64px circles) ── */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleCatSelect(cat)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', padding: '6px 4px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  }}>
                  {/* 64px circle icon */}
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
                  }}>
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name_th}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        background: 'rgba(232,98,42,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 20, color: C.orange,
                      }}>
                        {cat.name_th.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontFamily: '"Sarabun", system-ui', fontSize: 11, fontWeight: 600,
                    color: C.brown, lineHeight: 1.3, textAlign: 'center',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', maxWidth: '100%',
                  }}>
                    {cat.name_th}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* ── Step 2: Circular photo grid (3-col) ── */
            <>
              {/* Back button */}
              <button onClick={() => setStep('category')}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 0 10px',
                  fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.orange, fontWeight: 500,
                }}>
                ← กลับ
              </button>

              {loadingMenus ? (
                <div style={{ textAlign: 'center', padding: '20px 0', fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft }}>
                  กำลังโหลด...
                </div>
              ) : menuItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft }}>
                  ไม่มีเมนูในหมวดนี้ครับ
                </div>
              ) : (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
                }}>
                  {menuItems.map(menu => {
                    const on = tappedId === menu.id
                    const isDisabled = tappedId !== null && !on
                    return (
                      <button key={menu.id} onClick={() => handleMenuSelect(menu)}
                        disabled={isDisabled}
                        style={{
                          background: 'transparent', border: 'none',
                          cursor: isDisabled ? 'default' : 'pointer',
                          opacity: isDisabled ? 0.4 : 1,
                          fontFamily: 'inherit', padding: '6px 4px',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                          transition: 'opacity .2s ease',
                        }}>
                        {/* 72px circle photo with optional selected ring */}
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{
                            width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
                            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
                            outline: on ? `3px solid ${C.orange}` : '3px solid transparent',
                            outlineOffset: 2,
                            transition: 'outline .12s ease',
                          }}>
                            {menu.image_url ? (
                              <img src={menu.image_url} alt={menu.name_th}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }} />
                            ) : (
                              <div style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                background: 'rgba(44,26,14,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 20, color: C.orange,
                              }}>
                                {menu.name_th.charAt(0)}
                              </div>
                            )}
                          </div>
                          {/* Orange checkmark badge */}
                          {on && (
                            <div style={{
                              position: 'absolute', top: 0, right: 0,
                              width: 14, height: 14, borderRadius: '50%',
                              background: C.orange,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '1.5px solid #fff',
                            }}>
                              <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1.5 4L3 5.5L6.5 2"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        {/* Name */}
                        <div style={{
                          fontFamily: '"Sarabun", system-ui', fontSize: 11, fontWeight: 600,
                          color: C.brown, lineHeight: 1.3, textAlign: 'center',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          overflow: 'hidden', maxWidth: '100%',
                        }}>
                          {menu.name_th}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Keyframe for thank-you card fade-in */}
      <style>{`
        @keyframes voteThanksFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// ── Section: Announcement Card ─────────────────────────────────────────────

function AnnouncementCard({ settings, size }: { settings: CupidSettings; size: 'primary' | 'secondary' }) {
  const [vote, setVote] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(size === 'primary')
  const opts = (settings.announcement_vote_options || []).filter(Boolean)

  const isPrimary = size === 'primary'

  return (
    <div style={{
      padding: isPrimary ? '14px 16px' : '10px 14px',
      borderRadius: 18,
      background: isPrimary ? 'linear-gradient(135deg, #FFF8F4, #FFF0E6)' : 'rgba(44,26,14,0.03)',
      border: isPrimary ? '1.5px solid rgba(232,98,42,0.4)' : '1px solid rgba(44,26,14,0.1)',
    }}>
      <div style={{
        fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700,
        letterSpacing: 1.1, textTransform: 'uppercase',
        color: isPrimary ? C.brownSoft : 'rgba(44,26,14,0.4)', marginBottom: isPrimary ? 6 : 4,
      }}>
        📣 มีเรื่องอยากบอก · จากทีมงาน
      </div>

      {/* Secondary: tap to expand */}
      {!isPrimary ? (
        <button onClick={() => setExpanded(e => !e)} style={{
          background: 'transparent', border: 'none', padding: 0,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', width: '100%',
          textAlign: 'left',
        }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: C.brown, flex: 1 }}>
            {settings.announcement_title || 'ข้อความจากทีมงาน'}
          </div>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={C.brownSoft} strokeWidth="2.2" strokeLinecap="round">
            <path d={expanded ? 'M2 10l5-5 5 5' : 'M2 5l5 5 5-5'} />
          </svg>
        </button>
      ) : (
        settings.announcement_title && (
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, lineHeight: 1.35, marginBottom: 4 }}>
            {settings.announcement_title}
          </div>
        )
      )}

      {(isPrimary || expanded) && (
        <>
          {settings.announcement_text && (
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, lineHeight: 1.6, marginTop: isPrimary ? 0 : 8 }}>
              {settings.announcement_text}
            </div>
          )}
          {opts.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {opts.map((opt, i) => {
                const key = String.fromCharCode(65 + i)
                const on = vote === key
                return (
                  <button key={key} onClick={() => !vote && setVote(key)} disabled={!!vote && !on}
                    style={{
                      padding: '9px 14px', borderRadius: 12, border: 'none',
                      background: on ? 'rgba(232,98,42,0.15)' : 'rgba(255,255,255,0.7)',
                      boxShadow: on ? '0 0 0 1.5px #E8622A inset' : '0 1px 3px rgba(44,26,14,0.06)',
                      fontFamily: 'inherit', textAlign: 'left',
                      cursor: vote ? 'default' : 'pointer',
                      opacity: !!vote && !on ? 0.6 : 1, transition: 'all .2s ease',
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
        </>
      )}
    </div>
  )
}

// ── Section: Inline Q&A ────────────────────────────────────────────────────

function QACard({ settings, size }: { settings: CupidSettings; size: 'primary' | 'secondary' }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [expanded, setExpanded] = useState(size === 'primary')
  const options = (settings.weekly_question_options || []).filter(Boolean)
  const isPrimary = size === 'primary'

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    setDone(true)
    const lastId = sessionStorage.getItem('last_feedback_id')
    if (lastId) {
      supabase.from('cupid_feedback').update({ qa_answer: ans }).eq('id', lastId)
    }
  }

  return (
    <div style={{
      padding: isPrimary ? '14px 16px' : '10px 14px',
      borderRadius: 18,
      background: isPrimary ? '#fff' : 'rgba(44,26,14,0.03)',
      border: isPrimary ? '1.5px solid rgba(44,26,14,0.1)' : '1px solid rgba(44,26,14,0.08)',
    }}>
      <div style={{
        fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700,
        letterSpacing: 1, textTransform: 'uppercase',
        color: isPrimary ? C.orange : 'rgba(44,26,14,0.35)', marginBottom: isPrimary ? 6 : 4,
      }}>
        📋 คำถามของสัปดาห์
      </div>

      {!isPrimary ? (
        <button onClick={() => setExpanded(e => !e)} style={{
          background: 'transparent', border: 'none', padding: 0,
          display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', width: '100%', textAlign: 'left',
        }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: C.brown, flex: 1 }}>
            {settings.weekly_question || 'คำถามสัปดาห์นี้'}
          </div>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke={C.brownSoft} strokeWidth="2.2" strokeLinecap="round">
            <path d={expanded ? 'M2 10l5-5 5 5' : 'M2 5l5 5 5-5'} />
          </svg>
        </button>
      ) : (
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, lineHeight: 1.35, marginBottom: 10 }}>
          {settings.weekly_question}
        </div>
      )}

      {(isPrimary || expanded) && (
        <>
          {done ? (
            <div style={{
              marginTop: 10, padding: '8px 14px', borderRadius: 10,
              background: 'rgba(63,142,92,0.1)', border: '1px solid rgba(63,142,92,0.2)',
              fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#3F8E5C', fontWeight: 600,
            }}>
              ✓ ขอบคุณครับ
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: isPrimary ? 0 : 10 }}>
                {options.map(opt => {
                  const on = selected === opt
                  return (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      style={{
                        padding: '8px 16px', borderRadius: 20,
                        border: `1.5px solid ${on ? C.orange : C.orange}`,
                        background: on ? C.orange : 'transparent',
                        color: on ? '#fff' : C.orange,
                        fontFamily: '"Sarabun", system-ui', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', transition: 'all .15s ease',
                      }}>
                      {opt}
                    </button>
                  )
                })}
              </div>
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <button onClick={() => setDone(true)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.3)',
                }}>
                  ข้ามครับ
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function ThanksScreen() {
  const navigate = useNavigate()

  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<CupidSettings | null>(null)
  const [joeEntry, setJoeEntry] = useState<JoeEntry | null>(null)

  useEffect(() => {
    supabase.from('cupid_feedback').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count != null) setFeedbackCount(count)
    })

    supabase
      .from('categories')
      .select('id, name_th, image_url, display_order')
      .neq('id', BEST_SELLER_CAT_ID)
      .order('display_order')
      .limit(6)
      .then(({ data, error }) => {
        console.log('Categories:', data, error)
        if (!error && data && data.length > 0) setCategories(data as Category[])
      })

    supabase.from('cupid_settings').select('*').eq('id', 1).single().then(({ data }) => {
      if (data) setSettings(data as CupidSettings)
    })

    supabase.from('cupid_joe_mode').select('id, title, icon, summary').eq('status', 'done')
      .order('display_order', { ascending: false }).limit(1).single().then(({ data }) => {
        if (data) setJoeEntry(data as JoeEntry)
      })
  }, [])

  // Build ordered cards array
  const cards: { type: 'announcement' | 'qa'; size: 'primary' | 'secondary' }[] = []
  if (settings?.announcement_is_active) {
    cards.push({ type: 'announcement', size: (settings.announcement_priority || 'primary') as 'primary' | 'secondary' })
  }
  if (settings?.qa_is_active) {
    cards.push({ type: 'qa', size: (settings.qa_priority || 'secondary') as 'primary' | 'secondary' })
  }
  // Sort: primary first; if both claim primary, first one wins primary
  cards.sort((a, b) => a.size === 'primary' && b.size !== 'primary' ? -1 : b.size === 'primary' && a.size !== 'primary' ? 1 : 0)
  // If only 1 card, force it primary
  if (cards.length === 1) cards[0].size = 'primary'
  // If both claim primary, demote the second
  if (cards.length === 2 && cards[0].size === 'primary' && cards[1].size === 'primary') {
    cards[1].size = 'secondary'
  }

  return (
    <MobileFrame>
      <div style={{ background: C.cream, minHeight: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <StatusBar />
        <div style={{ padding: '4px 18px 0' }}><StepDots step={3} /></div>

        {/* ── Hero ── */}
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

        {/* ── Menu Vote ── */}
        <MenuVote categories={categories} />

        {/* ── Announcement + Q&A (ordered by priority) ── */}
        {settings && cards.length > 0 && (
          <div style={{ margin: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cards.map(card => (
              card.type === 'announcement'
                ? <AnnouncementCard key="ann" settings={settings} size={card.size} />
                : <QACard key="qa" settings={settings} size={card.size} />
            ))}
          </div>
        )}

        {/* ── เหมือนฝัน preview ── */}
        {joeEntry && (
          <div style={{
            margin: '12px 16px 0', padding: '14px 16px', borderRadius: 18,
            background: 'rgba(232,98,42,0.05)', border: '1px solid rgba(232,98,42,0.2)',
          }}>
            <div style={{
              fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700,
              letterSpacing: 1, textTransform: 'uppercase', color: C.orange, marginBottom: 10, opacity: 0.8,
            }}>
              💘 เหมือนฝัน · สิ่งที่เราทำตามคำขอของคุณ
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13, background: C.orangeSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
              }}>
                {joeEntry.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
                  borderRadius: 99, background: 'rgba(100,200,120,0.15)',
                  fontFamily: '"Sarabun", system-ui', fontSize: 10, fontWeight: 700, color: '#4caf78', marginBottom: 4,
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
              color: C.orange, fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0,
            }}>
              ดูทั้งหมด →
            </button>
          </div>
        )}

        {/* ── Social Footer ── */}
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
