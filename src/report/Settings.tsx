/**
 * ─── SUPABASE SQL — Run in SQL Editor before testing ───────────────────────
 *
 * ALTER TABLE cupid_settings
 * ADD COLUMN IF NOT EXISTS announcement_title TEXT,
 * ADD COLUMN IF NOT EXISTS announcement_mode TEXT DEFAULT 'info',
 * ADD COLUMN IF NOT EXISTS announcement_priority TEXT DEFAULT 'primary',
 * ADD COLUMN IF NOT EXISTS qa_priority TEXT DEFAULT 'secondary',
 * ADD COLUMN IF NOT EXISTS qa_is_active BOOLEAN DEFAULT false;
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  orange: '#E8622A',
  orangeSoft: '#FFF0E6',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  card: '#fff',
  bg: '#F5EDD8',
}

// ── Types ──────────────────────────────────────────────────────────────────

interface SettingsData {
  announcement_is_active: boolean
  announcement_title: string
  announcement_text: string
  announcement_mode: 'info' | 'vote'
  announcement_vote_options: string[]
  announcement_priority: 'primary' | 'secondary'
  qa_is_active: boolean
  weekly_question: string
  weekly_question_options: string[]
  qa_priority: 'primary' | 'secondary'
}

const DEFAULT: SettingsData = {
  announcement_is_active: false,
  announcement_title: '',
  announcement_text: '',
  announcement_mode: 'info',
  announcement_vote_options: ['', '', '', ''],
  announcement_priority: 'primary',
  qa_is_active: false,
  weekly_question: '',
  weekly_question_options: ['', '', ''],
  qa_priority: 'secondary',
}

// ── Primitive field components ─────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 700,
      color: C.brownSoft, marginBottom: 6, letterSpacing: 0.2,
    }}>
      {children}
    </div>
  )
}

function LineInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '8px 0', background: 'transparent',
        border: 'none', borderBottom: '1.5px solid rgba(44,26,14,0.18)',
        fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown,
        outline: 'none', boxSizing: 'border-box',
      }}
    />
  )
}

function LineTextarea({
  value, onChange, placeholder, rows = 3,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', padding: '8px 0', background: 'transparent',
        border: 'none', borderBottom: '1.5px solid rgba(44,26,14,0.18)',
        fontFamily: '"Sarabun", system-ui', fontSize: 14, color: C.brown,
        outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6,
      }}
    />
  )
}

function PillPicker<T extends string>({
  value, onChange, options,
}: {
  value: T
  onChange: (v: T) => void
  options: { val: T; label: string }[]
}) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map(o => {
        const on = value === o.val
        return (
          <button
            key={o.val}
            onClick={() => onChange(o.val)}
            style={{
              flex: 1, padding: '9px 12px', borderRadius: 10, border: 'none',
              background: on ? C.orange : 'rgba(44,26,14,0.07)',
              color: on ? '#fff' : C.brownSoft,
              fontFamily: '"Sarabun", system-ui', fontSize: 13,
              fontWeight: on ? 700 : 400, cursor: 'pointer',
              transition: 'all .15s ease',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 48, height: 26, borderRadius: 13, border: 'none',
        background: on ? C.orange : 'rgba(44,26,14,0.2)',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background .2s ease',
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: on ? 24 : 3, width: 20, height: 20,
        borderRadius: 10, background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left .2s ease',
      }} />
    </button>
  )
}

// ── Card wrapper ───────────────────────────────────────────────────────────

function SectionCard({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, padding: '20px',
      border: `1px solid ${highlight ? 'rgba(232,98,42,0.25)' : 'rgba(44,26,14,0.08)'}`,
      boxShadow: highlight ? '0 0 0 3px rgba(232,98,42,0.06)' : 'none',
    }}>
      {children}
    </div>
  )
}

// ── Preview ────────────────────────────────────────────────────────────────

function PreviewSlot({
  label, item,
}: {
  label: 'Primary' | 'Secondary'
  item: { icon: string; title: string; mode?: string } | null
}) {
  const isPrimary = label === 'Primary'
  return (
    <div style={{
      flex: 1, borderRadius: 14, overflow: 'hidden',
      border: `1.5px ${item ? 'solid rgba(232,98,42,0.22)' : 'dashed rgba(44,26,14,0.15)'}`,
      background: item
        ? (isPrimary ? 'linear-gradient(135deg, #FFF8F4, #FFE8D6)' : 'rgba(44,26,14,0.03)')
        : 'transparent',
      minHeight: 80, padding: '12px',
      display: 'flex', flexDirection: 'column', justifyContent: item ? 'flex-start' : 'center',
      alignItems: item ? 'flex-start' : 'center',
    }}>
      <div style={{
        fontFamily: '"DM Sans", system-ui', fontSize: 9, fontWeight: 700,
        letterSpacing: 1.2, textTransform: 'uppercase',
        color: item ? (isPrimary ? C.orange : C.brownSoft) : 'rgba(44,26,14,0.25)',
        marginBottom: item ? 6 : 0,
      }}>
        {label}
      </div>
      {item ? (
        <>
          <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
          <div style={{
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 12,
            color: C.brown, lineHeight: 1.3,
          }}>
            {item.title || '—'}
          </div>
          {item.mode === 'vote' && (
            <div style={{
              marginTop: 4, fontFamily: '"Sarabun", system-ui', fontSize: 10,
              color: C.brownSoft,
            }}>🗳️ มีตัวเลือก A/B/C/D</div>
          )}
        </>
      ) : (
        <div style={{
          fontFamily: '"Sarabun", system-ui', fontSize: 12,
          color: 'rgba(44,26,14,0.3)',
        }}>ว่างอยู่ครับ</div>
      )}
    </div>
  )
}

function LivePreview({ data }: { data: SettingsData }) {
  // Resolve which item goes to which slot
  const annItem = data.announcement_is_active
    ? { icon: '📣', title: data.announcement_title || 'หัวข้อ Announcement', mode: data.announcement_mode, priority: data.announcement_priority }
    : null
  const qaItem = data.qa_is_active
    ? { icon: '💬', title: data.weekly_question || 'คำถามสัปดาห์นี้', mode: 'qa', priority: data.qa_priority }
    : null

  // Slot assignment: both claim primary → ann wins primary, qa goes secondary
  let primarySlot: typeof annItem | null = null
  let secondarySlot: typeof qaItem | null = null

  const candidates = [annItem, qaItem].filter(Boolean) as NonNullable<typeof annItem>[]
  const primaries = candidates.filter(i => i.priority === 'primary')
  const secondaries = candidates.filter(i => i.priority === 'secondary')

  if (primaries.length >= 2) {
    primarySlot = primaries[0]
    secondarySlot = primaries[1]
  } else {
    primarySlot = primaries[0] ?? null
    secondarySlot = secondaries[0] ?? null
  }

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <PreviewSlot label="Primary" item={primarySlot} />
      <PreviewSlot label="Secondary" item={secondarySlot} />
    </div>
  )
}

// ── Toast ──────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      padding: '11px 22px', borderRadius: 999, zIndex: 999,
      background: type === 'success' ? '#3F8E5C' : '#C0392B',
      color: '#fff', fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
      boxShadow: '0 6px 24px rgba(0,0,0,0.18)', whiteSpace: 'nowrap',
      animation: 'toast-in .25s ease forwards',
    }}>
      {msg}
      <style>{`@keyframes toast-in { from { opacity:0; transform:translate(-50%,8px) } to { opacity:1; transform:translate(-50%,0) } }`}</style>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Settings() {
  const [data, setData] = useState<SettingsData>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    supabase.from('cupid_settings').select('*').eq('id', 1).single().then(({ data: row }) => {
      if (row) {
        setData({
          announcement_is_active: row.announcement_is_active ?? false,
          announcement_title: row.announcement_title ?? '',
          announcement_text: row.announcement_text ?? '',
          announcement_mode: (row.announcement_mode as 'info' | 'vote') ?? 'info',
          announcement_vote_options: row.announcement_vote_options ?? ['', '', '', ''],
          announcement_priority: (row.announcement_priority as 'primary' | 'secondary') ?? 'primary',
          qa_is_active: row.qa_is_active ?? false,
          weekly_question: row.weekly_question ?? '',
          weekly_question_options: row.weekly_question_options ?? ['', '', ''],
          qa_priority: (row.qa_priority as 'primary' | 'secondary') ?? 'secondary',
        })
      }
      setLoading(false)
    })
  }, [])

  const upd = useCallback(<K extends keyof SettingsData>(key: K, val: SettingsData[K]) => {
    setData(prev => ({ ...prev, [key]: val }))
  }, [])

  function updateVoteOption(i: number, val: string) {
    const opts = [...data.announcement_vote_options]
    opts[i] = val
    upd('announcement_vote_options', opts)
  }

  function updateQAOption(i: number, val: string) {
    const opts = [...data.weekly_question_options]
    opts[i] = val
    upd('weekly_question_options', opts)
  }

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const updateData: Record<string, unknown> = {
        announcement_is_active: data.announcement_is_active,
        announcement_title: data.announcement_title || '',
        announcement_text: data.announcement_text || '',
        announcement_mode: data.announcement_mode || 'info',
        announcement_priority: data.announcement_priority || 'primary',
        qa_is_active: data.qa_is_active,
        weekly_question: data.weekly_question || '',
        weekly_question_options: data.weekly_question_options.filter(o => o.trim() !== ''),
        qa_priority: data.qa_priority || 'secondary',
      }
      if (data.announcement_mode === 'vote') {
        updateData.announcement_vote_options = data.announcement_vote_options.filter(o => o.trim() !== '')
      } else {
        updateData.announcement_vote_options = data.announcement_vote_options
      }

      console.log('Saving settings:', updateData)

      const { error } = await supabase
        .from('cupid_settings')
        .update(updateData)
        .eq('id', 1)

      if (error) {
        console.error('Supabase error:', error.message, error.details, error.hint)
        throw error
      }

      showToast('บันทึกแล้วครับ ✓', 'success')
    } catch (err) {
      console.error('Save failed:', err)
      showToast('เกิดข้อผิดพลาด กรุณาลองใหม่ครับ', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: C.brownSoft, fontFamily: '"Sarabun", system-ui' }}>
        กำลังโหลด...
      </div>
    )
  }

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Section 1: Announcement ─────────────────────────────────────── */}
        <SectionCard highlight={data.announcement_is_active}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.announcement_is_active ? 20 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: data.announcement_is_active ? C.orangeSoft : 'rgba(44,26,14,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                transition: 'background .2s',
              }}>📣</div>
              <div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown }}>Announcement</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 1 }}>
                  {data.announcement_is_active ? 'กำลังแสดงบน Thank You Screen' : 'ปิดอยู่ครับ'}
                </div>
              </div>
            </div>
            <Toggle on={data.announcement_is_active} onChange={v => upd('announcement_is_active', v)} />
          </div>

          {data.announcement_is_active && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Title */}
              <div>
                <FieldLabel>หัวข้อ</FieldLabel>
                <LineInput
                  value={data.announcement_title}
                  onChange={v => upd('announcement_title', v)}
                  placeholder="เช่น เปิดสาขาใหม่เร็วๆนี้ครับ!"
                />
              </div>

              {/* Body */}
              <div>
                <FieldLabel>รายละเอียด</FieldLabel>
                <LineTextarea
                  value={data.announcement_text}
                  onChange={v => upd('announcement_text', v)}
                  placeholder="บอกรายละเอียดได้เลยครับ"
                  rows={3}
                />
              </div>

              {/* Mode pill picker */}
              <div>
                <FieldLabel>โหมด</FieldLabel>
                <PillPicker<'info' | 'vote'>
                  value={data.announcement_mode}
                  onChange={v => upd('announcement_mode', v)}
                  options={[
                    { val: 'info', label: '📢 แค่บอก' },
                    { val: 'vote', label: '🗳️ เปิด Vote' },
                  ]}
                />
              </div>

              {/* Vote options — 4 inputs side by side */}
              {data.announcement_mode === 'vote' && (
                <div>
                  <FieldLabel>ตัวเลือก Vote (A–D)</FieldLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                    {(['A', 'B', 'C', 'D'] as const).map((letter, i) => (
                      <div key={letter}>
                        <div style={{
                          fontFamily: '"DM Sans", system-ui', fontSize: 10, fontWeight: 700,
                          color: C.orange, marginBottom: 4, letterSpacing: 0.5,
                        }}>
                          {letter}
                        </div>
                        <input
                          value={data.announcement_vote_options[i] || ''}
                          onChange={e => updateVoteOption(i, e.target.value)}
                          placeholder={['ทองหล่อ', 'อารีย์', 'พระโขนง', 'อ่อนนุช'][i]}
                          style={{
                            width: '100%', padding: '7px 0', background: 'transparent',
                            border: 'none', borderBottom: '1.5px solid rgba(44,26,14,0.18)',
                            fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown,
                            outline: 'none', boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Priority pill picker */}
              <div>
                <FieldLabel>Priority บน Thank You Screen</FieldLabel>
                <PillPicker<'primary' | 'secondary'>
                  value={data.announcement_priority}
                  onChange={v => upd('announcement_priority', v)}
                  options={[
                    { val: 'primary', label: '⭐ Primary (ใหญ่)' },
                    { val: 'secondary', label: '◦ Secondary (เล็ก)' },
                  ]}
                />
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Section 2: Q&A ──────────────────────────────────────────────── */}
        <SectionCard highlight={data.qa_is_active}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.qa_is_active ? 20 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: data.qa_is_active ? C.orangeSoft : 'rgba(44,26,14,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                transition: 'background .2s',
              }}>💬</div>
              <div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown }}>Q&A สัปดาห์นี้</div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 1 }}>
                  {data.qa_is_active ? 'กำลังแสดงบน Thank You Screen' : 'ปิดอยู่ครับ'}
                </div>
              </div>
            </div>
            <Toggle on={data.qa_is_active} onChange={v => upd('qa_is_active', v)} />
          </div>

          {data.qa_is_active && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Question */}
              <div>
                <FieldLabel>คำถามสัปดาห์นี้</FieldLabel>
                <LineInput
                  value={data.weekly_question}
                  onChange={v => upd('weekly_question', v)}
                  placeholder="เช่น รสชาติยังเหมือนเดิมอยู่ไหมครับ?"
                />
              </div>

              {/* Options */}
              <div>
                <FieldLabel>ตัวเลือกคำตอบ</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    '✅ เหมือนเดิมครับ',
                    '📈 ดีขึ้นด้วย',
                    '😕 เปลี่ยนไปหน่อย',
                  ].map((ph, i) => (
                    <input
                      key={i}
                      value={data.weekly_question_options[i] || ''}
                      onChange={e => updateQAOption(i, e.target.value)}
                      placeholder={ph}
                      style={{
                        width: '100%', padding: '7px 0', background: 'transparent',
                        border: 'none', borderBottom: '1.5px solid rgba(44,26,14,0.18)',
                        fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brown,
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <FieldLabel>Priority บน Thank You Screen</FieldLabel>
                <PillPicker<'primary' | 'secondary'>
                  value={data.qa_priority}
                  onChange={v => upd('qa_priority', v)}
                  options={[
                    { val: 'primary', label: '⭐ Primary (ใหญ่)' },
                    { val: 'secondary', label: '◦ Secondary (เล็ก)' },
                  ]}
                />
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Section 3: Live Preview ──────────────────────────────────────── */}
        <SectionCard>
          <div style={{
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15,
            color: C.brown, marginBottom: 14,
          }}>
            👁️ ตัวอย่างบน Thank You Screen
          </div>
          <LivePreview data={data} />
          <div style={{
            marginTop: 10, fontFamily: '"Sarabun", system-ui', fontSize: 11,
            color: 'rgba(44,26,14,0.35)', textAlign: 'center',
          }}>
            Primary = แสดงก่อน / ใหญ่กว่า · Secondary = แสดงหลัง / เล็กกว่า
          </div>
        </SectionCard>

        {/* ── Save button ──────────────────────────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '14px 0', borderRadius: 14, border: 'none',
            background: C.orange, color: '#fff',
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.65 : 1, transition: 'opacity .15s',
            width: '100%',
          }}
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>

      </div>
    </>
  )
}
