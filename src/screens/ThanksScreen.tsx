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

// ── Vote Flow (category → menu → confirmation) ─────────────────────────────

const BEST_SELLER_CAT_ID = 'c492de49-8cf0-4e00-9602-cebeb3ce7921'

function MenuVote({ categories, onClose }: { categories: Category[]; onClose?: () => void }) {
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

  // Post-vote confirmation
  if (voted) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: 32 }}>✨</div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 18, color: '#2C1A0E', marginTop: 8 }}>
          รับทราบแล้วครับ 🙏
        </div>
        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#6B4C2A', marginTop: 4 }}>
          ขอบคุณที่บอกเราครับ
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              marginTop: 16,
              padding: '10px 32px', borderRadius: 50,
              background: '#E8622A', color: 'white',
              fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
            }}
          >
            ปิด
          </button>
        )}
      </div>
    )
  }

  if (categories.length === 0) return null

  return (
    <div>
      <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown, marginBottom: 2 }}>
        เมนูไหนที่คุณชอบมากที่สุดครับ?
      </div>
      <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginBottom: 12 }}>
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
  const [showVoteSheet, setShowVoteSheet] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
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
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
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

  const currentSlide = joeItems[slideIndex]

  return (
    <MobileFrame>
      <style>{`
        @keyframes floatChar {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes celebrateChar {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-4deg); }
          75% { transform: translateY(-7px) rotate(4deg); }
        }
        @keyframes sparkleFloat {
          0%,100% { transform: scale(1) translateY(0); opacity: 0.7; }
          50% { transform: scale(1.3) translateY(-5px); opacity: 1; }
        }
        @keyframes badgePop {
          0% { transform: scale(0.75); opacity: 0; }
          65% { transform: scale(1.07); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes dimIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ── Vote Bottom Sheet ── */}
      {showVoteSheet && (
        <>
          <div
            onClick={() => setShowVoteSheet(false)}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.45)',
              animation: 'dimIn 0.25s ease-out',
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 51,
              background: '#FAF3E8',
              borderRadius: '24px 24px 0 0',
              maxHeight: '85vh', overflowY: 'auto',
              animation: 'sheetSlideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div style={{
              padding: '16px 20px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid rgba(44,26,14,0.07)',
            }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, color: '#2C1A0E' }}>
                เลือกเมนูที่ชอบครับ
              </div>
              <button
                onClick={() => setShowVoteSheet(false)}
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(44,26,14,0.07)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: '#2C1A0E', cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '16px 20px 32px' }}>
              <MenuVote categories={categories} onClose={() => setShowVoteSheet(false)} />
            </div>
          </div>
        </>
      )}

      {/* ── Main Scrollable Content ── */}
      <div style={{ background: '#FAF3E8', paddingBottom: 32, overflowY: 'auto' }}>

        {/* ── ZONE 1: HERO ── */}
        <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
            <span style={{ position: 'absolute', top: -8, left: 12, fontSize: 16, animation: 'sparkleFloat 2s ease-in-out infinite' }}>✦</span>
            <span style={{ position: 'absolute', top: -10, right: 6, fontSize: 13, animation: 'sparkleFloat 2.4s ease-in-out 0.3s infinite' }}>✦</span>
            <span style={{ position: 'absolute', bottom: 2, right: -2, fontSize: 10, animation: 'sparkleFloat 1.8s ease-in-out 0.6s infinite' }}>✦</span>
            <div style={{ animation: 'celebrateChar 0.8s ease-out, floatChar 3s ease-in-out 0.8s infinite' }}>
              <MascotBow size={76} />
            </div>
          </div>

          <div style={{ marginTop: 14, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 22, color: '#2C1A0E', animation: 'fadeUp 0.4s ease-out 0.1s both' }}>
            ขอบคุณมากเลยครับ 🙏
          </div>

          <div style={{ marginTop: 4, fontFamily: '"Sarabun", system-ui', fontSize: 13, color: 'rgba(44,26,14,0.55)', animation: 'fadeUp 0.4s ease-out 0.2s both' }}>
            คุณเป็นส่วนหนึ่งที่ทำให้ Best Part ดีขึ้นครับ
          </div>

          <div style={{
            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(34,197,94,0.1)', borderRadius: 50, padding: '7px 16px',
            border: '1px solid rgba(34,197,94,0.2)',
            animation: 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
          }}>
            <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#15803D' }}>
              ✓ ส่งให้ทีมงานแล้วครับ
            </span>
          </div>
        </div>

        {/* ── ZONE 2: MARQUEE ── */}
        <div style={{ marginTop: 18 }}>
          <div style={{ paddingLeft: 20, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 1.5, background: '#E8622A', opacity: 0.4, flexShrink: 0 }} />
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 10, color: '#E8622A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              เรื่องที่เราทำเพราะคุณ
            </div>
          </div>

          {joeItems.length > 0 && (
            <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, zIndex: 2, background: 'linear-gradient(to right, #FAF3E8, transparent)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, zIndex: 2, background: 'linear-gradient(to left, #FAF3E8, transparent)', pointerEvents: 'none' }} />
              <div
                style={{
                  display: 'flex', gap: 8, width: 'fit-content', paddingLeft: 16,
                  animation: 'marqueeScroll 18s linear infinite',
                  animationPlayState: marqueePaused ? 'paused' : 'running',
                }}
                onMouseEnter={() => setMarqueePaused(true)}
                onMouseLeave={() => setMarqueePaused(false)}
              >
                {[...joeItems, ...joeItems].map((item: any, idx: number) => {
                  const statusColor = item.status === 'done' ? '#22C55E' : item.status === 'in-progress' ? '#F5A623' : '#94A3B8'
                  const statusTextColor = item.status === 'done' ? '#15803D' : item.status === 'in-progress' ? '#B45309' : '#64748B'
                  const statusLabel = item.status === 'done' ? 'เสร็จ' : item.status === 'in-progress' ? 'กำลังทำ' : 'รับทราบ'
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => navigate('/meunfun')}
                      style={{
                        flexShrink: 0, width: 108,
                        background: 'white', borderRadius: 12, padding: 10,
                        border: '1.5px solid rgba(44,26,14,0.06)',
                        boxShadow: '0 2px 6px rgba(44,26,14,0.04)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
                        <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 9, color: statusTextColor }}>
                          {statusLabel}
                        </div>
                      </div>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(232,98,42,0.07)',
                        border: '1.5px dashed rgba(232,98,42,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 8, color: 'rgba(232,98,42,0.3)',
                        marginBottom: 6,
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

        {/* ── ZONE 3: FEATURE CARDS GRID ── */}
        <div style={{
          padding: '14px 16px 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          animation: 'fadeUp 0.4s ease-out 0.4s both',
        }}>
          {/* Card A — โหวตเมนู */}
          <div
            onClick={() => setShowVoteSheet(true)}
            style={{
              background: 'linear-gradient(145deg, #E8622A, #C94E1A)',
              borderRadius: 18, padding: 16,
              boxShadow: '0 6px 20px rgba(232,98,42,0.35)',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px dashed rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: 'rgba(255,255,255,0.45)',
            }}>
              img
            </div>
            <div style={{ marginTop: 10, fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: 'white' }}>
              โหวตเมนูที่ชอบ
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
              บอกเราได้เลยครับ
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: 'white', marginTop: 10 }}>
              เลือกเลย →
            </div>
          </div>

          {/* Card B — Weekly Q&A or placeholder */}
          {settings?.qa_is_active && settings.weekly_question ? (
            <div style={{
              background: 'white',
              borderRadius: 18, padding: 16,
              border: '1.5px solid rgba(245,166,35,0.25)',
              boxShadow: '0 4px 14px rgba(245,166,35,0.12)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8,
                background: '#FEF3C7', borderRadius: 20, padding: '3px 8px',
                alignSelf: 'flex-start',
              }}>
                <span style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 9, color: '#B45309' }}>
                  📋 คำถามสัปดาห์นี้
                </span>
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13, color: '#2C1A0E', lineHeight: 1.4, marginBottom: 10, flex: 1 }}>
                {settings.weekly_question}
              </div>
              {qaSelected ? (
                <div style={{
                  padding: '6px 10px', borderRadius: 50,
                  background: '#E8622A', color: 'white',
                  fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11,
                  textAlign: 'center',
                }}>
                  ✓ ขอบคุณครับ
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(settings.weekly_question_options || []).filter(Boolean).slice(0, 3).map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleQaAnswer(opt)}
                      style={{
                        padding: '8px 10px', borderRadius: 50,
                        border: '1.5px solid rgba(232,98,42,0.25)',
                        background: 'transparent', color: '#E8622A',
                        fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 11,
                        cursor: 'pointer', textAlign: 'center',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              background: '#F5F0EA',
              borderRadius: 18, padding: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 140,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
              <div style={{
                fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.35)',
                textAlign: 'center', lineHeight: 1.6, whiteSpace: 'pre-line',
              }}>
                {'ยังไม่มีคำถาม\nของสัปดาห์นี้ครับ'}
              </div>
            </div>
          )}
        </div>

        {/* ── ZONE 4: เหมือนฝัน SLIDESHOW ── */}
        {joeItems.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {/* Section Header */}
            <div style={{ padding: '0 20px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: '#2C1A0E' }}>
                เหมือนฝัน ✨
              </div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {joeItems.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 6, borderRadius: 3,
                      background: i === slideIndex ? '#E8622A' : 'rgba(44,26,14,0.15)',
                      width: i === slideIndex ? 16 : 6,
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Slide Container */}
            <div
              style={{ position: 'relative', overflow: 'hidden', marginLeft: 16, marginRight: 16, borderRadius: 20 }}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX === null) return
                const diff = touchStartX - e.changedTouches[0].clientX
                if (diff > 40 && slideIndex < joeItems.length - 1) setSlideIndex(prev => prev + 1)
                if (diff < -40 && slideIndex > 0) setSlideIndex(prev => prev - 1)
                setTouchStartX(null)
              }}
            >
              {currentSlide && (
                <div
                  key={slideIndex}
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(44,26,14,0.08)',
                    border: '1.5px solid rgba(44,26,14,0.05)',
                    animation: 'slideLeft 0.3s ease-out',
                  }}
                >
                  {/* Hero Area */}
                  <div style={{
                    height: 120,
                    background: 'linear-gradient(135deg, #FFF3EC, #FDEBD0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 14,
                      background: 'rgba(232,98,42,0.1)',
                      border: '2px dashed rgba(232,98,42,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'rgba(232,98,42,0.35)',
                    }}>
                      img
                    </div>
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      borderRadius: 20, padding: '4px 10px',
                      fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 10,
                      background: currentSlide.status === 'done' ? '#DCFCE7' : currentSlide.status === 'in-progress' ? '#FEF3C7' : '#F1F5F9',
                      color: currentSlide.status === 'done' ? '#15803D' : currentSlide.status === 'in-progress' ? '#B45309' : '#64748B',
                    }}>
                      {currentSlide.status === 'done' ? '✅ ทำแล้วครับ' : currentSlide.status === 'in-progress' ? '⏳ กำลังทำ' : '💬 รับทราบ'}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '14px 16px 16px' }}>
                    {currentSlide.inspired_by_nickname && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#E8622A',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 9, color: 'white',
                          flexShrink: 0,
                        }}>
                          {String(currentSlide.inspired_by_nickname).charAt(0)}
                        </div>
                        <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: '#E8622A', fontStyle: 'italic' }}>
                          Inspired by {currentSlide.inspired_by_nickname}
                        </div>
                      </div>
                    )}

                    <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 17, color: '#2C1A0E', lineHeight: 1.3, marginBottom: 6 }}>
                      {currentSlide.title}
                    </div>

                    <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#6B4C2A', lineHeight: 1.65, marginBottom: 12 }}>
                      {currentSlide.story_text
                        ? String(currentSlide.story_text).slice(0, 100) + (String(currentSlide.story_text).length > 100 ? '...' : '')
                        : currentSlide.summary}
                    </div>

                    {/* Mini Timeline */}
                    {(() => {
                      const tItems: any[] = Array.isArray(currentSlide.timeline) ? currentSlide.timeline.slice(-2) : []
                      return tItems.length > 0 ? (
                        <div style={{ marginBottom: 12 }}>
                          {tItems.map((tItem: any, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                              <div style={{
                                width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                                background: i === tItems.length - 1 ? '#E8622A' : '#D4C4B0',
                              }} />
                              <div>
                                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: 'rgba(44,26,14,0.45)' }}>
                                  {tItem.date}
                                </div>
                                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: '#2C1A0E', lineHeight: 1.5 }}>
                                  {tItem.note}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null
                    })()}

                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(44,26,14,0.06)',
                    }}>
                      <div
                        onClick={() => navigate('/meunfun')}
                        style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12, color: '#E8622A', cursor: 'pointer' }}
                      >
                        ดูทั้งหมด →
                      </div>
                      <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 11, color: 'rgba(44,26,14,0.3)' }}>
                        {slideIndex + 1} / {joeItems.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Arrows */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10 }}>
              <button
                onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'white', border: '1.5px solid rgba(44,26,14,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 14,
                  opacity: slideIndex === 0 ? 0.3 : 1,
                }}
              >
                ‹
              </button>
              <button
                onClick={() => setSlideIndex(prev => Math.min(joeItems.length - 1, prev + 1))}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'white', border: '1.5px solid rgba(44,26,14,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 14,
                  opacity: slideIndex === joeItems.length - 1 ? 0.3 : 1,
                }}
              >
                ›
              </button>
            </div>
          </div>
        )}

        {/* ── ZONE 5: CTA ── */}
        <div style={{ padding: '16px 16px 8px' }}>
          <button
            onClick={() => navigate('/meunfun')}
            style={{
              width: '100%', padding: 14, borderRadius: 50,
              background: 'transparent', border: '1.5px solid #E8622A',
              color: '#E8622A',
              fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ดูเมนูและสั่งอาหาร →
          </button>

          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <SocialFooter feedbackCount={feedbackCount} hideCTA />
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
    </MobileFrame>
  )
}
