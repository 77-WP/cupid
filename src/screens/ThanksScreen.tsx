import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileFrame from '../components/MobileFrame'
import { MascotBow } from '../components/Illustrations'
import { C } from '../components/SharedUI'
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
  const [_selectedCat, setSelectedCat] = useState<Category | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItemDB[]>([])
  const [loadingMenus, setLoadingMenus] = useState(false)
  const [tappedId, setTappedId] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)

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

    setTimeout(() => setVoted(true), 600)
  }

  if (categories.length === 0) return null

  return (
    <div style={{
      margin: '16px 16px 0',
      borderRadius: 20,
      background: C.cream,
      padding: '16px',
      transition: 'opacity .35s ease',
    }}>

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleCatSelect(cat)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', padding: '6px 4px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  }}>
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
            <>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
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

      <style>{`
        @keyframes voteThanksFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function ThanksScreen() {
  const navigate = useNavigate()

  const [feedbackCount, setFeedbackCount] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<CupidSettings | null>(null)
  const [joeItems, setJoeItems] = useState<any[]>([])
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [showVote, setShowVote] = useState(false)
  const [qaSelected, setQaSelected] = useState<string | null>(null)

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

    const fetchJoe = async () => {
      const { data } = await supabase
        .from('cupid_joe_mode')
        .select('id, title, icon, status, summary')
        .order('created_at', { ascending: false })
        .limit(8)
      if (data) setJoeItems(data)
    }
    fetchJoe()
  }, [])

  const handleQaAnswer = (ans: string) => {
    if (qaSelected) return
    setQaSelected(ans)
    const lastId = sessionStorage.getItem('last_feedback_id')
    if (lastId) {
      supabase.from('cupid_feedback').update({ qa_answer: ans }).eq('id', lastId)
    }
  }

  return (
    <MobileFrame>
      <style>{`
        @keyframes floatChar {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes sparkleFloat {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
          50% { transform: scale(1.25) translateY(-5px); opacity: 1; }
        }
        @keyframes characterCelebrate {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-4deg); }
          75% { transform: translateY(-6px) rotate(4deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes badgePop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div style={{ background: '#FAF3E8', height: '100dvh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>

        {showVote ? (
          // ── VOTE FLOW ──
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px 8px' }}>
              <button
                onClick={() => setShowVote(false)}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'white', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: '#2C1A0E',
                  boxShadow: '0 2px 8px rgba(44,26,14,0.1)',
                }}
              >
                ‹
              </button>
            </div>
            <MenuVote categories={categories} />
          </div>
        ) : (
          // ── MAIN THANKS VIEW ──
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* ── ZONE 1: HERO ── */}
            <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
                <span style={{ position: 'absolute', top: -6, left: 10, fontSize: 16, animation: 'sparkleFloat 2s ease-in-out infinite' }}>✨</span>
                <span style={{ position: 'absolute', top: -8, right: 8, fontSize: 13, animation: 'sparkleFloat 2.3s ease-in-out 0.3s infinite' }}>✨</span>
                <span style={{ position: 'absolute', bottom: 4, right: 0, fontSize: 11, animation: 'sparkleFloat 1.9s ease-in-out 0.6s infinite' }}>✨</span>
                <div style={{ animation: 'characterCelebrate 0.7s ease-out, floatChar 3s ease-in-out 0.7s infinite' }}>
                  <MascotBow size={80} />
                </div>
              </div>

              <div style={{ marginTop: 14, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: '#2C1A0E', animation: 'fadeSlideUp 0.4s ease-out 0.1s both' }}>
                ขอบคุณมากเลยครับ 🙏
              </div>

              <div style={{ marginTop: 4, fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#6B4C2A', opacity: 0.7, animation: 'fadeSlideUp 0.4s ease-out 0.2s both' }}>
                คุณเป็นส่วนหนึ่งที่ทำให้ Best Part ดีขึ้นครับ
              </div>

              <div style={{
                marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(34,197,94,0.1)', borderRadius: 50, padding: '7px 14px',
                border: '1px solid rgba(34,197,94,0.2)',
                animation: 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
              }}>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#15803D' }}>
                  ✓ ส่งให้ทีมงานแล้วครับ
                </span>
              </div>
            </div>

            {/* ── ZONE 2: MARQUEE ── */}
            <div style={{ marginTop: 16 }}>
              <div style={{ paddingLeft: 20, marginBottom: 8, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 10, color: '#E8622A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                เรื่องที่เราทำเพราะคุณ
              </div>

              {joeItems.length > 0 && (
                <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 28, zIndex: 2, background: 'linear-gradient(to right, #FAF3E8, transparent)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 28, zIndex: 2, background: 'linear-gradient(to left, #FAF3E8, transparent)', pointerEvents: 'none' }} />
                  <div
                    style={{
                      display: 'flex', gap: 8, width: 'fit-content', paddingLeft: 16,
                      animation: 'marqueeScroll 16s linear infinite',
                      animationPlayState: marqueePaused ? 'paused' : 'running',
                    }}
                    onMouseEnter={() => setMarqueePaused(true)}
                    onMouseLeave={() => setMarqueePaused(false)}
                  >
                    {[...joeItems, ...joeItems].map((item: any, idx: number) => {
                      const statusColor = item.status === 'done' ? '#22C55E' : item.status === 'in-progress' ? '#F5A623' : '#94A3B8'
                      const statusLabel = item.status === 'done' ? 'เสร็จ' : item.status === 'in-progress' ? 'กำลังทำ' : 'รับทราบ'
                      return (
                        <div
                          key={`${item.id}-${idx}`}
                          onClick={() => navigate('/meunfun')}
                          style={{
                            flexShrink: 0, width: 110,
                            background: 'white', borderRadius: 12, padding: 10,
                            border: '1.5px solid rgba(44,26,14,0.06)',
                            boxShadow: '0 2px 6px rgba(44,26,14,0.05)',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 9, color: statusColor }}>
                              {statusLabel}
                            </div>
                          </div>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'rgba(232,98,42,0.07)',
                            border: '1.5px dashed rgba(232,98,42,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 8, color: 'rgba(232,98,42,0.3)', margin: '6px 0',
                          }}>
                            img
                          </div>
                          <div style={{
                            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11, color: '#2C1A0E', lineHeight: 1.3,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {item.title}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── ZONE 3: FEATURE CARDS ── */}
            <div style={{
              padding: '12px 16px 0',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
              animation: 'cardEntrance 0.4s ease-out 0.4s both',
            }}>
              {/* Card 1 — โหวตเมนู */}
              <button
                onClick={() => setShowVote(true)}
                style={{
                  borderRadius: 16, padding: 14, cursor: 'pointer', border: 'none', textAlign: 'left',
                  display: 'flex', flexDirection: 'column',
                  background: 'linear-gradient(135deg, #E8622A, #C94E1A)',
                  boxShadow: '0 4px 16px rgba(232,98,42,0.3)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.2)',
                  border: '1.5px dashed rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: 'rgba(255,255,255,0.5)',
                }}>
                  img
                </div>
                <div style={{ marginTop: 8, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: 'white' }}>
                  โหวตเมนูที่ชอบ
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>
                  บอกเราได้เลยครับ
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: 'white', marginTop: 8 }}>
                  เลือกเลย →
                </div>
              </button>

              {/* Card 2 — เหมือนฝัน */}
              <button
                onClick={() => navigate('/meunfun')}
                style={{
                  borderRadius: 16, padding: 14, cursor: 'pointer', border: 'none', textAlign: 'left',
                  display: 'flex', flexDirection: 'column',
                  background: '#2C1A0E',
                  boxShadow: '0 4px 16px rgba(44,26,14,0.25)',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px dashed rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: 'rgba(255,255,255,0.2)',
                }}>
                  img
                </div>
                <div style={{ marginTop: 8, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: 'white' }}>
                  เหมือนฝัน
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>
                  ดูพัฒนาการของเรา
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#F5A623', marginTop: 8 }}>
                  ดูเลย →
                </div>
              </button>

              {/* Conditional Card — Q&A */}
              {settings?.qa_is_active && settings.weekly_question && (
                <div style={{
                  gridColumn: 'span 2',
                  background: 'white', borderRadius: 16, padding: 14,
                  border: '1.5px solid rgba(44,26,14,0.07)',
                  boxShadow: '0 2px 8px rgba(44,26,14,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      background: '#FEF3C7', color: '#B45309',
                      fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 10,
                      padding: '3px 8px', borderRadius: 20,
                    }}>
                      📋 คำถามของสัปดาห์
                    </div>
                  </div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: '#2C1A0E', marginBottom: 10 }}>
                    {settings.weekly_question}
                  </div>
                  {qaSelected ? (
                    <div style={{
                      padding: '8px 14px', borderRadius: 10,
                      background: 'rgba(63,142,92,0.1)', border: '1px solid rgba(63,142,92,0.2)',
                      fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#3F8E5C', fontWeight: 600,
                    }}>
                      ✓ ขอบคุณครับ
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(settings.weekly_question_options || []).filter(Boolean).map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleQaAnswer(opt)}
                          style={{
                            padding: '8px 14px', borderRadius: 50,
                            border: '1.5px solid rgba(232,98,42,0.3)',
                            background: 'transparent', color: '#E8622A',
                            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Card — Announcement */}
              {!settings?.qa_is_active && settings?.announcement_is_active && settings.announcement_text && (
                <div style={{
                  gridColumn: 'span 2',
                  background: '#FFF8EE', borderRadius: 16, padding: 14,
                  border: '1.5px dashed rgba(232,98,42,0.25)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 10,
                      color: '#E8622A', letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>
                      ANNOUNCEMENT
                    </div>
                  </div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#2C1A0E', lineHeight: 1.6, marginTop: 6 }}>
                    {settings.announcement_text}
                  </div>
                </div>
              )}
            </div>

            {/* ── ZONE 4: CTA ── */}
            <div style={{ padding: '14px 16px 24px', marginTop: 'auto' }}>
              <button
                onClick={() => navigate('/meunfun')}
                style={{
                  width: '100%', padding: 14, borderRadius: 50,
                  background: 'transparent',
                  border: '1.5px solid #E8622A',
                  color: '#E8622A',
                  fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                ดูเมนูและสั่งอาหาร →
              </button>

              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <SocialFooter feedbackCount={feedbackCount} />
              </div>

              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <button
                  onClick={() => navigate('/landing')}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.35)',
                  }}
                >
                  กลับหน้าแรก
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </MobileFrame>
  )
}
